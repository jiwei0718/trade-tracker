-- ═══════════════════════════════════════════════════════════════════════
-- 協定追蹤工具 — 初始資料表
--
-- 分區:
--   A. 參考資料:countries、organizations
--   B. 協定主資料庫:agreements、agreement_parties、field_provenance
--   C. 來源與變動偵測:sources、source_items
--   D. 事件紀錄(只新增、不覆寫):events
--   E. 更新控制:update_settings(自動更新開關,預設關)、update_requests、
--      pipeline_runs、source_runs、source_health(檢視表)
--
-- 權限原則:
--   - 所有資料表開啟 RLS。
--   - 公開資料(協定、國家、組織、已採信事件)任何人可讀,不可寫。
--   - 寫入只走 service role(n8n、匯入腳本),它不受 RLS 限制。
--   - 更新控制的寫入權限,等加上登入功能後再開放給管理者。
-- ═══════════════════════════════════════════════════════════════════════

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── A. 參考資料 ──────────────────────────────────────────────────────

create table public.countries (
  code        text primary key,                 -- 本工具使用的代碼(英國用 UK,臺灣用 TW)
  name_zh     text not null,
  name_en     text not null,
  aliases     text[] not null default '{}',     -- 搜尋用別名(中英文、縮寫)
  lat         double precision,                 -- 3D 地球儀用的國家中心點
  lng         double precision,
  updated_at  timestamptz not null default now()
);

create table public.organizations (
  code            text primary key,             -- ASEAN、EU、WTO ...
  name_zh         text not null,
  abbr_zh         text,
  name_en         text not null,
  abbr            text,
  category        text,
  members         text[] not null default '{}', -- 成員國代碼
  founded         text,
  hq              text,
  description_zh  text,
  source_url      text,
  updated_at      timestamptz not null default now()
);

-- ─── B. 協定主資料庫 ──────────────────────────────────────────────────

