"""Canonical data model shared by scrapers, reconciler, and the app.

Stays compatible with the seed JSON exported from the TS dataset.
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Any, Optional


AgreementStatus = str  # 'in_force' | 'signed' | 'concluded' | 'negotiating' |
                       # 'suspended' | 'cancelled' | 'proposed' | 'superseded' |
                       # 'expired'

VALID_STATUSES = {
    "in_force", "signed", "concluded", "negotiating", "suspended",
    "cancelled", "proposed", "superseded", "expired",
}

VALID_TYPES = {
    "bilateral", "multilateral", "regional", "sectoral", "plurilateral",
    "jsi",            # WTO Joint Statement Initiative — added for live tracking
    "ministerial",    # WTO ministerial decision/declaration
    "mou",            # Memorandum of Understanding
    "joint_declaration",
    "pilot",          # Pilot project
}


@dataclass
class Agreement:
    """One agreement row. Matches the TS interface in the mobile app."""
    id: str
    name: str
    nameZh: str
    type: str
    status: str
    era: str
    parties: list[str] = field(default_factory=list)
    partyNames: list[str] = field(default_factory=list)
    partyNamesZh: list[str] = field(default_factory=list)
    keyDates: dict[str, str] = field(default_factory=dict)
    description: str = ""
    descriptionZh: str = ""
    shortName: Optional[str] = None
    tradeVolume: Optional[float] = None
    keyProvisions: Optional[list[str]] = None
    tags: Optional[list[str]] = None
    supersededBy: Optional[str] = None
    significance: Optional[str] = None
    # Provenance fields (added by pipeline, not in seed schema)
    sources: list[dict[str, Any]] = field(default_factory=list)
    last_updated: Optional[str] = None
    confidence: float = 1.0

    def to_json(self) -> dict[str, Any]:
        d = asdict(self)
        # Strip None to match TS shape
        return {k: v for k, v in d.items() if v is not None}


@dataclass
class Event:
    """A status-change event detected by the diff phase."""
    id: str                       # f"{agreement_id}:{date}:{kind}"
    agreement_id: str
    kind: str                     # 'status_change' | 'new_agreement' | 'date_added'
    from_value: Optional[str]
    to_value: str
    detected_at: str              # ISO datetime
    effective_date: Optional[str] # YYYY-MM or YYYY-MM-DD
    sources: list[dict[str, Any]] = field(default_factory=list)
    confidence: float = 1.0

    def to_json(self) -> dict[str, Any]:
        return {k: v for k, v in asdict(self).items() if v is not None}


def validate_agreement(a: dict[str, Any]) -> list[str]:
    """Return list of validation errors (empty = valid)."""
    errs = []
    for k in ("id", "name", "nameZh", "type", "status", "era", "parties", "partyNames", "partyNamesZh", "keyDates"):
        if k not in a:
            errs.append(f"missing required field: {k}")
    if a.get("status") and a["status"] not in VALID_STATUSES:
        errs.append(f"invalid status: {a['status']}")
    if a.get("type") and a["type"] not in VALID_TYPES:
        errs.append(f"invalid type: {a['type']}")
    return errs
