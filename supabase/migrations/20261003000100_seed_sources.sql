-- 現有爬蟲使用的來源(2026-10-03 實測狀態)
-- 失效的來源先停用並寫明原因,控制台會顯示為 disabled,修好再開啟。

insert into public.sources (id, name, name_zh, pipeline, kind, url, tier, enabled, config, notes) values
  -- 協定資料庫
  ('wto-rta-is', 'WTO RTA-IS bulk export', 'WTO 區域貿易協定資料庫',
   'database', 'file', 'https://rtais.wto.org/UI/ExportAllRTAList.aspx', 'S', true, '{}',
   '整批 Excel 匯出,約 656 筆'),
  ('wto-jsi-pages', 'WTO Joint Statement Initiative pages', 'WTO 聯合聲明倡議頁面',
   'database', 'html', 'https://www.wto.org/english/tratop_e/', 'S', true,
   '{"pages": [
      "https://www.wto.org/english/tratop_e/invfac_public_e/invfac_e.htm",
      "https://www.wto.org/english/tratop_e/serv_e/jsdomreg_e.htm",
      "https://www.wto.org/english/tratop_e/msmes_e/msmes_e.htm",
      "https://www.wto.org/english/tratop_e/ppesp_e/ppesp_e.htm",
      "https://www.wto.org/english/tratop_e/envir_e/tessd_e.htm",
      "https://www.wto.org/english/tratop_e/envir_e/fossil_fuel_e.htm"]}',
   '6 個 JSI 頁面;每次固定 6 筆,目前只讀頁面基本資訊,抓不到新文件'),
  ('desta', 'DESTA (Design of Trade Agreements)', 'DESTA 貿易協定設計資料庫',
   'database', 'file', 'https://www.designoftradeagreements.org/downloads/', 'A', false, '{}',
   '2026-06 起每次 0 筆,下載網址可能已變更,待修復'),

  -- 新聞與官方公告
  ('wto-news-rss', 'WTO latest news', 'WTO 最新消息',
   'news', 'rss', 'https://www.wto.org/library/rss/latest_news_e.xml', 'S', true, '{}',
   '正常,每次約 10 則'),
  ('eu-dg-trade-news', 'EU DG Trade news', '歐盟執委會貿易總署新聞',
   'news', 'rss', 'https://policy.trade.ec.europa.eu/news_en.atom', 'S', false, '{}',
   '網址已失效(HTTP 404),待找新的 RSS 或改抓網頁'),
  ('ustr-rss', 'USTR RSS', '美國貿易代表署 RSS',
   'news', 'rss', 'https://ustr.gov/rss.xml', 'S', false, '{}',
   'RSS 最新一則停在 2009 年,已不維護;改抓新聞稿網頁'),
  ('politico-eu-trade', 'Politico Europe trade', 'Politico 歐洲版貿易新聞',
   'news', 'rss', 'https://www.politico.eu/feed/?post_type=article&trade=trade', 'B', false, '{}',
   '網站擋爬蟲(HTTP 403)'),
  ('gdelt', 'GDELT news API', 'GDELT 全球新聞資料庫',
   'news', 'api', 'https://api.gdeltproject.org/api/v2/doc/doc', 'C', false, '{}',
   '2026-06 起每次 0 筆(頻率限制 HTTP 429);預計改用 Google News RSS 查詢')
on conflict (id) do nothing;