create table public.agreements (
  id                    text primary key,
  name                  text not null,
  name_zh               text,
  full_name_zh          text,
  short_name            text,
  type                  text not null check (type in (
                          'bilateral','multilateral','regional','sectoral','plurilateral',
                          'jsi','ministerial','mou','joint_declaration','pilot')),
  status                text not null check (status in (
                          'in_force','signed','concluded','negotiating','suspended',
                          'cancelled','proposed','superseded','expired')),
  era                   text check (era in (
                          'pre_gatt','gatt_era','wto_birth','fta_boom','fragmentation','post_liberation')),
  key_dates             jsonb not null default '{}',   -- {signed, in_force, concluded, ...}
  latest_progress_date  text,
  latest_progress_note  text,
  trade_volume          numeric,
  description           text,
  description_zh        text,
  key_provisions        text[] not null default '{}',
  tags                  text[] not null default '{}',
  superseded_by         text,
  parent_id             text references public.agreements(id) on delete set null,
  related_ids           text[] not null default '{}',
  significance          text,
  latest_status         jsonb,                          -- {summary, detail, asOf, byTool}
  indigo                jsonb,
  source_docs           jsonb not null default '[]',
  article_structure     jsonb,
  origin                text not null default 'scraped' check (origin in ('curated','scraped')),
  data_as_of            timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index agreements_parent_id_idx on public.agreements (parent_id);
create index agreements_status_idx    on public.agreements (status);
create index agreements_tags_idx      on public.agreements using gin (tags);

create table public.agreement_parties (
  agreement_id   text not null references public.agreements(id) on delete cascade,
  party_code     text not null,                -- 國家代碼或國際組織代碼
  party_name     text,
  party_name_zh  text,
  ordinal        int  not null default 0,      -- 原始排列順序
  primary key (agreement_id, party_code)
);

create index agreement_parties_party_idx on public.agreement_parties (party_code);

-- 每個欄位目前採用值的出處與信心
create table public.field_provenance (
  agreement_id     text not null references public.agreements(id) on delete cascade,
  field            text not null,
  confidence       numeric(3,2) not null check (confidence between 0 and 1),
  source_tier      text not null check (source_tier in ('S','A','B','C','U')),
  source_label     text not null,
  source_url       text,
  extracted_at     timestamptz not null default now(),
  by_tool          text,                       -- AI 抽取時記錄模型名稱
  by_tool_version  text,
  confirmed_by     text[] not null default '{}',
  promoted_at      timestamptz,
  status           text not null default 'active'
                     check (status in ('active','pending','disputed','retracted')),
  primary key (agreement_id, field)
);

-- ─── C. 來源與變動偵測 ────────────────────────────────────────────────

create table public.sources (
  id          text primary key,
  name        text not null,
  name_zh     text,
  pipeline    text not null check (pipeline in ('database','news')),
  kind        text not null check (kind in ('file','rss','html','api','search','manual')),  -- file = Excel/CSV 下載
  url         text,
  tier        text not null default 'U' check (tier in ('S','A','B','C','U')),
  enabled     boolean not null default true,
  config      jsonb not null default '{}',     -- 抓取設定(CSS 選擇器、關鍵字等)
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 每個來源抓到的每一則項目;用來判斷「哪些是新的」,只把新項目送給 AI
create table public.source_items (
  id             bigint generated always as identity primary key,
  source_id      text not null references public.sources(id) on delete cascade,
  item_key       text not null,                -- guid、網址或文件編號
  title          text,
  url            text,
  published_at   timestamptz,
  content_hash   text,
  first_seen_at  timestamptz not null default now(),
  last_seen_at   timestamptz not null default now(),
  processed_at   timestamptz,                  -- 已完成擷取/AI 處理的時間
  raw            jsonb,
  unique (source_id, item_key)
);

create index source_items_unprocessed_idx on public.source_items (source_id) where processed_at is null;

-- ─── D. 事件紀錄 ──────────────────────────────────────────────────────

create table public.events (
  id              bigint generated always as identity primary key,
  agreement_id    text references public.agreements(id) on delete set null,
  event_type      text not null check (event_type in (
                    'new_agreement','status_change','date_added',
                    'started','concluded','signed','in_force','suspended','cancelled',
                    'expired','superseded','accession','new_document','ministerial',
                    'field_update','news')),
  event_date      text,                        -- 真實世界發生日期(YYYY-MM 或 YYYY-MM-DD)
  field           text,
  old_value       jsonb,
  new_value       jsonb,
  summary_zh      text,
  summary_en      text,
  source_id       text references public.sources(id) on delete set null,
  source_url      text,
  source_item_id  bigint references public.source_items(id) on delete set null,
  confidence      numeric(3,2) check (confidence between 0 and 1),
  status          text not null default 'active'
                    check (status in ('active','pending','disputed','retracted')),
  by_tool         text,
  run_id          bigint,
  legacy_id       text unique,                 -- 舊版 events.json 的 id,避免重複匯入
  detected_at     timestamptz not null default now()
);

create index events_agreement_idx on public.events (agreement_id, detected_at desc);
create index events_detected_idx  on public.events (detected_at desc);
create index events_status_idx    on public.events (status);

-- ─── E. 更新控制 ──────────────────────────────────────────────────────

-- 自動更新開關:預設關閉,只有使用者同意後才會打開
create table public.update_settings (
  pipeline       text primary key check (pipeline in ('database','news')),
  auto_enabled   boolean not null default false,
  schedule_cron  text not null default '0 21 * * *',   -- 臺北時間每天 21:00
  max_llm_items  int not null default 30 check (max_llm_items >= 0),
  updated_at     timestamptz not null default now(),
  updated_by     text
);

insert into public.update_settings (pipeline) values ('database'), ('news');

-- 「立即更新」請求佇列:網頁按鈕寫入,n8n 定時取出執行
create table public.update_requests (
  id            bigint generated always as identity primary key,
  pipeline      text not null check (pipeline in ('all','database','news')),
  source_id     text references public.sources(id) on delete set null,  -- 只更新單一來源時填
  requested_at  timestamptz not null default now(),
  requested_by  text,
  status        text not null default 'queued'
                  check (status in ('queued','running','done','failed','cancelled')),
  started_at    timestamptz,
  finished_at   timestamptz,
  run_id        bigint,
  note          text
);

create index update_requests_queued_idx on public.update_requests (requested_at) where status = 'queued';

create table public.pipeline_runs (
  id            bigint generated always as identity primary key,
  pipeline      text not null check (pipeline in ('all','database','news')),
  trigger       text not null check (trigger in ('manual','scheduled')),
  status        text not null default 'running'
                  check (status in ('running','success','partial','failed')),
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  llm_items     int not null default 0,
  events_count  int not null default 0,
  error         text,
  runner        text                                   -- n8n / github-actions / local
);

create table public.source_runs (
  run_id         bigint not null references public.pipeline_runs(id) on delete cascade,
  source_id      text not null references public.sources(id) on delete cascade,
  status         text not null check (status in ('ok','empty','error','skipped')),
  items_fetched  int not null default 0,
  items_new      int not null default 0,
  error          text,
  primary key (run_id, source_id)
);

alter table public.events          add constraint events_run_fk          foreign key (run_id) references public.pipeline_runs(id) on delete set null;
alter table public.update_requests add constraint update_requests_run_fk foreign key (run_id) references public.pipeline_runs(id) on delete set null;

-- ─── updated_at 觸發器 ────────────────────────────────────────────────

create trigger countries_updated_at       before update on public.countries       for each row execute function public.set_updated_at();
create trigger organizations_updated_at   before update on public.organizations   for each row execute function public.set_updated_at();
create trigger agreements_updated_at      before update on public.agreements      for each row execute function public.set_updated_at();
create trigger sources_updated_at         before update on public.sources         for each row execute function public.set_updated_at();
create trigger update_settings_updated_at before update on public.update_settings for each row execute function public.set_updated_at();

-- ─── 檢視表 ───────────────────────────────────────────────────────────

-- 與 app 現有資料形狀一致:把締約方彙整回陣列
create view public.agreements_full
with (security_invoker = on) as
select
  a.*,
  coalesce(array_agg(p.party_code    order by p.ordinal) filter (where p.party_code is not null), '{}') as parties,
  coalesce(array_agg(p.party_name    order by p.ordinal) filter (where p.party_code is not null), '{}') as party_names,
  coalesce(array_agg(p.party_name_zh order by p.ordinal) filter (where p.party_code is not null), '{}') as party_names_zh
from public.agreements a
left join public.agreement_parties p on p.agreement_id = a.id
group by a.id;

-- 來源健康燈號:連續幾次沒抓到東西或出錯(略過的不算)
create view public.source_health
with (security_invoker = on) as
with ranked as (
  select
    sr.source_id,
    sr.status,
    r.started_at,
    row_number() over (partition by sr.source_id order by r.started_at desc) as rn
  from public.source_runs sr
  join public.pipeline_runs r on r.id = sr.run_id
  where sr.status <> 'skipped'
),
first_ok as (
  select source_id, min(rn) filter (where status = 'ok') as ok_rn, count(*) as total
  from ranked
  group by source_id
),
health as (
  select
    s.id as source_id, s.name, s.name_zh, s.pipeline, s.kind, s.tier, s.enabled,
    last.started_at as last_run_at,
    last.status     as last_status,
    case
      when f.source_id is null then 0
      when f.ok_rn is null     then f.total
      else f.ok_rn - 1
    end as consecutive_failures
  from public.sources s
  left join ranked   last on last.source_id = s.id and last.rn = 1
  left join first_ok f    on f.source_id = s.id
)
select
  h.*,
  case
    when not h.enabled                 then 'disabled'
    when h.last_run_at is null         then 'never_run'
    when h.consecutive_failures >= 3   then 'red'
    when h.consecutive_failures >= 1   then 'yellow'
    else 'green'
  end as health
from health h;

-- ─── RLS 與權限 ───────────────────────────────────────────────────────

alter table public.countries          enable row level security;
alter table public.organizations      enable row level security;
alter table public.agreements         enable row level security;
alter table public.agreement_parties  enable row level security;
alter table public.field_provenance   enable row level security;
alter table public.sources            enable row level security;
alter table public.source_items       enable row level security;
alter table public.events             enable row level security;
alter table public.update_settings    enable row level security;
alter table public.update_requests    enable row level security;
alter table public.pipeline_runs      enable row level security;
alter table public.source_runs        enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on all tables in schema public to anon, authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

-- 公開唯讀
create policy "public read" on public.countries         for select to anon, authenticated using (true);
create policy "public read" on public.organizations     for select to anon, authenticated using (true);
create policy "public read" on public.agreements        for select to anon, authenticated using (true);
create policy "public read" on public.agreement_parties for select to anon, authenticated using (true);
create policy "public read" on public.field_provenance  for select to anon, authenticated using (status = 'active');
create policy "public read" on public.events            for select to anon, authenticated using (status = 'active');
create policy "public read" on public.sources           for select to anon, authenticated using (true);
create policy "public read" on public.update_settings   for select to anon, authenticated using (true);
create policy "public read" on public.pipeline_runs     for select to anon, authenticated using (true);
create policy "public read" on public.source_runs       for select to anon, authenticated using (true);
-- source_items(原始抓取內容)與 update_requests(含請求者)不開放公開讀取
