"""Shared helpers for the n8n workflow generators (build_*.py).

Each generator builds one Workflow and writes it as JSON for `n8n import:workflow`.
Every workflow follows the same canvas conventions so the user can read it:
colour-coded section sticky notes that explain each node, a one-line note under
every node, and an overview sticky at the top-left.
"""
from __future__ import annotations

import json
import uuid
from pathlib import Path

SB = "https://tsvmouanmvhbhwwwqtdt.supabase.co/rest/v1"
SB_CRED = {"httpHeaderAuth": {"id": "TtSupabaseSecret", "name": "Supabase secret key (trade-tracker)"}}
GEMINI_CRED = {"httpHeaderAuth": {"id": "TtGeminiApiKey01", "name": "Gemini API key"}}
UA = {"name": "User-Agent", "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) trade-tracker"}
# Key the web app sends (header X-TT-Key) when it starts a flow or changes a setting.
WEBHOOK_CRED = {"httpHeaderAuth": {"id": "TtWebhookKey0001", "name": "Webhook key (trade-tracker)"}}
# Pages allowed to call the webhooks: the desktop app and the dev preview (both local only).
WEB_ORIGINS = "http://localhost:8080,http://localhost:8082"
# Webhook paths the web app and the scheduler call (http://localhost:5678/webhook/<path>).
FLOW_PATHS = {"wto_rta_sync": "tt-run-wto-rta-sync", "jsi_ecom": "tt-run-jsi-ecom", "global_news": "tt-run-global-news"}
# 「立即更新」and the scheduler start every flow of a pipeline.
RUN_PATHS = {"database": [FLOW_PATHS["wto_rta_sync"]],
             "news": [FLOW_PATHS["jsi_ecom"], FLOW_PATHS["global_news"]]}
SETTINGS_PATH = "tt-settings"
REVIEW_PATHS = {"list": "tt-review-list", "decide": "tt-review-decide"}

# Settings for fetch nodes: run once, retry, and let the flow carry on when a source is down.
FETCH = dict(executeOnce=True, retryOnFail=True, maxTries=3, waitBetweenTries=3000,
             onError="continueRegularOutput")

# ─── JavaScript shared by the news flows ──────────────────────────────────

JS_DECODE = r"""
const decode = (s) => String(s ?? '')
  .replace(/<!\[CDATA\[|\]\]>/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();
"""

JS_PARSE_RSS = JS_DECODE + r"""
const parseRss = (xml) => (String(xml).match(/<item[\s>][\s\S]*?<\/item>/g) || []).map((it) => {
  const get = (t) => { const m = it.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };
  const sourceUrl = (it.match(/<source[^>]*url="([^"]+)"/) || [])[1] || '';
  return { title: get('title'), link: get('link'), guid: get('guid'), description: get('description'),
           pubDate: get('pubDate'), source: get('source'), sourceUrl };
});
const isoDate = (s) => { const t = Date.parse(s); return Number.isNaN(t) ? null : new Date(t).toISOString(); };
// n8n 的 Code 執行環境沒有 URL 物件,改用字串處理取網域
const host = (u) => String(u || '').replace(/^[a-z]+:\/\//i, '').split(/[/?#:]/)[0].replace(/^www\./, '').toLowerCase();
"""

