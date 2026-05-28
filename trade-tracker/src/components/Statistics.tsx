import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import type { TradeAgreement } from '../types';
import { STATUS_LABELS, STATUS_COLORS, TYPE_LABELS } from '../types';

interface Props {
  agreements: TradeAgreement[];
}

export default function Statistics({ agreements }: Props) {
  // Count by status
  const byStatus = Object.entries(STATUS_LABELS).map(([s, label]) => ({
    name: label,
    count: agreements.filter(a => a.status === s).length,
    color: STATUS_COLORS[s as keyof typeof STATUS_COLORS],
  })).filter(d => d.count > 0);

  // Count by type
  const byType = Object.entries(TYPE_LABELS).map(([t, label]) => ({
    name: label,
    count: agreements.filter(a => a.type === t).length,
  })).filter(d => d.count > 0);

  // Top 10 parties
  const partyCounts: Record<string, number> = {};
  agreements.forEach(a => {
    a.partyNamesZh.forEach(p => {
      if (p.includes('成員') || p.includes('others')) return;
      partyCounts[p] = (partyCounts[p] || 0) + 1;
    });
  });
  const topParties = Object.entries(partyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // By year (concluded/in_force)
  const yearCounts: Record<number, number> = {};
  agreements.forEach(a => {
    const d = a.keyDates.in_force ?? a.keyDates.concluded ?? a.keyDates.signed;
    if (d) {
      const y = parseInt(d.split('-')[0]);
      if (y >= 2000) yearCounts[y] = (yearCounts[y] || 0) + 1;
    }
  });
  const byYear = Object.entries(yearCounts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, count]) => ({ year, count }));

  // Total trade covered
  const activeTrade = agreements
    .filter(a => ['in_force', 'signed', 'concluded'].includes(a.status))
    .reduce((s, a) => s + (a.tradeVolume ?? 0), 0);

  const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
    <div className="bg-white rounded-xl border border-slate-100 p-4">
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-sm font-medium text-slate-600 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

  return (
    <div className="p-6 overflow-y-auto h-full bg-slate-50">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="顯示中協定總數" value={agreements.length} />
        <StatCard label="已生效協定" value={agreements.filter(a => a.status === 'in_force').length} />
        <StatCard
          label="「解放日」後新達成"
          value={agreements.filter(a =>
            ['concluded', 'signed'].includes(a.status) &&
            (a.tags?.includes('post-liberation-day') || false)
          ).length}
        />
        <StatCard
          label="估計涵蓋貿易量"
          value={`$${Math.round(activeTrade / 1000 * 10) / 10}兆`}
          sub="（生效/談完/已簽）"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status distribution */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <h3 className="font-semibold text-slate-700 mb-3">協定狀態分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byStatus} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={(v) => [`${v} 個`, '協定數']} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {byStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Type pie */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <h3 className="font-semibold text-slate-700 mb-3">協定類型分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={byType}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                label={({ name, value }) => `${name}(${value})`}
                labelLine={false}
              >
                {byType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} 個`, '協定數']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Year timeline */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <h3 className="font-semibold text-slate-700 mb-1">按年份（生效/完成）</h3>
          <p className="text-xs text-slate-400 mb-3">以生效或談判完成日期統計</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={byYear} margin={{ left: -10, right: 10 }}>
              <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={1} angle={-45} textAnchor="end" height={40} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v} 個`, '協定數']} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top parties */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <h3 className="font-semibold text-slate-700 mb-3">最活躍締約方（Top 10）</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topParties} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => [`${v} 個`, '協定數']} />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
