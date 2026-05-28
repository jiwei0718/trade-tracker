import type { AgreementStatus } from '../types';
import { STATUS_LABELS, STATUS_COLORS } from '../types';

interface Props {
  status: AgreementStatus;
  small?: boolean;
}

export default function StatusBadge({ status, small }: Props) {
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];
  const pad = small ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${pad}`}
      style={{ background: color + '20', color, border: `1px solid ${color}40` }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
      {label}
    </span>
  );
}