JS_TIERS = r"""
// 來源信任等級:S 官方、A 學術智庫、B 一線媒體;其他一律 C。比對網域尾端(例如 asia.nikkei.com → nikkei.com)
const TIER = {
  // 官方:國際組織與各國貿易主管機關
  'wto.org': 'S', 'efta.int': 'S', 'asean.org': 'S', 'mercosur.int': 'S', 'europa.eu': 'S', 'admin.ch': 'S',
  'ustr.gov': 'S', 'commerce.gov': 'S', 'whitehouse.gov': 'S', 'gov.uk': 'S', 'international.gc.ca': 'S',
  'dfat.gov.au': 'S', 'mfat.govt.nz': 'S', 'mti.gov.sg': 'S', 'miti.gov.my': 'S', 'meti.go.jp': 'S', 'mofa.go.jp': 'S',
  'motie.go.kr': 'S', 'mofcom.gov.cn': 'S', 'commerce.gov.in': 'S', 'pib.gov.in': 'S', 'gob.mx': 'S', 'gov.br': 'S',
  'trade.gov.tw': 'S', 'moea.gov.tw': 'S', 'ey.gov.tw': 'S', 'mofa.gov.tw': 'S', 'president.gov.tw': 'S',
  // 學術與智庫
  'oecd.org': 'A', 'unctad.org': 'A', 'iisd.org': 'A', 'hinrichfoundation.com': 'A', 'piie.com': 'A',
  'cfr.org': 'A', 'brookings.edu': 'A', 'csis.org': 'A', 'ecipe.org': 'A', 'bruegel.org': 'A', 'chathamhouse.org': 'A',
  'carnegieendowment.org': 'A', 'lowyinstitute.org': 'A', 'eastasiaforum.org': 'A', 'digitalpolicyalert.org': 'A',
  'wita.org': 'A', 'cier.edu.tw': 'A', 'tier.org.tw': 'A',
  // 一線媒體與通訊社
  'reuters.com': 'B', 'ft.com': 'B', 'bloomberg.com': 'B', 'wsj.com': 'B', 'nikkei.com': 'B', 'economist.com': 'B',
  'apnews.com': 'B', 'afp.com': 'B', 'bbc.com': 'B', 'bbc.co.uk': 'B', 'nytimes.com': 'B', 'theguardian.com': 'B',
  'politico.eu': 'B', 'politico.com': 'B', 'euractiv.com': 'B', 'borderlex.net': 'B', 'insidetrade.com': 'B',
  'ip-watch.org': 'B', 'devex.com': 'B', 'dw.com': 'B', 'france24.com': 'B', 'aljazeera.com': 'B',
  'scmp.com': 'B', 'straitstimes.com': 'B', 'kyodonews.net': 'B', 'yna.co.kr': 'B', 'koreaherald.com': 'B',
  'bernama.com': 'B', 'antaranews.com': 'B', 'abc.net.au': 'B', 'rnz.co.nz': 'B', 'cbc.ca': 'B',
  'theglobeandmail.com': 'B', 'mercopress.com': 'B', 'batimes.com.ar': 'B',
  'economictimes.com': 'B', 'thehindubusinessline.com': 'B', 'thehindu.com': 'B', 'livemint.com': 'B',
  'business-standard.com': 'B', 'financialexpress.com': 'B', 'indianexpress.com': 'B', 'hindustantimes.com': 'B',
  'cna.com.tw': 'B', 'focustaiwan.tw': 'B', 'taipeitimes.com': 'B', 'udn.com': 'B', 'ltn.com.tw': 'B',
  'chinatimes.com': 'B', 'cw.com.tw': 'B', 'rti.org.tw': 'B', 'pts.org.tw': 'B', 'ftvnews.com.tw': 'B',
  'tvbs.com.tw': 'B', 'setn.com': 'B', 'ettoday.net': 'B', 'storm.mg': 'B', 'businessweekly.com.tw': 'B',
  'wealth.com.tw': 'B', 'ctee.com.tw': 'B', 'moneydj.com': 'B', 'technews.tw': 'B',
  'gmanetwork.com': 'B', 'inquirer.net': 'B', 'philstar.com': 'B', 'bangkokpost.com': 'B', 'nationthailand.com': 'B',
  'vnexpress.net': 'B', 'thejakartapost.com': 'B', 'thestar.com.my': 'B', 'channelnewsasia.com': 'B',
  'arabnews.com': 'B', 'thenationalnews.com': 'B', 'gulfnews.com': 'B', 'khaleejtimes.com': 'B', 'zawya.com': 'B',
  'wam.ae': 'B', 'spa.gov.sa': 'B', 'japantimes.co.jp': 'B', 'asahi.com': 'B', 'mainichi.jp': 'B', 'nhk.or.jp': 'B',
};
const tierOf = (d) => {
  const p = String(d || '').split('.');
  for (let i = 0; i < p.length - 1; i++) { const t = TIER[p.slice(i).join('.')]; if (t) return t; }
  return 'C';
};
"""

# ─── Layout ───────────────────────────────────────────────────────────────

STEP = 260          # horizontal distance between nodes
NODE_H = 100        # node box height
NOTE_H = 50         # room for the one-line note under a node
PAD = 40


def xs(start, n):
    return [start + i * STEP for i in range(n)]


