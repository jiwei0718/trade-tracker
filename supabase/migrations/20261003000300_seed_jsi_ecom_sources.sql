-- 第一條流程(WTO 電子商務 JSI)使用的新來源

insert into public.sources (id, name, name_zh, pipeline, kind, url, tier, enabled, config, notes) values
  ('wto-docs-ecom', 'WTO Documents Online — e-commerce JSI', 'WTO 官方文件庫(電子商務 JSI)',
   'database', 'api', 'https://docs.wto.org/dol2fe/Pages/SS/GetXMLResults.aspx', 'S', true,
   '{"query": "@Symbol=\"WT/MIN(26)/42\" OR @Symbol=INF/ECOM/* OR @Symbol=ECA/DEP/* OR @Symbol=\"WT/GC/283*\" OR (WT/GC/W/* AND @BodyMentioned=Joint statement on electronic commerce)",
     "language": "English"}',
   'WTO 電子商務 JSI 頁面背後使用的官方文件查詢;另加 WT/GC/283 系列'),
  ('gnews-wto-ecom', 'Google News — WTO e-commerce', 'Google 新聞(WTO 電子商務)',
   'news', 'search', 'https://news.google.com/rss/search', 'C', true,
   '{"q": "\"WTO\" (\"e-commerce\" OR \"electronic commerce\" OR \"electronic transmissions\") agreement",
     "hl": "en-US", "gl": "US", "ceid": "US:en"}',
   '彙整多家媒體;每則新聞的信任等級依原始媒體網域判定')
on conflict (id) do nothing;
