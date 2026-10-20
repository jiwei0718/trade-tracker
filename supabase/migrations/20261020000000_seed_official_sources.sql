-- 「官方來源追蹤」流程讀的來源:各國貿易主管機關、WTO 與區域組織秘書處自己發布的新聞 RSS/Atom。
-- 流程讀取所有 id 以 off- 開頭的來源;要新增來源就加一筆,要暫停就把 enabled 改成 false。
-- 這些都是政府或國際組織的官方發布(信任等級 S)。網址於 2026-10-20 實測可讀。

insert into public.sources (id, name, name_zh, pipeline, kind, url, tier, enabled, config, notes) values
  ('off-wto-news', 'WTO — latest news', 'WTO 最新消息',
   'news', 'rss', 'https://www.wto.org/library/rss/latest_news_e.xml', 'S', true,
   '{"lang": "en", "jurisdiction": "WTO"}', '世界貿易組織秘書處新聞'),
  ('off-ustr', 'USTR — press releases', '美國貿易代表署新聞稿',
   'news', 'rss', 'https://ustr.gov/rss.xml', 'S', true,
   '{"lang": "en", "jurisdiction": "US"}', '美國貿易代表署'),
  ('off-eu-press', 'European Commission — press corner', '歐盟執委會新聞中心',
   'news', 'rss', 'https://ec.europa.eu/commission/presscorner/api/rss?language=en', 'S', true,
   '{"lang": "en", "jurisdiction": "EU"}', '執委會全部新聞稿;流程用關鍵字只留協定相關的'),
  ('off-uk-dbt', 'GOV.UK — Department for Business and Trade news', '英國商業貿易部新聞',
   'news', 'rss', 'https://www.gov.uk/search/news-and-communications.atom?organisations%5B%5D=department-for-business-and-trade', 'S', true,
   '{"lang": "en", "jurisdiction": "UK", "format": "atom"}', '英國商業貿易部(Atom 格式)'),
  ('off-ca-gac', 'Global Affairs Canada — news releases', '加拿大全球事務部新聞稿',
   'news', 'rss', 'https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofforeignaffairstradeanddevelopment&type=newsreleases&sort=publishedDate&orderBy=desc&pick=50&format=atom', 'S', true,
   '{"lang": "en", "jurisdiction": "CA", "format": "atom"}', '加拿大全球事務部(外交、貿易與發展;Atom 格式)'),
  ('off-asean', 'ASEAN Secretariat — news', '東協秘書處新聞',
   'news', 'rss', 'https://asean.org/feed/', 'S', true,
   '{"lang": "en", "jurisdiction": "ASEAN"}', '東協秘書處'),
  ('off-mercosur', 'MERCOSUR — news', '南方共同市場新聞',
   'news', 'rss', 'https://www.mercosur.int/feed/', 'S', true,
   '{"lang": "es", "jurisdiction": "MERCOSUR"}', '南共市秘書處(西班牙文)'),
  ('off-sg-meti', 'Singapore Ministry of Energy, Trade and Industry — newsroom', '新加坡能源、貿易及工業部新聞',
   'news', 'rss', 'https://www.meti.gov.sg/newsroom/rss.xml', 'S', true,
   '{"lang": "en", "jurisdiction": "SG"}', '新加坡貿工部新聞稿與部長談話(原 MTI 網站公告的訂閱網址)'),
  ('off-tw-boft-news', 'Bureau of Foreign Trade (Taiwan) — news releases', '經濟部國際貿易署新聞稿',
   'news', 'rss', 'https://www.trade.gov.tw/RSS/List.aspx?nodeID=40', 'S', true,
   '{"lang": "zh", "jurisdiction": "TW"}', '國際貿易署新聞稿'),
  ('off-tw-boft-trade', 'Bureau of Foreign Trade (Taiwan) — international trade news', '經濟部國際貿易署國際經貿資訊',
   'news', 'rss', 'https://www.trade.gov.tw/RSS/List.aspx?nodeID=45', 'S', true,
   '{"lang": "zh", "jurisdiction": "TW"}', '國際貿易署整理的各國經貿動態')
on conflict (id) do nothing;