def text_height(content, width):
    """Generous estimate of how tall a sticky's text is (CJK ~14px wide, ~24px per line)."""
    per_line = max(10, int((width - 40) / 14))
    h = 30
    for line in content.split("\n"):
        if line.startswith("## "):
            h += 44
        elif not line.strip():
            h += 12
        else:
            h += 24 * max(1, -(-len(line) // per_line))
    return h + 10


class Workflow:
    def __init__(self, workflow_id: str, name: str):
        self.id = workflow_id
        self.name = name
        self.nodes: list[dict] = []
        self.connections: dict[str, dict] = {}
        self.sections: list[tuple] = []

    def node(self, name, type_, version, pos, params, note=None, **extra):
        """note: one-line description shown under the node on the canvas."""
        if note:
            extra |= {"notes": note, "notesInFlow": True}
        self.nodes.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_URL, f"{self.id}/{name}")),
            "name": name, "type": type_, "typeVersion": version, "position": pos,
            "parameters": params, **extra,
        })
        return name

    def link(self, src, dst, out=0):
        outs = self.connections.setdefault(src, {"main": []})["main"]
        while len(outs) <= out:
            outs.append([])
        outs[out].append({"node": dst, "type": "main", "index": 0})

    def chain(self, *names):
        for a, b in zip(names, names[1:]):
            self.link(a, b)

    def http(self, name, pos, method, url, *, cred=SB_CRED, query=None, headers=None, body=None,
             text=False, timeout=60000, pagination=None, note=None, **settings):
        params = {"method": method, "url": url, "options": {"timeout": timeout}}
        if cred:
            params |= {"authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth"}
        if query:
            params |= {"sendQuery": True, "queryParameters": {"parameters": query}}
        if headers:
            params |= {"sendHeaders": True, "headerParameters": {"parameters": headers}}
        if body is not None:
            params |= {"sendBody": True, "contentType": "json", "specifyBody": "json", "jsonBody": body}
        if text:
            params["options"]["response"] = {"response": {"responseFormat": "text", "outputPropertyName": "data"}}
        if pagination:
            params["options"]["pagination"] = {"pagination": pagination}
        extra = {"credentials": cred} if cred else {}
        return self.node(name, "n8n-nodes-base.httpRequest", 4.2, pos, params, note=note, **extra, **settings)

    def code(self, name, pos, js, note=None, **settings):
        return self.node(name, "n8n-nodes-base.code", 2, pos,
                         {"mode": "runOnceForAllItems", "jsCode": js.strip()}, note=note, **settings)

    def webhook(self, name, pos, path, note=None, respond="onReceived"):
        """POST webhook guarded by the X-TT-Key header; only the local web app may call it (CORS).

        respond="onReceived" answers at once (long flows); "lastNode" answers with the last node's output.
        Production webhooks only work while the workflow is published (n8n publish:workflow).
        """
        params = {"httpMethod": "POST", "path": path, "authentication": "headerAuth",
                  "responseMode": respond, "options": {"allowedOrigins": WEB_ORIGINS}}
        if respond == "lastNode":
            params["responseData"] = "firstEntryJson"
        return self.node(name, "n8n-nodes-base.webhook", 2, pos, params, note=note,
                         webhookId=str(uuid.uuid5(uuid.NAMESPACE_URL, f"{self.id}/{path}")),
                         credentials=WEBHOOK_CRED)

    def if_true(self, name, pos, expr, note=None, cond_key=None):
        """IF node: output 0 when `expr` is true, output 1 otherwise."""
        cond_id = str(uuid.uuid5(uuid.NAMESPACE_URL, cond_key or f"{self.id}/{name}/cond"))
        return self.node(name, "n8n-nodes-base.if", 2.2, pos, {
            "conditions": {
                "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict", "version": 2},
                "conditions": [{"id": cond_id, "leftValue": expr, "rightValue": "",
                                "operator": {"type": "boolean", "operation": "true", "singleValue": True}}],
                "combinator": "and",
            },
            "options": {},
        }, note=note)

    def sticky(self, name, pos, width, height, color, content):
        """A note on the canvas. Placed behind nodes, so it can frame a group of them."""
        return self.node(name, "n8n-nodes-base.stickyNote", 1, pos,
                         {"content": content, "width": width, "height": height, "color": color})

    def section(self, name, xs_, y, color, content, below=0):
        """Sticky note framing nodes placed at x positions xs_ on row y: text on top, nodes below.

        below: extra height under the row, for nodes placed lower (e.g. a second trigger)."""
        x = xs_[0] - PAD
        width = xs_[-1] - xs_[0] + 100 + 2 * PAD
        th = text_height(content, width)
        top = y - th - 20
        height = th + 20 + NODE_H + NOTE_H + PAD + below
        self.sticky(name, [x, top], width, height, color, content)
        self.sections.append((name, x, top, width, height, y, xs_))

    def save(self, path: Path, **settings):
        workflow = {
            "id": self.id,
            "name": self.name,
            "active": False,
            "nodes": self.nodes,
            "connections": self.connections,
            "settings": {"executionOrder": "v1", "timezone": "Asia/Taipei", "saveManualExecutions": True,
                         "saveDataSuccessExecution": "all", "saveDataErrorExecution": "all"} | settings,
            "pinData": {},
            "meta": {"templateCredsSetupCompleted": True},
        }
        path.write_text(json.dumps(workflow, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"wrote {path.name}: {len(self.nodes)} nodes")
