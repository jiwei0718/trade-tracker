-- 「全球協定新聞」流程的來源:Google 新聞英文與中文(臺灣)搜尋。
-- 每則新聞的信任等級依原始媒體網域判定;這裡的 tier 只是預設值。

insert into public.sources (id, name, name_zh, pipeline, kind, url, tier, enabled, config, notes) values
  ('gnews-fta-en', 'Google News — trade agreement milestones (English)', 'Google 新聞(協定進展,英文)',
   'news', 'search', 'https://news.google.com/rss/search', 'C', true,
   '{"q": "(\"free trade agreement\" OR \"trade agreement\" OR \"economic partnership agreement\" OR \"trade pact\") (signed OR signs OR \"entered into force\" OR \"enters into force\" OR \"concluded negotiations\" OR \"conclude negotiations\" OR ratified OR \"launch negotiations\")",
     "hl": "en-US", "gl": "US", "ceid": "US:en"}',
   '各國協定的簽署、生效、完成或啟動談判等新聞;AI 判斷對應哪個協定'),
  ('gnews-fta-zh', 'Google News — trade agreement milestones (Chinese)', 'Google 新聞(協定進展,中文)',
   'news', 'search', 'https://news.google.com/rss/search', 'C', true,
   '{"q": "(自由貿易協定 OR 經濟合作協議 OR 貿易協定 OR 經濟夥伴協定) (簽署 OR 生效 OR 完成談判 OR 啟動談判 OR 洽簽)",
     "hl": "zh-TW", "gl": "TW", "ceid": "TW:zh-Hant"}',
   '臺灣與華文媒體的協定進展新聞;AI 判斷對應哪個協定')
on conflict (id) do nothing;
