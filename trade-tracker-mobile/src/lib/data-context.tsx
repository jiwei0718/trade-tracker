import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { TradeAgreement } from '@/data/types';
import {
  ChangeEvent, DataSnapshot, Meta, loadData, markSeen, getLastSeen, unseenEvents,
} from './data-source';

interface DataContextValue {
  agreements: TradeAgreement[];
  events: ChangeEvent[];
  meta: Meta | null;
  source: DataSnapshot['source'];
  fetchedAt: string;
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
    events: snap?.events ?? [],
    meta: snap?.meta ?? null,
    source: snap?.source ?? 'bundled',
    fetchedAt: snap?.fetchedAt ?? '',
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
