import { STATUS_LABELS, STATUS_COLORS, TYPE_LABELS } from '../types';
import type { AgreementStatus, AgreementType, FilterState } from '../types';

const ALL_STATUSES: AgreementStatus[] = ['in_force', 'signed', 'concluded', 'negotiating', 'suspended', 'cancelled', 'proposed'];
const ALL_TYPES: AgreementType[] = ['bilateral', 'multilateral', 'regional', 'sectoral'];

interface Props {
  filter: FilterState;
  onChange: (f: FilterState) => void;
}

export default function FilterPanel({ filter, onChange }: Props) {
  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col gap-5 p-4 overflow-y-auto">
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">搜尋</h3>
        <input
          type="text"
          placeholder="搜尋協定名稱、國家…"
          value={filter.search}
          onChange={e => onChange({ ...filter, search: e.target.value })}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">協定狀態</h3>
        <div className="flex flex-col gap-1.5">
          {ALL_STATUSES.map(s => {
            const active = filter.status.includes(s);
            return (
              <button
                key={s}
                onClick={() => onChange({ ...filter, status: toggle(filter.status, s) })}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  active ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: STATUS_COLORS[s] }} />
                <span className={active ? 'text-slate-800 font-medium' : 'text-slate-600'}>
                  {STATUS_LABELS[s]}
                </span>
                {active && <span className="ml-auto text-blue-500">✓</span>}
              </button>
            );
          })}
        </div>
        {filter.status.length > 0 && (
          <button
            className="text-xs text-blue-500 mt-1 hover:underline"
            onClick={() => onChange({ ...filter, status: [] })}
          >
            清除篩選
          </button>
        )}
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">協定類型</h3>
        <div className="flex flex-col gap-1.5">
          {ALL_TYPES.map(t => {
            const active = filter.type.includes(t);
            return (
              <button
                key={t}
                onClick={() => onChange({ ...filter, type: toggle(filter.type, t) })}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  active ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className={`text-sm ${active ? 'font-medium' : ''}`}>{TYPE_LABELS[t]}</span>
                {active && <span className="ml-auto text-blue-500">✓</span>}
              </button>
            );
          })}
        </div>
        {filter.type.length > 0 && (
          <button
            className="text-xs text-blue-500 mt-1 hover:underline"
            onClick={() => onChange({ ...filter, type: [] })}
          >
            清除篩選
          </button>
        )}
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">涉及國家/地區</h3>
        <input
          type="text"
          placeholder="輸入國家名稱…"
          value={filter.country}
          onChange={e => onChange({ ...filter, country: e.target.value })}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        className="mt-auto text-xs text-slate-400 hover:text-slate-600 underline"
        onClick={() => onChange({ status: [], type: [], country: '', search: '', dateFrom: '', dateTo: '' })}
      >
        重置所有篩選條件
      </button>
    </aside>
  );
}
