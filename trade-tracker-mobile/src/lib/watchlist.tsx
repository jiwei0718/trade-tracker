import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const KEY = 'trade-tracker-watchlist';
const SNAPSHOT_KEY = 'trade-tracker-watchlist-snapshot';

interface WatchlistContextValue {
  ids: Set<string>;
  hasItem: (id: string) => boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  size: number;
  // Status snapshot (status when first added) — used to detect changes
  snapshots: Record<string, string>;
  setSnapshot: (id: string, status: string) => void;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [snapshots, setSnapshots] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setIds(new Set(JSON.parse(raw)));
        const snapRaw = await AsyncStorage.getItem(SNAPSHOT_KEY);
        if (snapRaw) setSnapshots(JSON.parse(snapRaw));
      } catch {}
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(KEY, JSON.stringify(Array.from(ids))).catch(() => {});
  }, [ids, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshots)).catch(() => {});
  }, [snapshots, hydrated]);

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const add = useCallback((id: string) => setIds(prev => new Set(prev).add(id)), []);
  const remove = useCallback((id: string) => setIds(prev => { const n = new Set(prev); n.delete(id); return n; }), []);
  const hasItem = useCallback((id: string) => ids.has(id), [ids]);
  const setSnapshot = useCallback((id: string, status: string) => {
    setSnapshots(prev => ({ ...prev, [id]: status }));
  }, []);

  return (
    <WatchlistContext.Provider value={{ ids, hasItem, toggle, add, remove, size: ids.size, snapshots, setSnapshot }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
