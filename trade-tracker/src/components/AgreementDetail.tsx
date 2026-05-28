import type { TradeAgreement } from '../types';
import { STATUS_COLORS, TYPE_LABELS } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  agreement: TradeAgreement;
  onClose: () => void;
}

const dateLabel: Record<string, string> = {
  proposed: '提議時間',
  started: '談判啟動',
  concluded: '談判完成',
  signed: '正式簽署',
  in_force: '正式生效',
  suspended: '暫停時間',
  cancelled: '取消時間',
};

export default function AgreementDetail({ agreement: a, onClose }: Props) {
  const color = STATUS_COLORS[a.status];

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-80 shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-start justify-between gap-2">
        <div>
          <div className="text-xs text-slate-400 mb-1">協定詳情</div>
          <h2 className="font-bold text-slate-800 text-sm leading-snug">{a.nameZh}</h2>
          {a.shortName && <div className="text-xs text-slate-400 mt-0.5">{a.shortName}</div>}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-lg leading-none shrink-0 mt-0.5"
        >
          ✕
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Status & Type */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={a.status} />
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600 border border-slate-200">
            {TYPE_LABELS[a.type]}
          </span>
          {a.tags?.includes('post-liberation-day') && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-50 text-red-600 border border-red-200">
              解放日後新達成
            </span>
          )}
        </div>

        {/* Parties */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">締約方</div>
          <div className="flex flex-wrap gap-1.5">
            {a.partyNamesZh.map((p, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Trade volume */}
        {a.tradeVolume && (
          <div className="rounded-lg p-3" style={{ background: color + '10', border: `1px solid ${color}30` }}>
            <div className="text-xs text-slate-500">2024年估計貿易量</div>
            <div className="text-xl font-bold mt-0.5" style={{ color }}>
              ${a.tradeVolume.toLocaleString()}億 USD
            </div>
          </div>
        )}

        {/* Key dates */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">關鍵時間節點</div>
          <div className="flex flex-col gap-1.5">
            {Object.entries(a.keyDates)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 text-sm">
                  <span className="text-xs text-slate-400 w-20 shrink-0">{dateLabel[k] || k}</span>
                  <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{v}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">說明</div>
          <p className="text-sm text-slate-600 leading-relaxed">{a.descriptionZh}</p>
        </div>

        {/* Key provisions */}
        {a.keyProvisions && a.keyProvisions.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">主要條款</div>
            <ul className="flex flex-col gap-1">
              {a.keyProvisions.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {a.tags && a.tags.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">標籤</div>
            <div className="flex flex-wrap gap-1.5">
              {a.tags.filter(t => t !== 'post-liberation-day').map((t, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
