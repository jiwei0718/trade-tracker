-- 人工查證:人工依官方公告與可信報導修正協定資料時,事件記在這個來源底下
-- (backend/import_to_supabase.py 會比對資料庫,為每項修正產生一則事件)

insert into public.sources (id, name, name_zh, pipeline, kind, url, tier, enabled, notes) values
  ('manual-curation', 'Manual curation', '人工查證', 'database', 'manual', null, 'A', true,
   '人工依官方公告與可信報導查證後修正;不是自動抓取的來源')
on conflict (id) do nothing;

-- WTO 聯合聲明倡議頁面:新架構沒有用到這個來源。JSI 文件由「WTO 官方文件庫(電子商務 JSI)」
-- 追蹤,JSI 協定本身改由人工查證維護。
update public.sources
set enabled = false,
    notes = '未納入新流程:JSI 文件改由「WTO 官方文件庫」追蹤,協定本身由人工查證維護'
where id = 'wto-jsi-pages';
