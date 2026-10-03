import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { AgreementDetail, TradeAgreement } from '@/data/types';
import {
  AgreementEvent, DataSnapshot, PipelineRun, SourceHealth, UpdateSetting,
  loadData, markSeen, getLastSeen, unseenEvents,
} from './data-source';

interface DataContextValue {
  agreements: TradeAgreement[];
  details: Record<string, AgreementDetail>;
  events: AgreementEvent[];
  sources: SourceHealth[];
  runs: PipelineRun[];
  settings: UpdateSetting[];
  source: DataSnapshot['source'];
  fetchedAt: string;
  error?: string;
  loading: boolean;
  refresh: () => Promise<void>;
  unseenCount: number;
  acknowledgeAll: () => Promise<void>;
}

const Ctx = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [snap, setSnap] = useState<DataSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  const load = useCallback(async (force: boolean) => {
    setLoading(true);
    const data = await loadData({ force });
    setSnap(data);
    setLastSeen(await getLastSeen());
    setLoading(false);
  }, []);

  useEffect(() => { load(false); }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  const acknowledgeAll = useCallback(async () => {
    await markSeen();
    setLastSeen(new Date().toISOString());
  }, []);

  const value: DataContextValue = {
    agreements: snap?.agreements ?? [],
    details: snap?.details ?? {},
    events: snap?.events ?? [],
    sources: snap?.sources ?? [],
    runs: snap?.runs ?? [],
    settings: snap?.settings ?? [],
    source: snap?.source ?? 'bundled',
    fetchedAt: snap?.fetchedAt ?? '',
    error: snap?.error,
    loading,
    refresh,
    unseenCount: unseenEvents(snap?.events ?? [], lastSeen).length,
    acknowledgeAll,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useData must be inside DataProvider');
  return v;
}
