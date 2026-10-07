'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { DatasetProvider, useDataset } from '@/lib/dataset-context';
import { Database, Menu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function TopNav({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { dataset } = useDataset();
  return (
    <header className="h-14 border-b border-slate-800/60 px-4 sm:px-6 flex items-center justify-between bg-[#0a0f1e]/80 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-1.5 text-slate-400 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Database className="w-4 h-4" />
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            dataset.source === 'demo'
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {dataset.source === 'demo' ? 'Demo Dataset' : 'Uploaded'}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline">{dataset.records.length} records</span>
        </div>
      </div>
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>
    </header>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#060b18]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DatasetProvider>
      <DashboardShell>{children}</DashboardShell>
    </DatasetProvider>
  );
}
