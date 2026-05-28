import type { TradeAgreement } from '../types';
import { TYPE_LABELS } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  agreements: TradeAgreement[];
  selected: TradeAgreement | null;
  onSelect: (a: TradeAgreement) => void;
}

const dateLabel: Record<string, string> = {
  proposed: '提議', started: '啟動', concluded: '完成',
  signed: '簽署', in_force: '生效', suspended: '暫停', cancelled: '取消',
};

function getBestDate(a: TradeAgreement): { label: string; date: string } | null {
  const d = a.keyDates;
  const order: (keyof typeof d)[] = ['in_force', 'signed', 'concluded', 'started', 'proposed'];
  for (const k of order) {
    if (d[k]) return { label: dateLabel[k], date: d[k]! };
  }
  return null;
}

export default function AgreementList({ agreements, selected, onSelect }: Props) {
  if (agreements.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
        沒有符合條件的協定
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y divide-slate-100">
        {agreements.map(a => {
          const dateInfo = getBestDate(a);
          const isSelected = selected?.id === a.id;

          return (
            <button
              key={a.id}
              onClick={() => onSelect(a)}
              className={`w-full text-left px-5 py-3.5 hover:bg-slate-50 transition-colors flex flex-col gap-1.5 ${
                isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 text-sm truncate">
                    {a.nameZh}
                  </div>
                  {a.shortName && (
                    <div className="text-xs text-slate-400">{a.shortName}</div>
                  )}
                </div>
                <StatusBadge status={a.status} small />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-slate-400">{TYPE_LABELS[a.type]}</span>
                {dateInfo && (
                  <span className="text-xs text-slate-400">
                    {dateInfo.label}：<span className="font-mono">{dateInfo.date}</span>
                  </span>
                )}
                {a.tradeVolume && (
                  <span className="text-xs text-slate-400">
                    ${a.tradeVolume.toLocaleString()}億
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap gap-1">
                {a.partyNamesZh.slice(0, 4).map((p, i) => (
                  <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded">{p}</span>
                ))}
                {a.partyNamesZh.length > 4 && (
                  <span className="text-slate-400">+{a.partyNamesZh.length - 4}</span>
                )}
              </div>

              {a.tags?.includes('post-liberation-day') && (
                <span className="text-xs text-red-500 font-medium">★ 解放日後新達成</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
