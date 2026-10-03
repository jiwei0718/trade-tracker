-- 雙重保險:RLS 之外,直接收回一般訪客與登入使用者的寫入權限。
-- Supabase 預設會把 public schema 的所有權限給 anon/authenticated,只靠 RLS 擋寫入;
-- 這裡讓「忘了加 RLS 的新資料表」也不會被外部寫入。
-- 之後要讓管理者從網頁操作開關時,再針對那幾張表單獨授權。

revoke insert, update, delete, truncate on all tables in schema public from anon, authenticated;

alter default privileges in schema public
  revoke insert, update, delete, truncate on tables from anon, authenticated;
