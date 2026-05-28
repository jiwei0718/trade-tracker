import { useState, useMemo } from 'react';
import type { TradeAgreement, FilterState, ViewMode } from './types';
import { agreements as allAgreements, filterAgreements } from './data/agreements';
import FilterPanel from './components/FilterPanel';
import TimelineSlider from './components/TimelineSlider';
import AgreementList from './components/AgreementList';
import AgreementDetail from './components/AgreementDetail';
import ArcDiagram from './components/ArcDiagram';
import Statistics from './components/Statistics';

const defaultFilter: FilterState = {
  status: [],
  type: [],
  country: '',
  search: '',
  dateFrom: '',
  dateTo: '',
};

const viewLabels: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'arc', label: '關聯圖', icon: '🔗' },
  { id: 'list', label: '列表', icon: '📋' },
  { id: 'stats', label: '統計', icon: '📊' },
];

// IDs that are duplicate entries in the dataset
const DUPLICATE_IDS = new Set(['india-eu-fta-2', 'india-uk-ongoing']);

export default function App() {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [view, setView] = useState<ViewMode>('arc');
  const [selected, setSelected] = useState<TradeAgreement | null>(null);
  const [showFilter, setShowFilter] = useState(true);

  const baseAgreements = useMemo(
    () => allAgreements.filter(a => !DUPLICATE_IDS.has(a.id)),
    [],
  );

  const displayed = useMemo(
    () => filterAgreements(
      baseAgreements,
      filter.status,
      filter.type,
      filter.country,
      filter.search,
      filter.dateFrom,
      filter.dateTo,
    ),
    [filter, baseAgreements],
  );

  const activeFilters =
    filter.status.length +
    filter.type.length +
    (filter.country ? 1 : 0) +
    (filter.search ? 1 : 0) +
    (filter.dateFrom || filter.dateTo ? 1 : 0);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌐</span>
          <div>
            <h1 className="font-bold text-slate-800 text-base leading-tight">全球貿易協定追蹤工具</h1>
            <p className="text-xs text-slate-400">追蹤全球雙邊與多邊貿易協定 · 資料截至 2026年4月</p>
          </div>
        </div>

        {/* View switcher */}
        <div className="ml-auto flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {viewLabels.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                view === v.id
                  ? 'bg-white shadow text-slate-800 font-medium'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{v.icon}</span>
              <span>{v.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilter(f => !f)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            showFilter
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'border-slate-200 text-slate-500 hover:border-slate-300'
          }`}
        >
          <span>⚙</span>
          <span>篩選</span>
          {activeFilters > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
      </header>

      {/* ── Timeline ── */}
      <TimelineSlider
        dateFrom={filter.dateFrom}
        dateTo={filter.dateTo}
        onChange={(from, to) => setFilter(f => ({ ...f, dateFrom: from, dateTo: to }))}
      />

      {/* ── Result bar ── */}
      <div className="bg-white border-b border-slate-100 px-5 py-2 flex items-center gap-3 shrink-0">
        <span className="text-sm text-slate-500">
          顯示{' '}
          <span className="font-semibold text-slate-800">{displayed.length}</span>
          {' '}/ {baseAgreements.length} 個協定
        </span>
        {activeFilters > 0 && (
          <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
            已套用 {activeFilters} 項篩選
          </span>
        )}
        <div className="ml-auto text-xs text-slate-400">
          資料來源：WTO・各國政府公告・The Economist（2026/04）
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar filter */}
        {showFilter && (
          <FilterPanel filter={filter} onChange={setFilter} />
        )}

        {/* Content area */}
        <main className="flex-1 min-w-0 flex flex-col min-h-0">
          {view === 'arc' && (
            <div className="flex-1 flex min-h-0">
              <div className="flex-1 min-w-0 p-2">
                <ArcDiagram
                  agreements={displayed}
                  onSelect={a => {
                    setSelected(a);
                  }}
                />
              </div>
              {selected && (
                <AgreementDetail
                  agreement={selected}
                  onClose={() => setSelected(null)}
                />
              )}
            </div>
          )}

          {view === 'list' && (
            <div className="flex-1 flex min-h-0">
              <div className="flex-1 min-w-0 flex flex-col bg-white">
                <AgreementList
                  agreements={displayed}
                  selected={selected}
                  onSelect={setSelected}
                />
              </div>
              {selected && (
                <AgreementDetail
                  agreement={selected}
                  onClose={() => setSelected(null)}
                />
              )}
            </div>
          )}

          {view === 'stats' && (
            <Statistics agreements={displayed} />
          )}
        </main>
      </div>
    </div>
  );
}
