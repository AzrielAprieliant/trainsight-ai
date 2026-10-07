'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { TrainingRecord, DatasetInfo, KPIStats } from './types';
import { generateDemoDataset } from './data-generator';
import { computeKPIs } from './analytics';

interface DatasetContextType {
  dataset: DatasetInfo;
  setDataset: (info: DatasetInfo) => void;
  resetToDemo: () => void;
  stats: KPIStats;
}

const DatasetContext = createContext<DatasetContextType | null>(null);

let cachedDemo: TrainingRecord[] | null = null;
function getDemoData() {
  if (!cachedDemo) cachedDemo = generateDemoDataset();
  return cachedDemo;
}

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [dataset, setDS] = useState<DatasetInfo>(() => ({
    records: getDemoData(),
    source: 'demo',
  }));

  const setDataset = useCallback((info: DatasetInfo) => setDS(info), []);
  const resetToDemo = useCallback(() => setDS({ records: getDemoData(), source: 'demo' }), []);
  const stats = useMemo(() => computeKPIs(dataset.records), [dataset.records]);

  return (
    <DatasetContext.Provider value={{ dataset, setDataset, resetToDemo, stats }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error('useDataset must be used within DatasetProvider');
  return ctx;
}
