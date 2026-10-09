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
RUN_PATHS = {"database": "tt-run-wto-rta-sync", "news": "tt-run-jsi-ecom"}
SETTINGS_PATH = "tt-settings"

# Settings for fetch nodes: run once, retry, and let the flow carry on when a source is down.
FETCH = dict(executeOnce=True, retryOnFail=True, maxTries=3, waitBetweenTries=3000,
             onError="continueRegularOutput")

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
