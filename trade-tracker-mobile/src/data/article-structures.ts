import type { ArticleGroup } from './types';

/**
 * Detailed clause/article breakdowns for digital trade agreements.
 * Keyed by agreement id. Bundled in-app (reference data that rarely changes).
 * Source: user's research tables (USJDTA / SADEA / UKSDEA / KSDPA / WTO JSI).
 */
export const ARTICLE_STRUCTURES: Record<string, ArticleGroup[]> = {
  // ─── 臺日數位貿易協議 (Taiwan–Japan Digital Trade Agreement) ─────────
  //  全 30 條官方中譯全文（中華民國政府官方版，臺灣日本關係協會 2025/12/4 簽署）
  'taiwan-japan-dta': (() => {
    const OF = (zh: string) => ({
      zh,
      zhSource: 'official' as const,
      zhSourceNote: '中華民國政府官方中譯本（臺灣日本關係協會公布；本協議以英文作準）',
      sourceUrl: 'https://www.trade.gov.tw/',
    });
    return [
      {
        theme: '定義、目標與範圍', themeEn: 'Definitions, Objectives & Scope',
        articles: [
          { num: 'Art.1', zh: '定義', en: 'Definitions', fullText: OF('本協議定義之用語包括：\n(a)「演算法」：為解決問題或取得結果而採取之既定步驟序列。\n(b)「領域」：就日本台灣交流協會指日本；就臺灣日本關係協會指臺灣。\n(c)「加密演算法或密碼」、(d)「密文」、(j)「加密技術」、(p)「加密」、(r)「金鑰」：與密碼學相關之定義。\n(e)「商業電子訊息」：為商業目的透過電信服務向個人電子地址發送之電子訊息（至少包括電子郵件）。\n(f)「商業ICT產品」：為商業應用而設計、以電子方式進行資訊處理與通訊之產品（含軟體）。\n(g)「算力設施」：處理或儲存商業用資料之電腦伺服器及儲存裝置。\n(h)「涵蓋之企業」、(i)「涵蓋之人」：由他方之個人所有或控制之企業，或他方之個人。\n(k)「數位產品」：以數位方式編碼、為商業銷售或分銷而製作且得透過電子傳輸之電腦程式、文字、影片、圖像、錄音等（不含數位化金融工具）。\n(l)「電子驗證」、(m)「電子發票」、(n)「開立電子發票架構」、(o)「電子簽章」、(q)「電子傳輸」、(s)「詮釋資料」、(t)「開放政府資料」、(u)「人」、(v)「貿易管理文件」、(w)「未經請求之商業電子訊息」、(x)「WTO協定」。') },
          { num: 'Art.2', zh: '原則與目標', en: 'Principles and Objectives', fullText: OF('1. 雙方認知數位貿易所提供之經濟成長及機會、建立促進消費者對數位貿易信心架構之重要性，及促進數位貿易發展與使用之重要性。\n2. 本協議目的係：(a) 促進雙方領域內之電子商務及全球數位貿易之更廣泛使用；(b) 促成營造對數位貿易使用具信任與信心之環境；及 (c) 加強在雙方領域就數位貿易發展之合作。') },
          { num: 'Art.3', zh: '範圍', en: 'Scope', fullText: OF('1. 本協議不適用於任一方就下列事項採取或維持之措施：(a) 政府採購；(b) 由相關主管機關提供、既非以商業方式提供亦非與他者競爭之服務（除適用 GATS 金融服務附件第1條(c)項外）；(c) 由相關主管機關持有或處理之資訊及相關措施（第18條另有規定者除外）。\n2. 本協議任何規定不適用於稅收措施。\n3. 本協議不得解釋為影響雙方依《服務貿易總協定》(GATS) 所做之現行有效承諾。\n4. 倘本協議與依 GATS 所做之現行承諾不一致，應以 GATS 承諾為準。') },
        ],
      },
      {
        theme: '市場開放', themeEn: 'Market Access',
        articles: [
          { num: 'Art.4', zh: '關稅', en: 'Customs Duties', fullText: OF('1. 雙方應請各自領域內相關主管機關，不得對一方之人與他方之人間之電子傳輸（包括以電子方式傳輸之內容）課徵關稅。\n2. 為臻明確，第1項不禁止任一方對以電子方式傳輸之內容課徵內地稅、規費或其他費用，惟該等稅捐、規費或費用應以符合本協議之方式課徵。') },
          { num: 'Art.5', zh: '數位產品之非歧視性待遇', en: 'Non-Discriminatory Treatment of Digital Products', fullText: OF('1. 雙方應請相關主管機關對在他方領域內創作、製作、出版、簽約、委託或首次依商業條款提供之數位產品，或其作者/表演者/製作人/開發者/所有者係他方之人之數位產品，不得給予低於其他同類數位產品之待遇。\n2. 關於智慧財產權，第1項不適用於與相關智財協定中權利義務不一致之情形。\n3. 本條不適用於補貼或補助（含貸款、保證及保險）。\n4. 本條不適用於廣播。') },
          { num: 'Art.16', zh: '原始碼', en: 'Source Code', fullText: OF('1. 雙方應請相關主管機關，不得要求移轉或存取他方之人持有之軟體原始碼、或要求移轉或存取該原始碼表達之演算法，以作為該軟體或含該軟體之產品於其領域內進口、分銷、銷售或使用之條件。\n2. 第1項不妨礙監管機構或司法機關於特定調查、檢查、審查、執法行動或司法程序中，要求他方之人保存及提供軟體原始碼或演算法（須受防止未經授權揭露之防護措施限制）。') },
          { num: 'Art.17', zh: '使用加密技術之商業資訊與通訊技術產品', en: 'Commercial ICT Products that Use Cryptography', fullText: OF('1. 雙方應請相關主管機關，不得要求商業 ICT 產品之製造商或供應商為下列行為，以作為製造、銷售、分銷、進口或使用之條件：(a) 移轉或提供存取與加密技術相關之專屬資訊（如私鑰、秘密參數、演算法規格）；(b) 與各自領域之人建立夥伴關係或合作；或 (c) 使用或整合特定之加密演算法或密碼。\n2~3. 不妨礙監管/司法機關於調查等程序要求提供資訊（須防止未經授權揭露）。本條不適用於執法機關依法律程序取得存取、金融工具監管、政府網絡存取、金融監理，及主管機關自用之產品。') },
        ],
      },
      {
        theme: '資料流動', themeEn: 'Data Flows',
        articles: [
          { num: 'Art.12', zh: '以電子方式跨境傳輸資訊', en: 'Cross-Border Transfer of Information by Electronic Means', fullText: OF('1. 雙方應請相關主管機關，不得禁止或限制以電子方式跨境傳輸資訊（包括個人資訊），若該活動係為協議涵蓋之人之商業運作所需。\n2. 本條不妨礙任一方為達正當公共政策目的所必要而與第1項不一致之措施，前提係該措施：(a) 適用方式不構成專斷或無理之歧視或變相之貿易限制；及 (b) 所施加之限制不超過為達成該政策目的所必要者。') },
          { num: 'Art.13', zh: '算力設施位置', en: 'Location of Computing Facilities', fullText: OF('1. 雙方應請相關主管機關不得要求涵蓋之人在該方領域使用或設置算力設施，以作為其在該領域從事營業之條件。\n2. 本條不妨礙任一方為達正當公共政策目的所必要而與第1項不一致之措施，前提係該措施不構成專斷/無理歧視或變相貿易限制，且限制不超過必要程度。') },
          { num: 'Art.18', zh: '開放政府資料', en: 'Open Government Data', fullText: OF('1. 雙方認知將區域或地方機關所持有資料以數位形式供公眾存取及使用之效益。\n2. 雙方宜鼓勵相關主管機關擴大開放政府資料之涵蓋範圍。\n3. 於選擇開放之範圍內，致力確保資料：(a) 機器可讀及開放格式；(b) 可搜尋及擷取；(c) 及時更新；(d) 附詮釋資料；(e) 以無償或合理成本普遍提供。\n4. 致力避免不當阻礙重製、重新散布、重新分組或商業/非商業使用。\n5. 致力就促進公眾存取政府開放資料合作，特別針對中小企業。') },
        ],
      },
      {
        theme: '數位貿易便捷化', themeEn: 'Digital Trade Facilitation',
        articles: [
          { num: 'Art.6', zh: '電子交易架構', en: 'Electronic Transactions Framework', fullText: OF('1. 雙方應請相關主管機關維持一套規範電子交易之法律架構，符合《1996 年聯合國國際貿易法委員會電子商務模範法》或《聯合國國際契約使用電子通訊公約》(2005) 之原則。\n2. 並致力：(a) 避免對電子交易施以不必要之監管負擔；及 (b) 促進利害關係人對法律架構研擬提供意見。') },
          { num: 'Art.7', zh: '規章', en: 'Regulations', fullText: OF('雙方應請各自領域內相關主管機關確保其所有影響電子商務之普遍適用措施（包括與蒐集資訊相關之措施），均以合理、客觀及公正之方式實施。') },
          { num: 'Art.8', zh: '電子驗證與電子簽章', en: 'Electronic Authentication and Electronic Signatures', fullText: OF('1. 除法律另有規定，不得僅因簽章係電子形式即否定其法律效果、效力或證據能力。\n2. 不得：(a) 禁止交易參與方共同決定適當之電子驗證方法或簽章；或 (b) 阻止其向司法/行政機關證明交易符合相關法律要求。\n3. 縱有第2項，仍得就特定交易類型要求符合特定效能標準或經認可機構驗證。\n4. 於法律允許範圍內，將第1~3項適用於電子印鑑、電子時間戳記及電子掛號投遞服務。\n5~6. 鼓勵使用可互通之電子驗證；得於自願基礎上鼓勵電子簽章相互承認。') },
          { num: 'Art.19', zh: '以電子方式訂立契約', en: 'Conclusion of Contracts by Electronic Means', fullText: OF('除法律另有規定，雙方應請相關主管機關不得採取或維持以下措施：(a) 僅因契約係以電子方式訂立即否定其法律效果、效力或可執行性；或 (b) 以其他方式對使用以電子方式訂立之契約造成障礙。') },
          { num: 'Art.20', zh: '開立電子發票', en: 'Electronic Invoicing', fullText: OF('1. 雙方認知開立電子發票架構有助增進電子商務交易之成本效益、效率、準確性及可靠性。\n2. 若制定相關措施，致力設計以支持跨境互通性，並考量相關國際標準、指引或建議。\n3. 酌情致力分享開立電子發票之最佳實務作法。') },
          { num: 'Art.22', zh: '無紙化貿易管理', en: 'Paperless Trading', fullText: OF('1. 雙方應請相關主管機關致力向公眾提供所有貿易管理文件之電子版本。\n2. 致力接受以電子形式提交之貿易管理文件與紙本具同等法律效力。\n3. 於國際場域合作，以提升對電子形式貿易管理文件之接受程度。') },
        ],
      },
      {
        theme: '數位信任', themeEn: 'Digital Trust',
        articles: [
          { num: 'Art.9', zh: '線上消費者保護', en: 'Online Consumer Protection', fullText: OF('1. 雙方認知採取並維持透明有效措施以保護消費者免受詐欺及欺騙性商業行為侵害之重要性。\n2. 採取或維持消費者保護法規，防止對線上消費者造成實際或潛在損害之詐欺及欺騙性商業行為。\n3. 致力確保：(a) 提供者公正誠信對待消費者；(b) 提供完整、準確、透明之商品/服務資訊；(c) 商品及服務之安全性。\n4. 提供不低於其他形式商業之消費者保護水準。\n5~6. 消費者保護機關間合作；促進消費者對救濟或申訴機制（含跨境）之可及性與認知。') },
          { num: 'Art.10', zh: '個人資訊保護', en: 'Personal Information Protection', fullText: OF('1. 雙方認知保護電子商務使用者個人資訊之經濟與社會效益。\n2. 採取或維持個人資訊保護之法律架構，並考量相關國際機構之原則與指引；認知對政府存取私部門持有個人資料採高標準保護（如 OECD 相關原則）有助促進數位經濟信任。\n3~4. 致力採取非歧視性作法；公布救濟途徑及法遵指引。\n5~6. 鼓勵發展促進不同制度相容性之機制，包括全球跨境隱私規則 (CBPR) 制度及全球資料處理者隱私認證 (PRP) 制度，並致力促進「全球 CBPR 論壇」。\n7. 確保對個人資訊跨境流動之限制均屬必要且與風險相稱。') },
          { num: 'Art.11', zh: '為電子商務接取與使用網際網路之原則', en: 'Principles on Access to and Use of the Internet for Electronic Commerce', fullText: OF('雙方依各自政策、法律及規定，宜請相關主管機關採取或維持適當措施，確保其領域內消費者得：(a) 於合理、透明及非歧視性之網絡管理下，接取與使用其選擇之網際網路服務及應用程式；(b) 將其選擇之裝置連結網際網路（不得損害網絡）；及 (c) 取得有關其網際網路接取服務提供者網絡管理作法之資訊。') },
          { num: 'Art.14', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages', fullText: OF('1. 採取或維持措施：(a) 要求提供者加強接收方免於持續接收之能力；(b) 依法規要求須取得接收方同意；或 (c) 以其他方式使未經請求之商業電子訊息最少化。\n2. 確保商業電子訊息可清楚辨識、揭露代表何人發送，並使接收方得隨時免費要求停止接收。\n3. 對違規發送方提供救濟或追訴途徑。\n4. 致力就共同關切之適當案件合作。') },
          { num: 'Art.15', zh: '網路安全', en: 'Cybersecurity', fullText: OF('1. 雙方認知網路安全威脅將損害對電子商務之信心。\n2. 致力：(a) 建立各自負責因應網路安全事件之能力；及 (b) 合作識別並減輕惡意入侵或惡意程式碼散布、及時因應事件並分享資訊與最佳實務。\n3. 認知以風險為基礎之作法（依風險管理最佳實務及以共識、透明、開放方式制定之標準）之重要性，並鼓勵企業採用。') },
          { num: 'Art.23', zh: '網際網路服務提供者', en: 'Internet Service Providers', fullText: OF('1. 為鼓勵 ISP 與權利人合作保護智慧財產權，雙方應請相關主管機關於 ISP 遵循相關程序移除侵權內容時，依法限制該 ISP 之責任。\n2. 建立機制，使權利人就其有正當理由主張侵權之內容已向 ISP 提出有效通知者，得依法要求自 ISP 取得資訊發送方之身分資訊。') },
        ],
      },
      {
        theme: '合作與對話機制', themeEn: 'Cooperation & Dialogue',
        articles: [
          { num: 'Art.21', zh: '透明化', en: 'Transparency', fullText: OF('1. 儘速公布關於或影響本協議運作之普遍適用措施；無法公布者以其他方式公開，並於可行時在網際網路公開。\n2. 對任一方就具體資訊之請求儘速回覆。\n3. 於可能時：(a) 提前公布擬採取之措施；及 (b) 提供利害關係人及他方提出意見之合理機會。\n4. 於要求公布資訊時，於可能情形確保在線上公布。') },
          { num: 'Art.24', zh: '合作', en: 'Cooperation', fullText: OF('雙方認知電子商務之全球性特質，應請相關主管機關致力：(a) 協助中小企業克服使用電子商務之障礙；(b) 就法規、政策、執行及法遵交換資訊與經驗（含個資保護、線上消費者保護、未經請求商業電子訊息、電子通訊安全、電子驗證、主管機關數位化等）；(c) 就消費者取得線上商品服務交換意見；(d) 積極參與區域及多邊場域；(e) 鼓勵私部門研擬自律方法（行為準則、契約範本、指引及執行機制）。') },
        ],
      },
      {
        theme: '例外規定', themeEn: 'Exceptions',
        articles: [
          { num: 'Art.25', zh: '一般例外', en: 'General Exceptions', fullText: OF('為本協議目的，《1994 年關稅暨貿易總協定》第二十條及其解釋性附註，以及《服務貿易總協定》第十四條，應準用之。') },
          { num: 'Art.26', zh: '安全例外', en: 'Security Exceptions', fullText: OF('本協議任何規定均不得解釋為要求任一方：(a) 提供其認揭露將違背重大安全利益之資訊；(b) 阻止其採取保護重大安全利益所必要之行動（涉及核材料、武器彈藥戰爭器材貿易、軍事供應服務、保護關鍵公共基礎設施，或於戰爭/武裝衝突/緊急情況期間）；或 (c) 阻止其採取旨在配合《聯合國憲章》維護國際和平與安全之措施。') },
          { num: 'Art.27', zh: '審慎例外', en: 'Prudential Exceptions', fullText: OF('1. 本協議不妨礙任一方基於審慎理由（保護投資人、存款人、保單持有人，或確保金融體系完整與穩定）採取或維持措施；惟不得以該等措施作為規避本協議承諾或義務之手段。\n2. 本協議不適用於任何公共實體為推行貨幣及相關信貸政策或匯率政策而採取之具普遍適用且不具歧視性之措施。') },
        ],
      },
      {
        theme: '協議管理', themeEn: 'Administration',
        articles: [
          { num: 'Art.28', zh: '諮商', en: 'Consultations', fullText: OF('若一方於任何時間對他方執行本協議有所關切，關切一方得以書面向他方請求諮商。雙方應盡一切努力達成相互滿意之解決方案。') },
          { num: 'Art.29', zh: '總體檢討', en: 'General Review', fullText: OF('經任一方請求，雙方得於雙方決定之任何時間，就本協議之執行與運作進行總體檢討。') },
          { num: 'Art.30', zh: '生效、修正與終止', en: 'Entry into Force, Modification and Termination', fullText: OF('1. 本協議自雙方相互通知各自程序完成之日起生效。\n2. 縱「2013 年電子商務協議」第12條第3項另有規定，該協議仍應自本協議生效之日起終止。\n3. 任一方得隨時提出諮商請求以修正本協議。\n4. 任一方得於一年前以書面通知他方終止本協議。\n（本協議以英文製作一式兩份，於 2025 年 12 月 4 日於臺北完成。）') },
        ],
      },
    ];
  })(),

  // ─── 美日數位貿易協定 (US–Japan Digital Trade Agreement) ───────────
  'us-japan-dta': [
    {
      theme: '定義、目標與範圍', themeEn: 'Definitions, Objectives & Scope',
      articles: [
        { num: 'Art.1', zh: '定義', en: 'Definitions' },
        { num: 'Art.2', zh: '適用範圍', en: 'Scope' },
      ],
    },
    {
      theme: '市場開放', themeEn: 'Market Access',
      articles: [
        { num: 'Art.7', zh: '關稅', en: 'Customs Duties' },
        { num: 'Art.8', zh: '數位產品之非歧視待遇', en: 'Non-Discriminatory Treatment of Digital Products' },
        { num: 'Art.17', zh: '原始碼', en: 'Source Code' },
        { num: 'Art.21', zh: '使用密碼學之資通訊科技產品', en: 'ICT Goods that Use Cryptography' },
      ],
    },
    {
      theme: '資料流動', themeEn: 'Data Flows',
      articles: [
        { num: 'Art.11', zh: '以電子方式跨境傳輸資訊', en: 'Cross-Border Transfer of Information by Electronic Means' },
        { num: 'Art.12', zh: '運算設施位置', en: 'Location of Computing Facilities' },
        { num: 'Art.13', zh: '金融服務業運算設施位置', en: 'Location of Financial-Service Computing Facilities' },
        { num: 'Art.20', zh: '開放政府資料', en: 'Open Government Data' },
      ],
    },
    {
      theme: '數位貿易便捷化', themeEn: 'Digital Trade Facilitation',
      articles: [
        { num: 'Art.9', zh: '國內電子交易框架', en: 'Domestic Electronic Transactions Framework' },
        { num: 'Art.10', zh: '電子認證與電子簽章', en: 'Electronic Authentication and Electronic Signatures' },
        { num: 'Art.18', zh: '互動式電腦服務', en: 'Interactive Computer Services' },
      ],
    },
    {
      theme: '數位信任', themeEn: 'Digital Trust',
      articles: [
        { num: 'Art.14', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.15', zh: '個人資訊保護', en: 'Personal Information Protection' },
        { num: 'Art.16', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        { num: 'Art.19', zh: '網路安全', en: 'Cybersecurity' },
      ],
    },
    {
      theme: '例外規定', themeEn: 'Exceptions',
      articles: [
        { num: 'Art.3', zh: '一般例外', en: 'General Exceptions' },
        { num: 'Art.4', zh: '安全例外', en: 'Security Exceptions' },
        { num: 'Art.5', zh: '審慎例外與貨幣匯率政策例外', en: 'Prudential Exception and Monetary and Exchange Rate Policy Exception' },
      ],
    },
    {
      theme: '協議管理', themeEn: 'Administration',
      articles: [
        { num: 'Art.6', zh: '稅收', en: 'Taxation' },
        { num: 'Art.22', zh: '修正、生效與終止', en: 'Amendment, Entry into Force, and Termination' },
      ],
    },
  ],

  // ─── 星澳數位經濟協定 (Singapore–Australia Digital Economy Agreement) ─
  'singapore-australia-dea': [
    {
      theme: '定義、目標與範圍', themeEn: 'Definitions, Objectives & Scope',
      articles: [
        { num: 'Art.1', zh: '定義', en: 'Definitions' },
        { num: 'Art.2', zh: '適用範圍', en: 'Scope' },
      ],
    },
    {
      theme: '市場開放', themeEn: 'Market Access',
      articles: [
        { num: 'Art.5', zh: '關稅', en: 'Customs Duties' },
        { num: 'Art.6', zh: '數位產品非歧視待遇', en: 'Non-Discriminatory Treatment of Digital Products' },
        { num: 'Art.7', zh: '使用密碼學之資通訊產品', en: 'ICT Products that Use Cryptography' },
        { num: 'Art.28', zh: '原始碼', en: 'Source Code' },
      ],
    },
    {
      theme: '資料流動', themeEn: 'Data Flows',
      articles: [
        { num: 'Art.23', zh: '以電子方式跨境傳輸資訊', en: 'Cross-Border Transfer of Information by Electronic Means' },
        { num: 'Art.24', zh: '運算設施位置', en: 'Location of Computing Facilities' },
        { num: 'Art.25', zh: '金融服務之運算設施位置', en: 'Location of Computing Facilities for Financial Services' },
        { num: 'Art.27', zh: '開放政府資料', en: 'Open Government Data' },
      ],
    },
    {
      theme: '數位貿易便捷化', themeEn: 'Digital Trade Facilitation',
      articles: [
        { num: 'Art.8', zh: '國內電子交易框架', en: 'Domestic Electronic Transactions Framework' },
        { num: 'Art.9', zh: '電子認證與電子簽章', en: 'Electronic Authentication and Electronic Signatures' },
        { num: 'Art.10', zh: '電子發票', en: 'Electronic Invoicing' },
        { num: 'Art.11', zh: '電子支付', en: 'Electronic Payments' },
        { num: 'Art.12', zh: '無紙化貿易', en: 'Paperless Trading' },
        { num: 'Art.13', zh: '快遞貨件', en: 'Express Shipments' },
        { num: 'Art.20', zh: '電子商務之網際網路接取與使用原則', en: 'Principles on Access to and Use of the Internet for Electronic Commerce' },
        { num: 'Art.22', zh: '海底電信電纜系統', en: 'Submarine Telecommunications Cable Systems' },
      ],
    },
    {
      theme: '數位信任', themeEn: 'Digital Trust',
      articles: [
        { num: 'Art.15', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.17', zh: '個人資訊保護', en: 'Personal Information Protection' },
        { num: 'Art.18', zh: '創造安全的線上環境', en: 'Creating a Safe Online Environment' },
        { num: 'Art.19', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        { num: 'Art.34', zh: '網路安全', en: 'Cybersecurity' },
      ],
    },
    {
      theme: '新興技術與趨勢', themeEn: 'Emerging Tech & Trends',
      articles: [
        { num: 'Art.16', zh: '競爭政策合作', en: 'Cooperation on Competition Policy' },
        { num: 'Art.21', zh: '網際網路互連費用分攤', en: 'Internet Interconnection Charge Sharing' },
        { num: 'Art.26', zh: '資料創新', en: 'Data Innovation' },
        { num: 'Art.29', zh: '數位身分', en: 'Digital Identities' },
        { num: 'Art.30', zh: '數位貿易之標準與符合性評鑑', en: 'Standards and Conformity Assessment for Digital Trade' },
        { num: 'Art.31', zh: '人工智慧', en: 'Artificial Intelligence' },
        { num: 'Art.32', zh: '金融科技與法規科技合作', en: 'FinTech and RegTech Cooperation' },
      ],
    },
    {
      theme: '數位包容與發展', themeEn: 'Digital Inclusion & Development',
      articles: [
        { num: 'Art.36', zh: '中小企業', en: 'Small and Medium Enterprises' },
        { num: 'Art.37', zh: '能力建設', en: 'Capacity Building' },
      ],
    },
    {
      theme: '合作與對話機制', themeEn: 'Cooperation & Dialogue',
      articles: [
        { num: 'Art.33', zh: '合作', en: 'Cooperation' },
        { num: 'Art.35', zh: '利害關係人參與', en: 'Stakeholder Engagement' },
      ],
    },
    {
      theme: '例外規定', themeEn: 'Exceptions',
      articles: [
        { num: 'Art.3', zh: '一般例外', en: 'General Exceptions' },
      ],
    },
    {
      theme: '協議管理', themeEn: 'Administration',
      articles: [
        { num: 'Art.4', zh: '資訊揭露', en: 'Disclosure of Information' },
        { num: 'Art.14', zh: '透明度', en: 'Transparency' },
        { num: 'Art.38', zh: '檢視', en: 'Review' },
      ],
    },
  ],

  // ─── 英國–新加坡數位經濟協定 (UK–Singapore Digital Economy Agreement) ─
  'uk-singapore-dea': [
    {
      theme: '定義、目標與範圍', themeEn: 'Definitions, Objectives & Scope',
      articles: [
        { num: 'Art.1', zh: '定義（主協定）', en: 'Definitions' },
        { num: 'Art.8.57', zh: '定義（Annex A）', en: 'Definitions' },
        { num: 'Art.8.58', zh: '目標與適用範圍', en: 'Objectives and Scope' },
        { num: 'Art.8.49', zh: '適用範圍與定義（Annex B）', en: 'Scope and Definitions' },
      ],
    },
    {
      theme: '市場開放', themeEn: 'Market Access',
      articles: [
        { num: 'Art.8.59', zh: '關稅', en: 'Customs Duties' },
        { num: 'Art.8.61-J', zh: '使用密碼學之商用資通訊產品', en: 'Commercial ICT Products that Use Cryptography' },
        { num: 'Art.8.61-K', zh: '原始碼', en: 'Source Code' },
      ],
    },
    {
      theme: '資料流動', themeEn: 'Data Flows',
      articles: [
        { num: 'Art.8.61-F', zh: '以電子方式跨境傳輸資訊', en: 'Cross-Border Transfer of Information by Electronic Means' },
        { num: 'Art.8.61-G', zh: '運算設施位置', en: 'Location of Computing Facilities' },
        { num: 'Art.8.61-H', zh: '開放政府資訊', en: 'Open Government Information' },
        { num: 'Art.8.54', zh: '金融資訊（Annex B）', en: 'Financial Information' },
      ],
    },
    {
      theme: '數位貿易便捷化', themeEn: 'Digital Trade Facilitation',
      articles: [
        { num: 'Art.8.60', zh: '國內電子交易框架與電子契約', en: 'Domestic Electronic Transactions Framework and Electronic Contracts' },
        { num: 'Art.8.61', zh: '電子認證', en: 'Electronic Authentication' },
        { num: 'Art.8.61-A', zh: '電子發票', en: 'Electronic Invoicing' },
        { num: 'Art.8.61-B', zh: '無紙化貿易', en: 'Paperless Trading' },
        { num: 'Art.8.61-C', zh: '物流', en: 'Logistics' },
        { num: 'Art.8.54-A', zh: '電子支付（Annex B）', en: 'Electronic Payments' },
      ],
    },
    {
      theme: '數位信任', themeEn: 'Digital Trust',
      articles: [
        { num: 'Art.8.61-E', zh: '個人資訊保護', en: 'Personal Information Protection' },
        { num: 'Art.8.61-L', zh: '網路安全', en: 'Cyber Security' },
        { num: 'Art.8.61-M', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.8.61-N', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        { num: 'Art.8.61-O', zh: '線上安全與保安', en: 'Safety and Security Online' },
      ],
    },
    {
      theme: '新興技術與趨勢', themeEn: 'Emerging Tech & Trends',
      articles: [
        { num: 'Art.8.61-D', zh: '標準與符合性評鑑', en: 'Standards and Conformity Assessment' },
        { num: 'Art.8.61-I', zh: '資料創新', en: 'Data Innovation' },
        { num: 'Art.8.61-R', zh: '人工智慧與新興技術', en: 'Artificial Intelligence and Emerging Technologies' },
        { num: 'Art.8.61-S', zh: '數位身分', en: 'Digital Identities' },
        { num: 'Art.8.61-T', zh: '法律科技合作', en: 'Lawtech Cooperation' },
        { num: 'Art.8.61-U', zh: '競爭政策合作', en: 'Cooperation on Competition Policy' },
        { num: 'Art.8.53', zh: '新金融服務（Annex B）', en: 'New Financial Services' },
      ],
    },
    {
      theme: '數位包容與發展', themeEn: 'Digital Inclusion & Development',
      articles: [
        { num: 'Art.8.61-P', zh: '數位包容', en: 'Digital Inclusion' },
        { num: 'Art.8.61-Q', zh: '中小企業', en: 'Small and Medium-sized Enterprises' },
      ],
    },
    {
      theme: '合作與對話機制', themeEn: 'Cooperation & Dialogue',
      articles: [
        { num: 'Art.3', zh: '合作（主協定）', en: 'Cooperation' },
        { num: 'Art.4', zh: '資訊分享（主協定）', en: 'Information Sharing' },
        { num: 'Art.8.61-V', zh: '利害關係人參與', en: 'Stakeholder Engagement' },
        { num: 'Art.8.61-W', zh: '合作', en: 'Cooperation' },
      ],
    },
    {
      theme: '例外規定', themeEn: 'Exceptions',
      articles: [
        { num: 'Art.8.61-X', zh: '安全、審慎例外與一般例外', en: 'Security, Prudential Carve-out and General Exceptions' },
      ],
    },
    {
      theme: '協議管理', themeEn: 'Administration',
      articles: [
        { num: 'Art.2', zh: '英星自由貿易協定之修正', en: 'Amendment of the UK-Singapore FTA' },
        { num: 'Art.5', zh: '組成部分', en: 'Integral Parts' },
        { num: 'Art.6', zh: '最終條款', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── 韓星數位夥伴協定 (Korea–Singapore Digital Partnership Agreement) ─
  'korea-singapore-dpa': [
    {
      theme: '定義、目標與範圍', themeEn: 'Definitions, Objectives & Scope',
      articles: [
        { num: 'Art.1', zh: '目標（主協定）', en: 'Objectives' },
        { num: 'Art.2', zh: '一般定義（主協定）', en: 'General Definitions' },
        { num: 'Art.14.1', zh: '定義', en: 'Definitions' },
        { num: 'Art.14.2', zh: '適用範圍', en: 'Scope' },
      ],
    },
    {
      theme: '市場開放', themeEn: 'Market Access',
      articles: [
        { num: 'Art.14.5', zh: '關稅', en: 'Customs Duties' },
        { num: 'Art.14.6', zh: '數位產品非歧視待遇', en: 'Non-Discriminatory Treatment of Digital Products' },
        { num: 'Art.14.18', zh: '使用密碼學之資通訊產品', en: 'ICT Products that Use Cryptography' },
        { num: 'Art.14.19', zh: '原始碼', en: 'Source Code' },
      ],
    },
    {
      theme: '資料流動', themeEn: 'Data Flows',
      articles: [
        { num: 'Art.14.14', zh: '以電子方式跨境傳輸資訊', en: 'Cross-Border Transfer of Information by Electronic Means' },
        { num: 'Art.14.15', zh: '運算設施位置', en: 'Location of Computing Facilities' },
        { num: 'Art.14.16', zh: '金融服務之運算設施位置', en: 'Location of Computing Facilities for Financial Services' },
        { num: 'Art.14.26', zh: '開放政府資料', en: 'Open Government Data' },
      ],
    },
    {
      theme: '數位貿易便捷化', themeEn: 'Digital Trade Facilitation',
      articles: [
        { num: 'Art.7', zh: '電子簽章（主協定）', en: 'Electronic Signature' },
        { num: 'Art.14.7', zh: '電子交易框架', en: 'Electronic Transactions Framework' },
        { num: 'Art.14.8', zh: '電子認證與電子簽章', en: 'Electronic Authentication and Electronic Signatures' },
        { num: 'Art.14.9', zh: '物流', en: 'Logistics' },
        { num: 'Art.14.10', zh: '電子發票', en: 'Electronic Invoicing' },
        { num: 'Art.14.11', zh: '電子支付', en: 'Electronic Payments' },
        { num: 'Art.14.12', zh: '無紙化貿易', en: 'Paperless Trading' },
        { num: 'Art.14.13', zh: '快遞貨件', en: 'Express Shipments' },
        { num: 'Art.14.24', zh: '電子商務之網際網路接取與使用原則', en: 'Principles on Access to and Use of the Internet for Electronic Commerce' },
      ],
    },
    {
      theme: '數位信任', themeEn: 'Digital Trust',
      articles: [
        { num: 'Art.14.17', zh: '個人資訊保護', en: 'Personal Information Protection' },
        { num: 'Art.14.20', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        { num: 'Art.14.21', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.14.22', zh: '網路安全', en: 'Cybersecurity' },
        { num: 'Art.14.23', zh: '線上安全環境', en: 'Online Safety Environment' },
      ],
    },
    {
      theme: '新興技術與趨勢', themeEn: 'Emerging Tech & Trends',
      articles: [
        { num: 'Art.14.25', zh: '資料創新', en: 'Data Innovation' },
        { num: 'Art.14.27', zh: '競爭政策', en: 'Competition Policy' },
        { num: 'Art.14.28', zh: '人工智慧', en: 'Artificial Intelligence' },
        { num: 'Art.14.29', zh: '金融科技合作', en: 'FinTech Cooperation' },
        { num: 'Art.14.30', zh: '數位身分', en: 'Digital Identities' },
        { num: 'Art.14.31', zh: '標準與符合性評鑑', en: 'Standards and Conformity Assessment' },
      ],
    },
    {
      theme: '數位包容與發展', themeEn: 'Digital Inclusion & Development',
      articles: [
        { num: 'Art.14.32', zh: '中小企業數位化', en: 'SME Digitalisation' },
        { num: 'Art.14.33', zh: '數位包容', en: 'Digital Inclusion' },
      ],
    },
    {
      theme: '合作與對話機制', themeEn: 'Cooperation & Dialogue',
      articles: [
        { num: 'Art.4', zh: '合作（主協定）', en: 'Cooperation' },
        { num: 'Art.14.4', zh: '資訊分享', en: 'Information Sharing' },
        { num: 'Art.14.34', zh: '利害關係人參與', en: 'Stakeholder Engagement' },
      ],
    },
    {
      theme: '協議管理', themeEn: 'Administration',
      articles: [
        { num: 'Art.3', zh: '韓星自由貿易協定之修正（主協定）', en: 'Amendment of the Korea-Singapore FTA' },
        { num: 'Art.5', zh: '生效（主協定）', en: 'Entry into Force' },
        { num: 'Art.6', zh: '修正（主協定）', en: 'Amendments' },
      ],
    },
  ],

  // ─── WTO 電子商務 JSI 穩定文本 (INF/ECOM/87) ─────────────────────────
  'wto-jsi-ecommerce': [
    {
      theme: 'A：範圍與一般規定', themeEn: 'Scope and General Provisions',
      articles: [
        { num: 'Art.1', zh: '適用範圍', en: 'Scope' },
        { num: 'Art.2', zh: '定義', en: 'Definitions' },
        { num: 'Art.3', zh: '與其他協定之關係', en: 'Relation to Other Agreements' },
      ],
    },
    {
      theme: 'B：促進電子商務', themeEn: 'Enabling Electronic Commerce',
      articles: [
        { num: 'Art.4', zh: '電子交易框架', en: 'Electronic Transactions Framework' },
        { num: 'Art.5', zh: '電子認證與電子簽章', en: 'Electronic Authentication and Electronic Signatures' },
        { num: 'Art.6', zh: '電子契約', en: 'Electronic Contracts' },
        { num: 'Art.7', zh: '電子發票', en: 'Electronic Invoicing' },
        { num: 'Art.8', zh: '無紙化貿易', en: 'Paperless Trading' },
        { num: 'Art.9', zh: '單一窗口資料交換與系統互通性', en: 'Single Windows Data Exchange and System Interoperability' },
        { num: 'Art.10', zh: '電子支付', en: 'Electronic Payments' },
      ],
    },
    {
      theme: 'C：開放性與電子商務', themeEn: 'Openness and Electronic Commerce',
      articles: [
        {
          num: 'Art.11', zh: '電子傳輸關稅', en: 'Customs Duties on Electronic Transmissions',
          fullText: {
            originalLang: 'en',
            en: '11.1 For the purposes of this Article, "electronic transmission" means a transmission made using any electromagnetic means and includes the content of the transmission.\n11.2 The Parties acknowledge the importance of the Work Programme on Electronic Commerce (WT/L/274) and recognize that the practice of not imposing customs duties on electronic transmissions has played an important role in the development of the digital economy.\n11.3 No Party shall impose customs duties on electronic transmissions between a person of one Party and a person of another Party.\n11.4 For greater certainty, paragraph 3 does not preclude a Party from imposing internal taxes, fees, or other charges on electronic transmissions in a manner not inconsistent with the WTO Agreement.\n11.5 Taking into account the evolving nature of electronic commerce and digital technology, the Parties shall review this Article in the fifth year after the date of entry into force of this Agreement, and periodically thereafter.',
            zh: '11.1 就本條而言，「電子傳輸」指以任何電磁方式進行之傳輸，並包含傳輸之內容。\n11.2 締約方體認電子商務工作計畫（WT/L/274）之重要性，並認知不對電子傳輸課徵關稅之作法，對數位經濟發展具有重要作用。\n11.3 任一締約方不得對一締約方之人與另一締約方之人間之電子傳輸課徵關稅。\n11.4 為明確計，第3項不排除締約方以不牴觸 WTO 協定之方式，對電子傳輸課徵內地稅、規費或其他費用。\n11.5 考量電子商務與數位科技不斷演進之性質，締約方應於本協定生效後第五年檢討本條，其後並定期檢討。',
            zhSource: 'tool',
            zhSourceNote: '本工具翻譯（WTO 官方僅有英、法、西三種作準語言，無官方中文版）',
            sourceUrl: 'https://docs.wto.org/',
          },
        },
        { num: 'Art.12', zh: '開放政府資料', en: 'Open Government Data' },
        { num: 'Art.13', zh: '電子商務之網際網路接取與使用', en: 'Access to and Use of the Internet for Electronic Commerce' },
      ],
    },
    {
      theme: 'D：信任與電子商務', themeEn: 'Trust and Electronic Commerce',
      articles: [
        { num: 'Art.14', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.15', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        {
          num: 'Art.16', zh: '個人資料保護', en: 'Personal Data Protection',
          fullText: {
            originalLang: 'en',
            en: '16.1 For the purposes of this Article, "personal data" means any information relating to an identified or identifiable natural person.\n16.2 The Parties recognize that strong and effective protection of personal data and related individual rights contribute to enhancing consumer confidence and trust in the digital economy.\n16.3 Each Party shall adopt or maintain a legal framework that provides for the protection of the personal data of users of electronic commerce.\n16.4 In developing its legal framework for the protection of personal data, each Party should take into account principles and guidelines developed by relevant international bodies or organizations.\n16.7 Recognizing that the Parties may take different legal approaches to protecting personal data, each Party should encourage the development of mechanisms to promote compatibility between these different regimes.',
            zh: '16.1 就本條而言，「個人資料」指與已識別或可識別之自然人有關之任何資訊。\n16.2 締約方體認，對個人資料及相關個人權利之強健且有效保護，有助於提升消費者對數位經濟之信心與信任。\n16.3 各締約方應採行或維持提供電子商務使用者個人資料保護之法律框架。\n16.4 各締約方於發展其個人資料保護之法律框架時，宜參酌相關國際機構或組織所發展之原則與指引。\n16.7 體認締約方對個人資料保護可能採取不同法律途徑，各締約方宜鼓勵發展促進不同制度間相容性之機制。',
            zhSource: 'tool',
            zhSourceNote: '本工具翻譯（WTO 官方僅有英、法、西三種作準語言，無官方中文版）',
            sourceUrl: 'https://docs.wto.org/',
          },
        },
        { num: 'Art.17', zh: '網路安全', en: 'Cybersecurity' },
      ],
    },
    {
      theme: 'E：透明度、合作與發展', themeEn: 'Transparency, Cooperation and Development',
      articles: [
        { num: 'Art.18', zh: '透明度', en: 'Transparency' },
        { num: 'Art.19', zh: '合作', en: 'Cooperation' },
        { num: 'Art.20', zh: '發展', en: 'Development' },
      ],
    },
    {
      theme: 'F：電信', themeEn: 'Telecommunications',
      articles: [
        { num: 'Art.21', zh: '電信', en: 'Telecommunications' },
      ],
    },
    {
      theme: 'G：例外', themeEn: 'Exceptions',
      articles: [
        { num: 'Art.22', zh: '一般例外', en: 'General Exceptions' },
        { num: 'Art.23', zh: '安全例外', en: 'Security Exception' },
        { num: 'Art.24', zh: '審慎措施', en: 'Prudential Measures' },
        { num: 'Art.25', zh: '個人資料保護例外', en: 'Personal Data Protection Exception' },
        { num: 'Art.26', zh: '原住民族', en: 'Indigenous Peoples' },
      ],
    },
    {
      theme: 'H：制度安排與最終條款', themeEn: 'Institutional Arrangements and Final Provisions',
      articles: [
        { num: 'Art.27', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Art.28', zh: '電子商務貿易相關層面委員會', en: 'Committee on Trade-Related Aspects of Electronic Commerce' },
        { num: 'Art.29', zh: '接受與生效', en: 'Acceptance and Entry into Force' },
        { num: 'Art.30', zh: '加入', en: 'Accession' },
        { num: 'Art.31', zh: '實施', en: 'Implementation' },
        { num: 'Art.32', zh: '保留', en: 'Reservations' },
        { num: 'Art.33', zh: '修正', en: 'Amendments' },
        { num: 'Art.34', zh: '退出', en: 'Withdrawal' },
        { num: 'Art.35', zh: '特定締約方間不適用本協定', en: 'Non-Application between Specific Parties' },
        { num: 'Art.36', zh: '檢視', en: 'Review' },
        { num: 'Art.37', zh: '秘書處', en: 'Secretariat' },
        { num: 'Art.38', zh: '保存', en: 'Deposit' },
        { num: 'Art.39', zh: '登記', en: 'Registration' },
      ],
    },
  ],

  // ─── CPTPP（跨太平洋夥伴全面進步協定）──────────────────────────────
  //   章節結構（30 章）；條文全文非官方中譯版本，故僅列章名
  'cptpp': [
    {
      theme: '通則與市場進入', themeEn: 'General & Market Access',
      articles: [
        { num: 'Ch.1', zh: '初始規定及一般定義', en: 'Initial Provisions and General Definitions' },
        { num: 'Ch.2', zh: '國民待遇及貨品市場進入', en: 'National Treatment and Market Access for Goods' },
        { num: 'Ch.3', zh: '原產地規則及原產地程序', en: 'Rules of Origin and Origin Procedures' },
        { num: 'Ch.4', zh: '紡織品及成衣', en: 'Textile and Apparel Goods' },
        { num: 'Ch.5', zh: '海關管理及貿易便捷化', en: 'Customs Administration and Trade Facilitation' },
        { num: 'Ch.6', zh: '貿易救濟', en: 'Trade Remedies' },
        { num: 'Ch.7', zh: '食品安全檢驗與動植物防疫檢疫', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.8', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
      ],
    },
    {
      theme: '投資與服務', themeEn: 'Investment & Services',
      articles: [
        { num: 'Ch.9', zh: '投資', en: 'Investment' },
        { num: 'Ch.10', zh: '跨境服務貿易', en: 'Cross-Border Trade in Services' },
        { num: 'Ch.11', zh: '金融服務', en: 'Financial Services' },
        { num: 'Ch.12', zh: '商務人士臨時入境', en: 'Temporary Entry for Business Persons' },
        { num: 'Ch.13', zh: '電信', en: 'Telecommunications' },
        { num: 'Ch.14', zh: '電子商務', en: 'Electronic Commerce' },
      ],
    },
    {
      theme: '政府與競爭', themeEn: 'Government & Competition',
      articles: [
        { num: 'Ch.15', zh: '政府採購', en: 'Government Procurement' },
        { num: 'Ch.16', zh: '競爭政策', en: 'Competition Policy' },
        { num: 'Ch.17', zh: '國營事業及指定獨佔事業', en: 'State-Owned Enterprises and Designated Monopolies' },
        { num: 'Ch.18', zh: '智慧財產', en: 'Intellectual Property' },
      ],
    },
    {
      theme: '勞動、環境與發展', themeEn: 'Labour, Environment & Development',
      articles: [
        { num: 'Ch.19', zh: '勞動', en: 'Labour' },
        { num: 'Ch.20', zh: '環境', en: 'Environment' },
        { num: 'Ch.21', zh: '合作與能力建構', en: 'Cooperation and Capacity Building' },
        { num: 'Ch.22', zh: '競爭力與商業便捷化', en: 'Competitiveness and Business Facilitation' },
        { num: 'Ch.23', zh: '發展', en: 'Development' },
        { num: 'Ch.24', zh: '中小企業', en: 'Small and Medium-Sized Enterprises' },
        { num: 'Ch.25', zh: '法規調和', en: 'Regulatory Coherence' },
        { num: 'Ch.26', zh: '透明化及反貪腐', en: 'Transparency and Anti-Corruption' },
      ],
    },
    {
      theme: '行政與最終規定', themeEn: 'Administrative & Final',
      articles: [
        { num: 'Ch.27', zh: '行政及機構規定', en: 'Administrative and Institutional Provisions' },
        { num: 'Ch.28', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.29', zh: '例外及一般規定', en: 'Exceptions and General Provisions' },
        { num: 'Ch.30', zh: '最終規定', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── RCEP（區域全面經濟夥伴協定）─────────────────────────────────
  'rcep': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '初始條款與一般定義', en: 'Initial Provisions and General Definitions' },
        { num: 'Ch.2', zh: '貨品貿易', en: 'Trade in Goods' },
        { num: 'Ch.3', zh: '原產地規則', en: 'Rules of Origin' },
        { num: 'Ch.4', zh: '海關程序與貿易便捷化', en: 'Customs Procedures and Trade Facilitation' },
        { num: 'Ch.5', zh: '食品安全檢驗與動植物防疫檢疫', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.6', zh: '標準、技術性法規與符合性評鑑程序', en: 'Standards, Technical Regulations and Conformity Assessment Procedures' },
        { num: 'Ch.7', zh: '貿易救濟', en: 'Trade Remedies' },
      ],
    },
    {
      theme: '服務、人員與投資', themeEn: 'Services & Investment',
      articles: [
        { num: 'Ch.8', zh: '服務貿易（含金融、電信、專業服務附件）', en: 'Trade in Services (with Annexes on Financial, Telecommunications, Professional)' },
        { num: 'Ch.9', zh: '自然人移動', en: 'Movement of Natural Persons' },
        { num: 'Ch.10', zh: '投資', en: 'Investment' },
      ],
    },
    {
      theme: '智財、電商與競爭', themeEn: 'IP, E-Commerce & Competition',
      articles: [
        { num: 'Ch.11', zh: '智慧財產權', en: 'Intellectual Property' },
        { num: 'Ch.12', zh: '電子商務', en: 'Electronic Commerce' },
        { num: 'Ch.13', zh: '競爭', en: 'Competition' },
        { num: 'Ch.14', zh: '中小企業', en: 'Small and Medium Enterprises' },
        { num: 'Ch.15', zh: '經濟與技術合作', en: 'Economic and Technical Cooperation' },
        { num: 'Ch.16', zh: '政府採購', en: 'Government Procurement' },
      ],
    },
    {
      theme: '一般規定與制度', themeEn: 'General & Institutional',
      articles: [
        { num: 'Ch.17', zh: '一般規定與例外', en: 'General Provisions and Exceptions' },
        { num: 'Ch.18', zh: '機構規定', en: 'Institutional Provisions' },
        { num: 'Ch.19', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.20', zh: '最終規定', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── USMCA（美墨加協定）─────────────────────────────────────────
  'usmca': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '初始條款與一般定義', en: 'Initial Provisions and General Definitions' },
        { num: 'Ch.2', zh: '國民待遇與貨品市場進入', en: 'National Treatment and Market Access for Goods' },
        { num: 'Ch.3', zh: '農業', en: 'Agriculture' },
        { num: 'Ch.4', zh: '原產地規則', en: 'Rules of Origin' },
        { num: 'Ch.5', zh: '原產地程序', en: 'Origin Procedures' },
        { num: 'Ch.6', zh: '紡織品及成衣', en: 'Textile and Apparel Goods' },
        { num: 'Ch.7', zh: '海關管理及貿易便捷化', en: 'Customs Administration and Trade Facilitation' },
        { num: 'Ch.8', zh: '墨西哥碳氫化合物所有權之承認', en: 'Recognition of Mexico\'s Ownership of Hydrocarbons' },
        { num: 'Ch.9', zh: '食品安全與防疫檢疫措施', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.10', zh: '貿易救濟', en: 'Trade Remedies' },
        { num: 'Ch.11', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
        { num: 'Ch.12', zh: '部門別附件', en: 'Sectoral Annexes' },
      ],
    },
    {
      theme: '投資、服務與數位', themeEn: 'Investment, Services & Digital',
      articles: [
        { num: 'Ch.13', zh: '政府採購', en: 'Government Procurement' },
        { num: 'Ch.14', zh: '投資', en: 'Investment' },
        { num: 'Ch.15', zh: '跨境服務貿易', en: 'Cross-Border Trade in Services' },
        { num: 'Ch.16', zh: '商務人士臨時入境', en: 'Temporary Entry for Business Persons' },
        { num: 'Ch.17', zh: '金融服務', en: 'Financial Services' },
        { num: 'Ch.18', zh: '電信', en: 'Telecommunications' },
        { num: 'Ch.19', zh: '數位貿易', en: 'Digital Trade' },
        { num: 'Ch.20', zh: '智慧財產權', en: 'Intellectual Property Rights' },
      ],
    },
    {
      theme: '競爭、勞動與環境', themeEn: 'Competition, Labor & Environment',
      articles: [
        { num: 'Ch.21', zh: '競爭政策', en: 'Competition Policy' },
        { num: 'Ch.22', zh: '國營事業及指定獨佔事業', en: 'State-Owned Enterprises and Designated Monopolies' },
        { num: 'Ch.23', zh: '勞動', en: 'Labor' },
        { num: 'Ch.24', zh: '環境', en: 'Environment' },
        { num: 'Ch.25', zh: '中小企業', en: 'Small and Medium-Sized Enterprises' },
        { num: 'Ch.26', zh: '競爭力', en: 'Competitiveness' },
        { num: 'Ch.27', zh: '反貪腐', en: 'Anti-Corruption' },
        { num: 'Ch.28', zh: '良好法規實務', en: 'Good Regulatory Practices' },
      ],
    },
    {
      theme: '行政與最終規定', themeEn: 'Administrative & Final',
      articles: [
        { num: 'Ch.29', zh: '公布與行政', en: 'Publication and Administration' },
        { num: 'Ch.30', zh: '行政及機構規定', en: 'Administrative and Institutional Provisions' },
        { num: 'Ch.31', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.32', zh: '例外及一般規定', en: 'Exceptions and General Provisions' },
        { num: 'Ch.33', zh: '總體經濟政策與匯率事項', en: 'Macroeconomic Policies and Exchange Rate Matters' },
        { num: 'Ch.34', zh: '最終規定', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── 歐日經濟夥伴協定（EU-Japan EPA）───────────────────────────────
  'eu-japan-epa': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '一般規定', en: 'General Provisions' },
        { num: 'Ch.2', zh: '貨品貿易', en: 'Trade in Goods' },
        { num: 'Ch.3', zh: '原產地規則與原產地程序', en: 'Rules of Origin and Origin Procedures' },
        { num: 'Ch.4', zh: '海關事項與貿易便捷化', en: 'Customs Matters and Trade Facilitation' },
        { num: 'Ch.5', zh: '貿易救濟', en: 'Trade Remedies' },
        { num: 'Ch.6', zh: '食品安全與防疫檢疫', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.7', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
      ],
    },
    {
      theme: '服務、投資、電商與資料', themeEn: 'Services, Investment, E-Commerce & Data',
      articles: [
        { num: 'Ch.8', zh: '服務貿易、投資自由化與電子商務', en: 'Trade in Services, Investment Liberalisation and E-Commerce' },
        { num: 'Ch.9', zh: '資金移動、支付與資本移動及暫行性保障措施', en: 'Capital Movements, Payments and Transfers and Temporary Safeguards' },
        { num: 'Ch.10', zh: '政府採購', en: 'Government Procurement' },
        { num: 'Ch.11', zh: '競爭政策', en: 'Competition Policy' },
        { num: 'Ch.12', zh: '補貼', en: 'Subsidies' },
        { num: 'Ch.13', zh: '國營事業與被授予特權之事業', en: 'State-Owned Enterprises and Enterprises Granted Special Rights' },
        { num: 'Ch.14', zh: '智慧財產', en: 'Intellectual Property' },
      ],
    },
    {
      theme: '法規、永續與爭端', themeEn: 'Regulation, Sustainability & Disputes',
      articles: [
        { num: 'Ch.15', zh: '公司治理', en: 'Corporate Governance' },
        { num: 'Ch.16', zh: '貿易與永續發展', en: 'Trade and Sustainable Development' },
        { num: 'Ch.17', zh: '透明化', en: 'Transparency' },
        { num: 'Ch.18', zh: '良好法規實務與法規合作', en: 'Good Regulatory Practices and Regulatory Cooperation' },
        { num: 'Ch.19', zh: '農業合作', en: 'Cooperation in the Field of Agriculture' },
        { num: 'Ch.20', zh: '中小企業', en: 'Small and Medium-sized Enterprises' },
        { num: 'Ch.21', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.22', zh: '機構規定', en: 'Institutional Provisions' },
        { num: 'Ch.23', zh: '最終條款', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── 歐英貿易與合作協定（EU-UK TCA）─────────────────────────────
  'eu-uk-tca': [
    {
      theme: '基礎、貿易、運輸、能源、漁業', themeEn: 'Foundations & Trade',
      articles: [
        { num: 'Pt.1', zh: '通則與制度規定（共同價值、基本原則、合作機構）', en: 'Common and Institutional Provisions' },
        { num: 'Pt.2-H1', zh: '第二部 第1編：貨品貿易', en: 'Trade — Goods' },
        { num: 'Pt.2-H2', zh: '第二部 第2編：服務、投資與數位貿易', en: 'Trade — Services, Investment & Digital' },
        { num: 'Pt.2-H3', zh: '第二部 第3編：資金移動、支付與資本移動', en: 'Trade — Capital Movements, Payments' },
        { num: 'Pt.2-H4', zh: '第二部 第4編：智慧財產', en: 'Trade — Intellectual Property' },
        { num: 'Pt.2-H5', zh: '第二部 第5編：政府採購', en: 'Trade — Public Procurement' },
        { num: 'Pt.2-H6', zh: '第二部 第6編：競爭、國家補貼、稅務、勞動環境永續、能源', en: 'Trade — Competition, Subsidies, Tax, Sustainability, Energy' },
        { num: 'Pt.2-H7', zh: '第二部 第7編：透明化、良好法規實務、與貿易相關之爭端解決', en: 'Trade — Transparency, Good Regulatory Practices' },
        { num: 'Pt.2-A', zh: '航空運輸', en: 'Aviation' },
        { num: 'Pt.2-R', zh: '道路運輸', en: 'Road Transport' },
        { num: 'Pt.2-S', zh: '社會安全協調', en: 'Social Security Coordination' },
        { num: 'Pt.2-F', zh: '漁業', en: 'Fisheries' },
      ],
    },
    {
      theme: '執法、司法、計畫參與與最終條款', themeEn: 'Law Enforcement, Programmes & Final',
      articles: [
        { num: 'Pt.3', zh: '執法與司法合作（資料分享、引渡、刑事司法互助等）', en: 'Law Enforcement and Judicial Cooperation' },
        { num: 'Pt.4', zh: '主題合作（資料保護、衛生安全、網路安全等）', en: 'Thematic Cooperation' },
        { num: 'Pt.5', zh: '參與歐盟計畫（Horizon Europe、Copernicus、Euratom 等）', en: 'Participation in EU Programmes' },
        { num: 'Pt.6', zh: '爭端解決與橫向條款', en: 'Dispute Settlement and Horizontal Provisions' },
        { num: 'Pt.7', zh: '最終規定（生效、檢視、終止）', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── AfCFTA（非洲大陸自由貿易區協定）─────────────────────────────
  'afcfta': [
    {
      theme: '主協定與議定書', themeEn: 'Main Agreement & Protocols',
      articles: [
        { num: 'Main', zh: '建立非洲大陸自由貿易區協定（主協定）', en: 'Agreement Establishing the AfCFTA' },
        { num: 'P.1', zh: '貨品貿易議定書（含原產地規則、貿易便捷化、SPS、TBT 等附件）', en: 'Protocol on Trade in Goods' },
        { num: 'P.2', zh: '服務貿易議定書', en: 'Protocol on Trade in Services' },
        { num: 'P.3', zh: '爭端解決規則與程序議定書', en: 'Protocol on Rules and Procedures on Settlement of Disputes' },
        { num: 'P.4', zh: '投資議定書', en: 'Protocol on Investment' },
        { num: 'P.5', zh: '智慧財產權議定書', en: 'Protocol on Intellectual Property Rights' },
        { num: 'P.6', zh: '競爭政策議定書', en: 'Protocol on Competition Policy' },
        { num: 'P.7', zh: '數位貿易議定書（2024 年 2 月通過）', en: 'Protocol on Digital Trade (adopted Feb 2024)' },
        { num: 'P.8', zh: '婦女與青年於貿易中之地位議定書', en: 'Protocol on Women and Youth in Trade' },
      ],
    },
  ],

  // ─── ASEAN DEFA（東協數位經濟架構協定）──────────────────────────
  //   實質完成於 2025/5 第 46 屆東協高峰會；公開文本草案章節結構
  'asean-defa': [
    {
      theme: '基礎與市場進入', themeEn: 'Foundations & Market Access',
      articles: [
        { num: 'Ch.1', zh: '一般規定與定義', en: 'General Provisions and Definitions' },
        { num: 'Ch.2', zh: '數位貿易便捷化（無紙化貿易、電子發票、電子簽章）', en: 'Digital Trade Facilitation' },
        { num: 'Ch.3', zh: '跨境電子商務', en: 'Cross-Border E-Commerce' },
        { num: 'Ch.4', zh: '支付與電子發票', en: 'Payments and E-Invoicing' },
      ],
    },
    {
      theme: '資料與信任', themeEn: 'Data & Trust',
      articles: [
        { num: 'Ch.5', zh: '跨境資料流動與資料保護', en: 'Cross-Border Data Flows and Data Protection' },
        { num: 'Ch.6', zh: '網路安全', en: 'Cybersecurity' },
        { num: 'Ch.7', zh: '數位身分', en: 'Digital ID' },
        { num: 'Ch.8', zh: '線上消費者保護', en: 'Online Consumer Protection' },
      ],
    },
    {
      theme: '新興技術與數位賦能', themeEn: 'Emerging Tech & Inclusion',
      articles: [
        { num: 'Ch.9', zh: '人工智慧', en: 'Artificial Intelligence' },
        { num: 'Ch.10', zh: '新興主題（綠色數位、金融科技、政府資料等）', en: 'Emerging Topics' },
        { num: 'Ch.11', zh: '人才能力建構與數位技能', en: 'Talent and Digital Skills' },
        { num: 'Ch.12', zh: '數位包容（中小企業、婦女、青年）', en: 'Digital Inclusion' },
        { num: 'Ch.13', zh: '競爭政策', en: 'Competition Policy' },
      ],
    },
    {
      theme: '制度與最終規定', themeEn: 'Institutional & Final',
      articles: [
        { num: 'Ch.14', zh: '透明化與良好法規實務', en: 'Transparency and Good Regulatory Practices' },
        { num: 'Ch.15', zh: '機構規定', en: 'Institutional Provisions' },
        { num: 'Ch.16', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.17', zh: '最終規定', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── DEPA（數位經濟夥伴協定）模組化設計 ────────────────────────
  'depa': [
    {
      theme: '模組 1–4：基礎與交易便捷化', themeEn: 'Modules 1-4: Foundations & Facilitation',
      articles: [
        { num: 'M.1', zh: '初始條款與一般定義', en: 'Initial Provisions and General Definitions' },
        { num: 'M.2', zh: '商業與貿易便捷化（無紙化貿易、電子簽章、電子發票、快遞貨物）', en: 'Business and Trade Facilitation' },
        { num: 'M.3', zh: '數位產品及相關議題之待遇（關稅、非歧視、原始碼）', en: 'Treatment of Digital Products' },
        { num: 'M.4', zh: '資料議題（個資保護、跨境資料流動、算力設施位置、開放政府資料）', en: 'Data Issues' },
      ],
    },
    {
      theme: '模組 5–8：信任與新興議題', themeEn: 'Modules 5-8: Trust & Emerging Topics',
      articles: [
        { num: 'M.5', zh: '商業與消費者信任（垃圾訊息、消費者保護、網安、線上安全）', en: 'Wider Trust Environment' },
        { num: 'M.6', zh: '數位身分', en: 'Digital Identities' },
        { num: 'M.7', zh: '新興議題與技術（金融科技、人工智慧、政府採購、競爭政策）', en: 'Emerging Trends and Technologies' },
        { num: 'M.8', zh: '創新與數位經濟合作（資料創新、開放資料、實驗法規沙盒）', en: 'Innovation in the Digital Economy' },
      ],
    },
    {
      theme: '模組 9–16：包容、合作與制度', themeEn: 'Modules 9-16: Inclusion & Institutional',
      articles: [
        { num: 'M.9', zh: '中小企業合作', en: 'Cooperation' },
        { num: 'M.10', zh: '數位包容', en: 'Digital Inclusion' },
        { num: 'M.11', zh: '聯合委員會與聯絡點', en: 'Joint Committee and Contact Points' },
        { num: 'M.12', zh: '透明化', en: 'Transparency' },
        { num: 'M.13', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'M.14', zh: '例外', en: 'Exceptions' },
        { num: 'M.15', zh: '最終規定', en: 'Final Provisions' },
        { num: 'M.16', zh: '附件與加入機制', en: 'Annexes and Accession' },
      ],
    },
  ],

  // ─── CETA（歐盟—加拿大全面經濟貿易協定，30 章）────────────────────
  'eu-canada-ceta': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '一般定義與初始條款', en: 'General Definitions and Initial Provisions' },
        { num: 'Ch.2', zh: '國民待遇與貨品市場進入', en: 'National Treatment and Market Access for Goods' },
        { num: 'Ch.3', zh: '貿易救濟', en: 'Trade Remedies' },
        { num: 'Ch.4', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
        { num: 'Ch.5', zh: '食品安全與動植物防疫檢疫', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.6', zh: '海關與貿易便捷化', en: 'Customs and Trade Facilitation' },
        { num: 'Ch.7', zh: '補貼', en: 'Subsidies' },
      ],
    },
    {
      theme: '投資、服務與專業人員', themeEn: 'Investment, Services & Mobility',
      articles: [
        { num: 'Ch.8', zh: '投資（含投資法院制度 ICS）', en: 'Investment (incl. Investment Court System)' },
        { num: 'Ch.9', zh: '跨境服務貿易', en: 'Cross-Border Trade in Services' },
        { num: 'Ch.10', zh: '自然人臨時入境與停留', en: 'Temporary Entry and Stay of Natural Persons' },
        { num: 'Ch.11', zh: '專業資格相互承認', en: 'Mutual Recognition of Professional Qualifications' },
        { num: 'Ch.12', zh: '國內監管', en: 'Domestic Regulation' },
        { num: 'Ch.13', zh: '金融服務', en: 'Financial Services' },
        { num: 'Ch.14', zh: '國際海運服務', en: 'International Maritime Transport Services' },
        { num: 'Ch.15', zh: '電信', en: 'Telecommunications' },
        { num: 'Ch.16', zh: '電子商務', en: 'Electronic Commerce' },
      ],
    },
    {
      theme: '競爭、政府事業與智財', themeEn: 'Competition, SOEs & IP',
      articles: [
        { num: 'Ch.17', zh: '競爭政策', en: 'Competition Policy' },
        { num: 'Ch.18', zh: '國營事業、獨佔與被授予特權之事業', en: 'State Enterprises, Monopolies and Enterprises Granted Special Rights' },
        { num: 'Ch.19', zh: '政府採購', en: 'Government Procurement' },
        { num: 'Ch.20', zh: '智慧財產', en: 'Intellectual Property' },
      ],
    },
    {
      theme: '法規合作、永續與勞動環境', themeEn: 'Regulation, Sustainability, Labour & Environment',
      articles: [
        { num: 'Ch.21', zh: '法規合作', en: 'Regulatory Cooperation' },
        { num: 'Ch.22', zh: '貿易與永續發展', en: 'Trade and Sustainable Development' },
        { num: 'Ch.23', zh: '貿易與勞動', en: 'Trade and Labour' },
        { num: 'Ch.24', zh: '貿易與環境', en: 'Trade and Environment' },
        { num: 'Ch.25', zh: '雙邊對話與合作', en: 'Bilateral Dialogues and Cooperation' },
      ],
    },
    {
      theme: '行政與最終規定', themeEn: 'Administrative & Final',
      articles: [
        { num: 'Ch.26', zh: '行政與機構規定', en: 'Administrative and Institutional Provisions' },
        { num: 'Ch.27', zh: '透明化', en: 'Transparency' },
        { num: 'Ch.28', zh: '例外', en: 'Exceptions' },
        { num: 'Ch.29', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.30', zh: '最終規定', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── IPEF（印太經濟繁榮架構，四大支柱）────────────────────────
  'ipef': [
    {
      theme: '四大支柱', themeEn: 'Four Pillars',
      articles: [
        { num: 'P.I', zh: '第一支柱：貿易（談判中）— 勞動、環境、數位、農業、透明化、競爭、貿易便捷化等七個子議題', en: 'Pillar I: Trade (under negotiation) — Labour, Environment, Digital, Agriculture, Transparency, Competition, Trade Facilitation' },
        { num: 'P.II', zh: '第二支柱：供應鏈協定（2023/11 簽署、2024/2 生效）— 關鍵供應鏈韌性、應變網絡、勞動權利諮詢機制', en: 'Pillar II: Supply Chain Agreement (signed Nov 2023, in force Feb 2024)' },
        { num: 'P.III', zh: '第三支柱：潔淨經濟協定（2024/6 簽署、2024/10 生效）— 潔淨能源、減碳、永續基礎建設', en: 'Pillar III: Clean Economy Agreement (signed Jun 2024, in force Oct 2024)' },
        { num: 'P.IV', zh: '第四支柱：公平經濟協定（2024/6 簽署、2024/10 生效）— 反貪腐、稅務透明化', en: 'Pillar IV: Fair Economy Agreement (signed Jun 2024, in force Oct 2024)' },
        { num: 'P.V', zh: '整體 IPEF 協定（含部長理事會、聯合委員會、爭端解決）', en: 'Overarching IPEF Agreement' },
      ],
    },
  ],

  // ─── KORUS（美韓自由貿易協定，24 章）─────────────────────────
  'us-korea': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '初始條款及定義', en: 'Initial Provisions and Definitions' },
        { num: 'Ch.2', zh: '貨品國民待遇及市場進入', en: 'National Treatment and Market Access for Goods' },
        { num: 'Ch.3', zh: '農業', en: 'Agriculture' },
        { num: 'Ch.4', zh: '紡織品及成衣', en: 'Textiles and Apparel' },
        { num: 'Ch.5', zh: '藥品及醫療器材', en: 'Pharmaceuticals and Medical Devices' },
        { num: 'Ch.6', zh: '原產地規則及原產地程序', en: 'Rules of Origin and Origin Procedures' },
        { num: 'Ch.7', zh: '海關管理與貿易便捷化', en: 'Customs Administration and Trade Facilitation' },
        { num: 'Ch.8', zh: '食品安全及防疫檢疫', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.9', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
        { num: 'Ch.10', zh: '貿易救濟', en: 'Trade Remedies' },
      ],
    },
    {
      theme: '投資、服務與金融', themeEn: 'Investment, Services & Finance',
      articles: [
        { num: 'Ch.11', zh: '投資', en: 'Investment' },
        { num: 'Ch.12', zh: '跨境服務貿易', en: 'Cross-Border Trade in Services' },
        { num: 'Ch.13', zh: '金融服務', en: 'Financial Services' },
        { num: 'Ch.14', zh: '電信', en: 'Telecommunications' },
        { num: 'Ch.15', zh: '電子商務', en: 'Electronic Commerce' },
      ],
    },
    {
      theme: '競爭、政府採購與智財', themeEn: 'Competition, Procurement & IP',
      articles: [
        { num: 'Ch.16', zh: '競爭相關事項', en: 'Competition-Related Matters' },
        { num: 'Ch.17', zh: '政府採購', en: 'Government Procurement' },
        { num: 'Ch.18', zh: '智慧財產', en: 'Intellectual Property Rights' },
      ],
    },
    {
      theme: '勞動、環境與最終', themeEn: 'Labor, Environment & Final',
      articles: [
        { num: 'Ch.19', zh: '勞動', en: 'Labor' },
        { num: 'Ch.20', zh: '環境', en: 'Environment' },
        { num: 'Ch.21', zh: '透明化', en: 'Transparency' },
        { num: 'Ch.22', zh: '機構規定與爭端解決', en: 'Institutional Provisions and Dispute Settlement' },
        { num: 'Ch.23', zh: '例外', en: 'Exceptions' },
        { num: 'Ch.24', zh: '最終條款', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── EU-Korea FTA（15 章）─────────────────────────────────────
  'eu-korea': [
    {
      theme: '通則與市場進入', themeEn: 'General & Market Access',
      articles: [
        { num: 'Ch.1', zh: '目標與一般定義', en: 'Objectives and General Definitions' },
        { num: 'Ch.2', zh: '貨品國民待遇及市場進入', en: 'National Treatment and Market Access for Goods' },
        { num: 'Ch.3', zh: '貿易救濟', en: 'Trade Remedies' },
        { num: 'Ch.4', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
        { num: 'Ch.5', zh: '食品安全與防疫檢疫', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.6', zh: '海關與貿易便捷化', en: 'Customs and Trade Facilitation' },
      ],
    },
    {
      theme: '服務、投資與電商', themeEn: 'Services, Investment & E-Commerce',
      articles: [
        { num: 'Ch.7', zh: '服務貿易、設立與電子商務', en: 'Trade in Services, Establishment and Electronic Commerce' },
        { num: 'Ch.8', zh: '支付與資金移動', en: 'Payments and Capital Movements' },
        { num: 'Ch.9', zh: '政府採購', en: 'Government Procurement' },
        { num: 'Ch.10', zh: '智慧財產', en: 'Intellectual Property' },
        { num: 'Ch.11', zh: '競爭', en: 'Competition' },
      ],
    },
    {
      theme: '透明化、永續與爭端', themeEn: 'Transparency, Sustainability & Disputes',
      articles: [
        { num: 'Ch.12', zh: '透明化', en: 'Transparency' },
        { num: 'Ch.13', zh: '貿易與永續發展', en: 'Trade and Sustainable Development' },
        { num: 'Ch.14', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.15', zh: '機構、一般及最終規定', en: 'Institutional, General and Final Provisions' },
      ],
    },
  ],

  // ─── EU-Vietnam EVFTA（17 章）────────────────────────────────
  'eu-vietnam': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '目標與一般定義', en: 'Objectives and General Definitions' },
        { num: 'Ch.2', zh: '國民待遇及貨品市場進入', en: 'National Treatment and Market Access for Goods' },
        { num: 'Ch.3', zh: '貿易救濟', en: 'Trade Remedies' },
        { num: 'Ch.4', zh: '海關與貿易便捷化', en: 'Customs and Trade Facilitation' },
        { num: 'Ch.5', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
        { num: 'Ch.6', zh: '食品安全與防疫檢疫', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.7', zh: '非關稅障礙與再生能源產品', en: 'Non-Tariff Barriers and Renewable Energy' },
      ],
    },
    {
      theme: '服務、投資與政府採購', themeEn: 'Services, Investment & Procurement',
      articles: [
        { num: 'Ch.8', zh: '服務貿易、投資自由化與電子商務', en: 'Liberalisation of Investment, Trade in Services and E-Commerce' },
        { num: 'Ch.9', zh: '政府採購', en: 'Government Procurement' },
        { num: 'Ch.10', zh: '競爭政策', en: 'Competition Policy' },
        { num: 'Ch.11', zh: '國營事業、被授予特權之事業及指定獨佔事業', en: 'State-Owned Enterprises' },
        { num: 'Ch.12', zh: '智慧財產', en: 'Intellectual Property' },
      ],
    },
    {
      theme: '永續、合作與制度', themeEn: 'Sustainability, Cooperation & Institutional',
      articles: [
        { num: 'Ch.13', zh: '貿易與永續發展', en: 'Trade and Sustainable Development' },
        { num: 'Ch.14', zh: '透明化', en: 'Transparency' },
        { num: 'Ch.15', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.16', zh: '合作與能力建構', en: 'Cooperation and Capacity Building' },
        { num: 'Ch.17', zh: '機構、一般及最終規定', en: 'Institutional, General and Final Provisions' },
      ],
    },
  ],

  // ─── ChAFTA（中澳自由貿易協定，17 章）──────────────────────────
  'china-australia': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '初始條款及一般定義', en: 'Initial Provisions and General Definitions' },
        { num: 'Ch.2', zh: '貨品貿易', en: 'Trade in Goods' },
        { num: 'Ch.3', zh: '原產地規則及原產地實施程序', en: 'Rules of Origin and Implementation Procedures' },
        { num: 'Ch.4', zh: '海關程序及貿易便捷化', en: 'Customs Procedures and Trade Facilitation' },
        { num: 'Ch.5', zh: '食品安全及動植物防疫檢疫', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.6', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
        { num: 'Ch.7', zh: '貿易救濟', en: 'Trade Remedies' },
      ],
    },
    {
      theme: '服務、投資與人員', themeEn: 'Services, Investment & People',
      articles: [
        { num: 'Ch.8', zh: '服務貿易', en: 'Trade in Services' },
        { num: 'Ch.9', zh: '投資', en: 'Investment' },
        { num: 'Ch.10', zh: '自然人移動', en: 'Movement of Natural Persons' },
        { num: 'Ch.11', zh: '電子商務', en: 'Electronic Commerce' },
        { num: 'Ch.12', zh: '智慧財產', en: 'Intellectual Property' },
      ],
    },
    {
      theme: '透明化、合作與制度', themeEn: 'Transparency, Cooperation & Institutional',
      articles: [
        { num: 'Ch.13', zh: '透明化', en: 'Transparency' },
        { num: 'Ch.14', zh: '機構規定', en: 'Institutional Provisions' },
        { num: 'Ch.15', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.16', zh: '一般條款及例外', en: 'General Provisions and Exceptions' },
        { num: 'Ch.17', zh: '最終條款', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── NAFTA（北美自由貿易協定，1994–2020 已由 USMCA 取代）──────
  'nafta': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '目標', en: 'Objectives' },
        { num: 'Ch.2', zh: '一般定義', en: 'General Definitions' },
        { num: 'Ch.3', zh: '國民待遇及貨品市場進入', en: 'National Treatment and Market Access for Goods' },
        { num: 'Ch.4', zh: '原產地規則', en: 'Rules of Origin' },
        { num: 'Ch.5', zh: '海關程序', en: 'Customs Procedures' },
        { num: 'Ch.6', zh: '能源與基礎石化', en: 'Energy and Basic Petrochemicals' },
        { num: 'Ch.7', zh: '農業及食品安全防疫檢疫', en: 'Agriculture and SPS Measures' },
        { num: 'Ch.8', zh: '緊急防衛措施', en: 'Emergency Action' },
        { num: 'Ch.9', zh: '標準相關措施', en: 'Standards-Related Measures' },
      ],
    },
    {
      theme: '投資、服務與商務人員', themeEn: 'Investment, Services & Business Persons',
      articles: [
        { num: 'Ch.10', zh: '政府採購', en: 'Government Procurement' },
        { num: 'Ch.11', zh: '投資（含投資人對地主國爭端解決 ISDS）', en: 'Investment (with ISDS)' },
        { num: 'Ch.12', zh: '跨境服務貿易', en: 'Cross-Border Trade in Services' },
        { num: 'Ch.13', zh: '電信', en: 'Telecommunications' },
        { num: 'Ch.14', zh: '金融服務', en: 'Financial Services' },
        { num: 'Ch.15', zh: '競爭政策、獨佔與國營事業', en: 'Competition Policy, Monopolies and State Enterprises' },
        { num: 'Ch.16', zh: '商務人士臨時入境', en: 'Temporary Entry for Business Persons' },
      ],
    },
    {
      theme: '智財與制度', themeEn: 'IP & Institutional',
      articles: [
        { num: 'Ch.17', zh: '智慧財產', en: 'Intellectual Property' },
        { num: 'Ch.18', zh: '出版、通知及法律行政', en: 'Publication, Notification and Administration of Laws' },
        { num: 'Ch.19', zh: '反傾銷及反補貼之檢視', en: 'Review of Antidumping and Countervailing Duty Matters' },
        { num: 'Ch.20', zh: '機構安排及爭端解決', en: 'Institutional Arrangements and Dispute Settlement' },
      ],
    },
    {
      theme: '例外與最終', themeEn: 'Exceptions & Final',
      articles: [
        { num: 'Ch.21', zh: '例外', en: 'Exceptions' },
        { num: 'Ch.22', zh: '最終條款', en: 'Final Provisions' },
        { num: 'Side', zh: '《北美勞動合作協定》（NAALC）與《北美環境合作協定》（NAAEC）平行協定', en: 'Side Agreements: NAALC (labour) and NAAEC (environment)' },
      ],
    },
  ],

  // ─── ANZTEC（臺紐經濟合作協定，25 章）────────────────────────
  //   臺灣與紐西蘭於 2013/7 簽署、同年 12/1 生效
  'wto-rta-new-zealand-chinese-taipei': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '初始條款及一般定義', en: 'Initial Provisions and General Definitions' },
        { num: 'Ch.2', zh: '貨品貿易', en: 'Trade in Goods' },
        { num: 'Ch.3', zh: '原產地規則及實施程序', en: 'Rules of Origin and Origin Procedures' },
        { num: 'Ch.4', zh: '海關程序及合作', en: 'Customs Procedures and Cooperation' },
        { num: 'Ch.5', zh: '貿易救濟', en: 'Trade Remedies' },
        { num: 'Ch.6', zh: '食品安全檢驗與動植物防疫檢疫措施及合作', en: 'SPS Measures and Cooperation' },
        { num: 'Ch.7', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
      ],
    },
    {
      theme: '服務、投資與人員', themeEn: 'Services, Investment & People',
      articles: [
        { num: 'Ch.8', zh: '跨境服務貿易', en: 'Cross-Border Trade in Services' },
        { num: 'Ch.9', zh: '投資', en: 'Investment' },
        { num: 'Ch.10', zh: '自然人移動', en: 'Movement of Natural Persons' },
        { num: 'Ch.11', zh: '政府採購', en: 'Government Procurement' },
      ],
    },
    {
      theme: '競爭、智財、電商與合作', themeEn: 'Competition, IP, E-Commerce & Cooperation',
      articles: [
        { num: 'Ch.12', zh: '競爭', en: 'Competition' },
        { num: 'Ch.13', zh: '智慧財產', en: 'Intellectual Property' },
        { num: 'Ch.14', zh: '電子商務', en: 'Electronic Commerce' },
        { num: 'Ch.15', zh: '合作', en: 'Cooperation' },
        { num: 'Ch.16', zh: '原住民族合作（全球首見專章）', en: 'Cooperation in Respect of Indigenous Peoples (world-first chapter)' },
        { num: 'Ch.17', zh: '電影及電視合製', en: 'Films and Television' },
      ],
    },
    {
      theme: '環境、勞動與制度', themeEn: 'Environment, Labour & Institutional',
      articles: [
        { num: 'Ch.18', zh: '環境', en: 'Environment' },
        { num: 'Ch.19', zh: '勞動', en: 'Labour' },
        { num: 'Ch.20', zh: '透明化', en: 'Transparency' },
        { num: 'Ch.21', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.22', zh: '機構規定', en: 'Institutional Provisions' },
        { num: 'Ch.23', zh: '一般條款及例外', en: 'General Provisions and Exceptions' },
        { num: 'Ch.24', zh: '最終條款', en: 'Final Provisions' },
        { num: 'Ch.25', zh: '最終條款（附則）', en: 'Final Clauses' },
      ],
    },
  ],

  // ─── ASTEP（臺星經濟夥伴協定，18 章）─────────────────────────
  //   2013/11 簽署、2014/4 生效
  'wto-rta-singapore-chinese-taipei': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '初始條款', en: 'Initial Provisions' },
        { num: 'Ch.2', zh: '一般定義', en: 'General Definitions' },
        { num: 'Ch.3', zh: '貨品貿易', en: 'Trade in Goods' },
        { num: 'Ch.4', zh: '原產地規則', en: 'Rules of Origin' },
        { num: 'Ch.5', zh: '海關程序', en: 'Customs Procedures' },
        { num: 'Ch.6', zh: '食品安全檢驗與動植物防疫檢疫', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.7', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
        { num: 'Ch.8', zh: '貿易救濟', en: 'Trade Remedies' },
      ],
    },
    {
      theme: '服務、投資、電信與電商', themeEn: 'Services, Investment, Telecom & E-Commerce',
      articles: [
        { num: 'Ch.9', zh: '跨境服務貿易', en: 'Cross-Border Trade in Services' },
        { num: 'Ch.10', zh: '投資', en: 'Investment' },
        { num: 'Ch.11', zh: '自然人移動', en: 'Movement of Natural Persons' },
        { num: 'Ch.12', zh: '電信', en: 'Telecommunications' },
        { num: 'Ch.13', zh: '電子商務', en: 'Electronic Commerce' },
      ],
    },
    {
      theme: '採購、競爭與制度', themeEn: 'Procurement, Competition & Institutional',
      articles: [
        { num: 'Ch.14', zh: '政府採購', en: 'Government Procurement' },
        { num: 'Ch.15', zh: '競爭', en: 'Competition' },
        { num: 'Ch.16', zh: '透明化', en: 'Transparency' },
        { num: 'Ch.17', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Ch.18', zh: '最終條款', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── 羅馬條約（建立歐洲經濟共同體之條約，1957）──────────────────
  'eec-rome': [
    {
      theme: '原則與基礎', themeEn: 'Principles & Foundations',
      articles: [
        { num: 'Pt.1', zh: '第一部 原則', en: 'Part One — Principles' },
        { num: 'Pt.2', zh: '第二部 共同體之基礎（貨品自由移動、農業、人員/服務/資本自由移動、運輸）', en: 'Part Two — Foundations of the Community (free movement of goods, agriculture, persons/services/capital, transport)' },
        { num: 'Pt.3', zh: '第三部 共同體之政策（競爭、稅務、法律調和、經濟政策、社會政策、歐洲投資銀行）', en: 'Part Three — Policy of the Community (competition, tax, approximation of laws, economic policy, social policy, EIB)' },
        { num: 'Pt.4', zh: '第四部 海外國家與領地之聯繫', en: 'Part Four — Association of Overseas Countries and Territories' },
      ],
    },
    {
      theme: '機構與一般條款', themeEn: 'Institutions & General Provisions',
      articles: [
        { num: 'Pt.5', zh: '第五部 共同體之機構（議會、理事會、執委會、法院、經濟暨社會委員會、會計安排）', en: 'Part Five — Institutions of the Community' },
        { num: 'Pt.6', zh: '第六部 一般條款與最終規定', en: 'Part Six — General and Final Provisions' },
        { num: 'Note', zh: '附註：本條約後由《單一歐洲法》（1986）、《馬斯垂克條約》（1992）、《阿姆斯特丹條約》（1997）、《尼斯條約》（2001）、《里斯本條約》（2007）逐步修訂；其架構演變為今日《歐洲聯盟運作條約》（TFEU）。', en: 'Note: progressively amended by SEA (1986), Maastricht (1992), Amsterdam (1997), Nice (2001), Lisbon (2007); evolved into today\'s TFEU.' },
      ],
    },
  ],

  // ─── AANZFTA（東協—澳洲—紐西蘭自由貿易協定，18 章）────────────
  //   2009/2 簽署、2010/1 起分階段生效；2023 升級議定書、2024+ 生效
  'asean-aus-nz': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '建立自由貿易區、目標、與一般定義', en: 'Establishment, Objectives and General Definitions' },
        { num: 'Ch.2', zh: '貨品貿易', en: 'Trade in Goods' },
        { num: 'Ch.3', zh: '原產地規則', en: 'Rules of Origin' },
        { num: 'Ch.4', zh: '海關程序', en: 'Customs Procedures' },
        { num: 'Ch.5', zh: '食品安全檢驗與動植物防疫檢疫', en: 'Sanitary and Phytosanitary Measures' },
        { num: 'Ch.6', zh: '標準、技術性法規與符合性評鑑程序', en: 'Standards, Technical Regulations and Conformity Assessment' },
        { num: 'Ch.7', zh: '貿易救濟', en: 'Trade Remedies' },
      ],
    },
    {
      theme: '服務、人員與電商（含 2024 升級）', themeEn: 'Services, People & E-Commerce',
      articles: [
        { num: 'Ch.8', zh: '服務貿易', en: 'Trade in Services' },
        { num: 'Ch.9', zh: '自然人移動', en: 'Movement of Natural Persons' },
        { num: 'Ch.10', zh: '電子商務（2024 升級新增「數位貿易」議題）', en: 'Electronic Commerce (upgraded 2024)' },
        { num: 'Ch.11', zh: '投資', en: 'Investment' },
      ],
    },
    {
      theme: '經濟合作、智財與制度', themeEn: 'Cooperation, IP & Institutional',
      articles: [
        { num: 'Ch.12', zh: '經濟合作', en: 'Economic Cooperation' },
        { num: 'Ch.13', zh: '智慧財產', en: 'Intellectual Property' },
        { num: 'Ch.14', zh: '競爭', en: 'Competition' },
        { num: 'Ch.15', zh: '一般條款及例外', en: 'General Provisions and Exceptions' },
        { num: 'Ch.16', zh: '機構規定', en: 'Institutional Provisions' },
        { num: 'Ch.17', zh: '諮商與爭端解決', en: 'Consultations and Dispute Settlement' },
        { num: 'Ch.18', zh: '最終條款', en: 'Final Provisions' },
        { num: 'Upgrade', zh: '2023 升級議定書（2024 陸續生效）：新增中小企業章、貿易與永續發展章；升級電商、政府採購、原產地規則。', en: '2023 Upgrade Protocol (entered into force 2024): adds SME and Sustainability chapters' },
      ],
    },
  ],

  // ─── 印度—澳洲 ECTA（早期收穫協定，14 章）────────────────────
  //   2022/4 簽署、2022/12 生效
  'india-australia': [
    {
      theme: '通則與貨品', themeEn: 'General & Goods',
      articles: [
        { num: 'Ch.1', zh: '初始條款及一般定義', en: 'Initial Provisions and General Definitions' },
        { num: 'Ch.2', zh: '貨品貿易', en: 'Trade in Goods' },
        { num: 'Ch.3', zh: '原產地規則', en: 'Rules of Origin' },
        { num: 'Ch.4', zh: '海關程序及貿易便捷化', en: 'Customs Procedures and Trade Facilitation' },
        { num: 'Ch.5', zh: '貿易救濟', en: 'Trade Remedies' },
        { num: 'Ch.6', zh: '食品安全檢驗與動植物防疫檢疫', en: 'SPS Measures' },
        { num: 'Ch.7', zh: '技術性貿易障礙', en: 'Technical Barriers to Trade' },
      ],
    },
    {
      theme: '服務、人員與制度', themeEn: 'Services, People & Institutional',
      articles: [
        { num: 'Ch.8', zh: '跨境服務貿易', en: 'Cross-Border Trade in Services' },
        { num: 'Ch.9', zh: '專業服務', en: 'Professional Services' },
        { num: 'Ch.10', zh: '電信', en: 'Telecommunications' },
        { num: 'Ch.11', zh: '自然人移動', en: 'Movement of Natural Persons' },
        { num: 'Ch.12', zh: '一般條款及例外', en: 'General Provisions and Exceptions' },
        { num: 'Ch.13', zh: '行政及機構規定', en: 'Administrative and Institutional Provisions' },
        { num: 'Ch.14', zh: '最終條款', en: 'Final Provisions' },
        { num: 'Note', zh: '附註：本協定為「早期收穫」性質，雙方並行談判更全面的《全面經濟合作協定》（CECA），擬納入投資、政府採購、智財、競爭、永續發展等章節。', en: 'Note: ECTA is an "early harvest"; broader CECA (investment, procurement, IP, etc.) is under negotiation.' },
      ],
    },
  ],

  // ─── WTO（馬拉喀什協定 + 附件 1A/1B/1C/2/3/4）─────────────────
  'wto': [
    {
      theme: '主協定', themeEn: 'Main Agreement',
      articles: [
        { num: 'Main', zh: '《建立世界貿易組織馬拉喀什協定》（1994/4/15 簽署）— 設立 WTO 之法律基礎，含 16 條：機構架構、決策、會員資格、預算、修正、退出。', en: 'Marrakesh Agreement Establishing the WTO (signed 1994-04-15)' },
      ],
    },
    {
      theme: '附件 1A：貨品貿易多邊協定', themeEn: 'Annex 1A: Multilateral Agreements on Trade in Goods',
      articles: [
        { num: 'A.1A-1', zh: 'GATT 1994（含 GATT 1947 經修訂後條款）', en: 'GATT 1994' },
        { num: 'A.1A-2', zh: '《農業協定》', en: 'Agreement on Agriculture' },
        { num: 'A.1A-3', zh: '《食品安全檢驗與動植物防疫檢疫措施協定》（SPS）', en: 'SPS Agreement' },
        { num: 'A.1A-4', zh: '《紡織品與成衣協定》（ATC；2005 屆期）', en: 'ATC (expired 2005)' },
        { num: 'A.1A-5', zh: '《技術性貿易障礙協定》（TBT）', en: 'TBT Agreement' },
        { num: 'A.1A-6', zh: '《與貿易有關之投資措施協定》（TRIMs）', en: 'TRIMs Agreement' },
        { num: 'A.1A-7', zh: '《反傾銷協定》', en: 'Anti-Dumping Agreement' },
        { num: 'A.1A-8', zh: '《關稅估價協定》', en: 'Customs Valuation Agreement' },
        { num: 'A.1A-9', zh: '《裝船前檢驗協定》', en: 'PSI Agreement' },
        { num: 'A.1A-10', zh: '《原產地規則協定》', en: 'Rules of Origin Agreement' },
        { num: 'A.1A-11', zh: '《輸入許可程序協定》', en: 'Import Licensing Agreement' },
        { num: 'A.1A-12', zh: '《補貼暨平衡措施協定》（SCM）', en: 'SCM Agreement' },
        { num: 'A.1A-13', zh: '《防衛措施協定》', en: 'Safeguards Agreement' },
        { num: 'A.1A-14', zh: '《貿易便捷化協定》（TFA；2017 生效）', en: 'TFA (in force 2017)' },
        { num: 'A.1A-15', zh: '《漁業補貼協定》（2022 部分通過；2024 補充協定談判中）', en: 'Fisheries Subsidies Agreement' },
      ],
    },
    {
      theme: '附件 1B/1C：服務與智財', themeEn: 'Annex 1B/1C: Services & IP',
      articles: [
        { num: 'A.1B', zh: '《服務貿易總協定》（GATS）— 涵蓋金融、電信、運輸、專業服務等', en: 'GATS' },
        { num: 'A.1C', zh: '《與貿易有關之智慧財產權協定》（TRIPS）— 專利、商標、著作權、地理標示、營業秘密', en: 'TRIPS Agreement' },
      ],
    },
    {
      theme: '附件 2/3：爭端解決與政策審議', themeEn: 'Annex 2/3: Disputes & TPRM',
      articles: [
        { num: 'A.2', zh: '《爭端解決規則與程序瞭解書》（DSU）— 設立爭端解決機構（DSB）、小組、上訴機構', en: 'DSU — Dispute Settlement' },
        { num: 'A.3', zh: '《貿易政策審議機制》（TPRM）— 定期審議會員貿易政策', en: 'TPRM' },
      ],
    },
    {
      theme: '附件 4：複邊貿易協定', themeEn: 'Annex 4: Plurilateral Agreements',
      articles: [
        { num: 'A.4-GPA', zh: '《政府採購協定》（GPA；複邊，2014 修訂生效）', en: 'Government Procurement Agreement' },
        { num: 'A.4-Civil', zh: '《民用航空器貿易協定》（複邊）', en: 'Trade in Civil Aircraft Agreement' },
      ],
    },
    {
      theme: '其後加入：複邊倡議（JSI）', themeEn: 'Post-Marrakesh: JSIs',
      articles: [
        { num: 'JSI-1', zh: '《電子商務聯合聲明倡議》（2019 啟動，2024 穩定文本；2026/3 通過《過渡性安排宣言》）', en: 'E-Commerce JSI' },
        { num: 'JSI-2', zh: '《投資便捷化發展協定》（2024/2 結案，待入 Annex 4）', en: 'Investment Facilitation for Development' },
        { num: 'JSI-3', zh: '《服務貿易國內規章》（2024/2 部分採納）', en: 'Services Domestic Regulation' },
        { num: 'JSI-4', zh: '《電子傳輸暫免課徵關稅》工作計畫（2026/3 失效後改為 WT/GC/283）', en: 'E-Transmissions Moratorium' },
      ],
    },
  ],

  // ─── 馬斯垂克條約（建立歐洲聯盟條約，1992）─────────────────────
  'maastricht': [
    {
      theme: '共同條款', themeEn: 'Common Provisions',
      articles: [
        { num: 'T-I', zh: 'Title I 共同條款（A–F 條）：建立歐洲聯盟、目標、原則', en: 'Title I — Common Provisions (Arts. A-F)' },
      ],
    },
    {
      theme: '修訂歐洲共同體條約（第一支柱）', themeEn: 'Pillar I — Amendments to EC Treaties',
      articles: [
        { num: 'T-II', zh: 'Title II 修訂《建立歐洲經濟共同體條約》（含經濟暨貨幣聯盟 EMU、共同政策、機構強化）', en: 'Title II — EEC Treaty amendments (incl. EMU)' },
        { num: 'T-III', zh: 'Title III 修訂《建立歐洲煤鋼共同體條約》', en: 'Title III — ECSC Treaty amendments' },
        { num: 'T-IV', zh: 'Title IV 修訂《建立歐洲原子能共同體條約》', en: 'Title IV — Euratom Treaty amendments' },
      ],
    },
    {
      theme: '共同外交安全政策（第二支柱）', themeEn: 'Pillar II — CFSP',
      articles: [
        { num: 'T-V', zh: 'Title V 共同外交與安全政策（CFSP）— 政府間合作模式', en: 'Title V — Common Foreign and Security Policy' },
      ],
    },
    {
      theme: '司法與內政事務（第三支柱）', themeEn: 'Pillar III — JHA',
      articles: [
        { num: 'T-VI', zh: 'Title VI 司法與內政事務合作（JHA）— 移民、難民、警政、刑事司法', en: 'Title VI — Cooperation in JHA' },
      ],
    },
    {
      theme: '最終條款與議定書', themeEn: 'Final Provisions & Protocols',
      articles: [
        { num: 'T-VII', zh: 'Title VII 最終條款（修訂程序、批准、生效）', en: 'Title VII — Final Provisions' },
        { num: 'Prot', zh: '附帶 17 項議定書（含經濟暨貨幣聯盟、英國與丹麥之豁免、社會政策議定書等）', en: '17 Protocols (incl. EMU, UK/Denmark opt-outs, Social Policy)' },
        { num: 'Note', zh: '附註：本條約之三支柱架構於 2009 年《里斯本條約》生效後廢除，整合為今日《歐盟條約》（TEU）與《歐盟運作條約》（TFEU）兩大條約。', en: 'Note: Three-pillar structure abolished by Lisbon Treaty (2009); restructured into today\'s TEU and TFEU.' },
      ],
    },
  ],

  // ─── ANZCERTA（澳紐更緊密經濟關係貿易協定，1983）─────────────
  'cer-anzcerta': [
    {
      theme: '主協定（28 條）', themeEn: 'Main Agreement (28 Articles)',
      articles: [
        { num: 'Art.1-3', zh: '目標、範圍、定義', en: 'Objectives, Scope, Definitions' },
        { num: 'Art.4', zh: '貿易自由化（貨品關稅消除）', en: 'Free Trade in Goods' },
        { num: 'Art.5-8', zh: '原產地規則、海關協助、邊境措施', en: 'Rules of Origin, Customs Cooperation' },
        { num: 'Art.9-10', zh: '反傾銷與平衡稅（1990 起雙邊不再適用）', en: 'Anti-Dumping & CV Duties (waived since 1990)' },
        { num: 'Art.11', zh: '緊急防衛措施', en: 'Safeguards' },
        { num: 'Art.12-13', zh: '量化限制、進口許可', en: 'Quantitative Restrictions, Licensing' },
        { num: 'Art.14-16', zh: '政府採購、競爭政策、業務移地', en: 'Govt Procurement, Competition, Business Mobility' },
        { num: 'Art.17', zh: '服務貿易議定書', en: 'Trade in Services Protocol' },
        { num: 'Art.18', zh: '保留、例外', en: 'Reservations, Exceptions' },
        { num: 'Art.19-28', zh: '一般、機構、爭端解決、修訂、終止、生效等條款', en: 'General, Institutional, Disputes, etc.' },
      ],
    },
    {
      theme: '主要議定書與安排', themeEn: 'Major Protocols',
      articles: [
        { num: 'P.1989', zh: '《服務貿易議定書》（1988 簽、1989 生效，雙邊服務業全面自由化）', en: 'Trade in Services Protocol (1988)' },
        { num: 'P.SEM', zh: '《單一經濟市場》（SEM）議程（1992 起）：法規調和、共同市場規範', en: 'Single Economic Market (since 1992)' },
        { num: 'P.MRA', zh: '《貨品標準相互承認安排》（TTMRA，1998）', en: 'Trans-Tasman Mutual Recognition' },
        { num: 'P.Travel', zh: '《澳紐自由旅行安排》（1973）— 雙方公民可自由進出、居住、工作', en: 'Trans-Tasman Travel Arrangement' },
        { num: 'Note', zh: '附註：ANZCERTA 是全球自由化程度最高、最全面的 FTA 之一，被視為「FTA 模範生」。', en: 'Note: ANZCERTA is among the most comprehensive FTAs globally.' },
      ],
    },
  ],

  // ─── ASEAN 創立（1967 曼谷宣言）+ 主要章程文件 ──────────────────
  'asean-founding': [
    {
      theme: '創始文件', themeEn: 'Founding Documents',
      articles: [
        { num: 'Doc.1', zh: '《曼谷宣言》（ASEAN Declaration，1967/8/8）— 由印尼、馬、菲、新、泰外長於泰國曼谷簽署，宣示成立 ASEAN，闡明 7 大目標：經濟成長、社會進步、文化發展、區域和平穩定、訓練與研究合作、農工合作、國際組織連結。', en: 'Bangkok Declaration (1967-08-08)' },
        { num: 'Doc.2', zh: '《東南亞和平、自由與中立區宣言》（ZOPFAN，1971）', en: 'ZOPFAN Declaration (1971)' },
        { num: 'Doc.3', zh: '《東南亞友好合作條約》（TAC，1976）— 規範區內成員與外部夥伴關係之核心原則', en: 'Treaty of Amity and Cooperation (1976)' },
      ],
    },
    {
      theme: '會員擴張', themeEn: 'Membership Expansion',
      articles: [
        { num: 'E.1', zh: '汶萊加入（1984/1/8）— 第 6 個會員', en: 'Brunei (1984)' },
        { num: 'E.2', zh: '越南加入（1995/7/28）— 第 7 個會員', en: 'Vietnam (1995)' },
        { num: 'E.3', zh: '寮國、緬甸加入（1997/7/23）— 第 8、9 個會員', en: 'Laos & Myanmar (1997)' },
        { num: 'E.4', zh: '柬埔寨加入（1999/4/30）— 第 10 個會員，達成「ASEAN-10」', en: 'Cambodia (1999)' },
        { num: 'E.5', zh: '東帝汶（觀察員 2022，未來會員）', en: 'Timor-Leste (observer; future member)' },
      ],
    },
    {
      theme: '深化整合與三大共同體', themeEn: 'Deepening & 3 Communities',
      articles: [
        { num: 'I.1', zh: 'AFTA 東協自由貿易區（1992 啟動 CEPT，2010 對 ASEAN-6 全面零關稅）', en: 'AFTA (1992)' },
        { num: 'I.2', zh: '《ASEAN 憲章》（2007 簽署、2008/12/15 生效）— 賦予 ASEAN 法人地位', en: 'ASEAN Charter (in force 2008)' },
        { num: 'I.3', zh: 'ASEAN 經濟共同體（AEC，2015/12/31 建立）— 三大共同體之一', en: 'AEC (2015)' },
        { num: 'I.4', zh: 'ASEAN 政治安全共同體（APSC）', en: 'APSC' },
        { num: 'I.5', zh: 'ASEAN 社會文化共同體（ASCC）', en: 'ASCC' },
        { num: 'I.6', zh: '《ASEAN 願景 2025》與《ASEAN 共同體願景 2045》（2025/5 通過）', en: 'ASEAN Vision 2025 / 2045' },
      ],
    },
  ],
};
