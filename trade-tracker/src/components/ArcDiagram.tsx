import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { TradeAgreement } from '../types';
import { STATUS_COLORS } from '../types';

interface Props {
  agreements: TradeAgreement[];
  onSelect: (a: TradeAgreement) => void;
}

interface Tooltip {
  x: number;
  y: number;
  content: TradeAgreement;
}

// Key parties to show in the arc diagram
const KEY_PARTIES = [
  { code: 'EU', label: '歐盟 (EU)', region: 'Europe' },
  { code: 'GB', label: '英國', region: 'Europe' },
  { code: 'US', label: '美國', region: 'America' },
  { code: 'CA', label: '加拿大', region: 'America' },
  { code: 'MX', label: '墨西哥', region: 'America' },
  { code: 'BR', label: '巴西 (Mercosur)', region: 'America' },
  { code: 'CN', label: '中國', region: 'Asia' },
  { code: 'JP', label: '日本', region: 'Asia' },
  { code: 'KR', label: '韓國', region: 'Asia' },
  { code: 'IN', label: '印度', region: 'Asia' },
  { code: 'AU', label: '澳洲', region: 'Oceania' },
  { code: 'NZ', label: '紐西蘭', region: 'Oceania' },
  { code: 'SG', label: '新加坡', region: 'Asia' },
  { code: 'ASEAN', label: '東協', region: 'Asia' },
  { code: 'CH', label: '瑞士 (EFTA)', region: 'Europe' },
  { code: 'SA', label: '沙烏地 (GCC)', region: 'Middle East' },
  { code: 'AE', label: '阿聯酋', region: 'Middle East' },
  { code: 'TW', label: '台灣', region: 'Asia' },
  { code: 'VN', label: '越南', region: 'Asia' },
  { code: 'ID', label: '印尼', region: 'Asia' },
];

const REGION_COLORS: Record<string, string> = {
  Europe: '#3b82f6',
  America: '#f59e0b',
  Asia: '#10b981',
  Oceania: '#8b5cf6',
  'Middle East': '#ef4444',
};

export default function ArcDiagram({ agreements, onSelect }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const draw = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W = svgRef.current.clientWidth || 800;
    const H = svgRef.current.clientHeight || 600;

    const margin = { left: 160, right: 60, top: 30, bottom: 30 };

    // Filter parties that appear in current agreements
    const activeCodes = new Set<string>();
    agreements.forEach(a => a.parties.forEach(p => activeCodes.add(p)));
    const parties = KEY_PARTIES.filter(p => activeCodes.has(p.code));

    if (parties.length === 0) return;

    const yScale = d3.scalePoint<string>()
      .domain(parties.map(p => p.code))
      .range([margin.top, H - margin.bottom])
      .padding(0.3);

    const g = svg.append('g');

    // Draw arcs for each agreement
    agreements.forEach(a => {
      const codes = a.parties.filter(p => parties.some(pp => pp.code === p));
      if (codes.length < 2) return;

      const color = STATUS_COLORS[a.status];
      const vol = a.tradeVolume ?? 10;
      const strokeW = Math.max(1, Math.min(8, Math.log10(vol + 1) * 1.5));

      // Draw arc from first party to each other party
      for (let i = 0; i < codes.length - 1; i++) {
        for (let j = i + 1; j < Math.min(codes.length, 5); j++) {
          const y1 = yScale(codes[i]) ?? 0;
          const y2 = yScale(codes[j]) ?? 0;
          if (!y1 || !y2) continue;

          const x = margin.left;
          const span = Math.abs(y2 - y1);
          const curvature = Math.min(span * 0.5, (W - margin.left - margin.right) * 0.8);

          const path = d3.path();
          path.moveTo(x, y1);
          path.bezierCurveTo(x + curvature, y1, x + curvature, y2, x, y2);

          g.append('path')
            .attr('d', path.toString())
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', strokeW)
            .attr('stroke-opacity', 0.5)
            .attr('class', 'arc-path')
            .style('cursor', 'pointer')
            .on('mouseover', function (event) {
              d3.select(this).attr('stroke-opacity', 0.9).attr('stroke-width', strokeW + 2);
              setTooltip({ x: event.clientX, y: event.clientY, content: a });
            })
            .on('mousemove', function (event) {
              setTooltip(t => t ? { ...t, x: event.clientX, y: event.clientY } : null);
            })
            .on('mouseout', function () {
              d3.select(this).attr('stroke-opacity', 0.5).attr('stroke-width', strokeW);
              setTooltip(null);
            })
            .on('click', () => onSelect(a));
        }
      }
    });

    // Draw party dots and labels
    parties.forEach(p => {
      const y = yScale(p.code) ?? 0;
      const region = p.region;
      const dotColor = REGION_COLORS[region] || '#64748b';

      g.append('circle')
        .attr('cx', margin.left)
        .attr('cy', y)
        .attr('r', 5)
        .attr('fill', dotColor)
        .attr('class', 'country-dot');

      g.append('text')
        .attr('x', margin.left - 10)
        .attr('y', y)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('fill', '#334155')
        .text(p.label);
    });

    // Legend
    const legendStatuses = [
      { label: '已生效', color: STATUS_COLORS.in_force },
      { label: '談判完成', color: STATUS_COLORS.concluded },
      { label: '已簽署', color: STATUS_COLORS.signed },
      { label: '談判中', color: STATUS_COLORS.negotiating },
      { label: '已暫停', color: STATUS_COLORS.suspended },
    ];
    const lg = svg.append('g').attr('transform', `translate(${margin.left + 20}, ${H - 20})`);
    legendStatuses.forEach((ls, i) => {
      const gx = i * 90;
      lg.append('line')
        .attr('x1', gx).attr('y1', 0).attr('x2', gx + 20).attr('y2', 0)
        .attr('stroke', ls.color).attr('stroke-width', 3);
      lg.append('text')
        .attr('x', gx + 24).attr('y', 4)
        .attr('font-size', 10).attr('fill', '#64748b')
        .text(ls.label);
    });

    // Line thickness legend
    const tg = svg.append('g').attr('transform', `translate(${W - 160}, 30)`);
    tg.append('text').attr('font-size', 10).attr('fill', '#94a3b8').text('線寬 = 貿易量');
    [10, 100, 1000].forEach((vol, i) => {
      const sw = Math.max(1, Math.min(8, Math.log10(vol + 1) * 1.5));
      tg.append('line')
        .attr('x1', 0).attr('y1', 18 + i * 14)
        .attr('x2', 30).attr('y2', 18 + i * 14)
        .attr('stroke', '#94a3b8').attr('stroke-width', sw);
      tg.append('text')
        .attr('x', 36).attr('y', 22 + i * 14)
        .attr('font-size', 10).attr('fill', '#94a3b8')
        .text(`${vol}B USD`);
    });
  }, [agreements, onSelect]);

  useEffect(() => {
    draw();
    const ro = new ResizeObserver(draw);
    if (svgRef.current?.parentElement) ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
      {tooltip && (
        <div
          className="tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          <div className="font-semibold mb-1">{tooltip.content.nameZh}</div>
          <div className="text-slate-300 text-xs">{tooltip.content.partyNamesZh.join(' · ')}</div>
          {tooltip.content.tradeVolume && (
            <div className="text-xs mt-1">貿易量：{tooltip.content.tradeVolume}B USD</div>
          )}
          <div className="text-xs mt-0.5 text-slate-400">點擊查看詳情</div>
        </div>
      )}
    </div>
  );
}
