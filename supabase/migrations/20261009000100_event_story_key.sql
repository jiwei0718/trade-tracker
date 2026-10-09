-- 同一件事被多個來源報導時,用 story_key 把事件串在一起。
-- 網頁每個 story 只顯示最可信的一則,其餘列為「另有 N 則報導」。
-- 沒有 story_key 的事件視為自成一個 story(event-<id>)。

alter table public.events add column story_key text;

create index events_story_idx on public.events (story_key) where story_key is not null;
