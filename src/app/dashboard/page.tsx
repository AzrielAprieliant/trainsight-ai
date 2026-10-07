'use client';

import { useState, useEffect } from 'react';
import { useDataset } from '@/lib/dataset-context';
import {
  computeKPIs,
  getSessionsOverTime,
  getAverageRatingByDepartment,
  getTopCoursesByParticipation,
  getRatingDistribution,
  getRecentSessions,
} from '@/lib/analytics';
import {
  TrendingUp,
  Star,
  Users,
  Award,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardOverviewPage() {
  const { dataset } = useDataset();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = computeKPIs(dataset.records);
  const sessionsOverTime = getSessionsOverTime(dataset.records);
  const ratingByDept = getAverageRatingByDepartment(dataset.records);
  const topCourses = getTopCoursesByParticipation(dataset.records).slice(0, 6);
  const ratingDist = getRatingDistribution(dataset.records);
  const recentSessions = getRecentSessions(dataset.records, 8);

  const kpis = [
    {
      title: 'Total Training Sessions',
      value: stats.totalSessions.toLocaleString(),
      subtitle: 'Recorded training events',
      icon: TrendingUp,
      accent: 'from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      title: 'Average Rating',
      value: `${stats.averageRating.toFixed(2)} / 5.0`,
      subtitle: 'Across all completed sessions',
      icon: Star,
      accent: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      title: 'Total Participants',
      value: stats.totalParticipants.toLocaleString(),
      subtitle: 'Employees trained to date',
      icon: Users,
      accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Active Instructors',
      value: stats.activeInstructors.toString(),
      subtitle: 'Facilitators in the roster',
      icon: Award,
      accent: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Executive performance metrics calculated from the {dataset.source === 'demo' ? 'demo' : 'active'}{' '}
            dataset ({dataset.records.length} records).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/ask-ai"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
          >
            <span>Ask Claude</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/dashboard/dataset"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manage Data</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden backdrop-blur-sm hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
                <div className={`p-2 rounded-lg border bg-gradient-to-br ${kpi.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
                <div className="text-xs text-slate-500 mt-1">{kpi.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Over Time */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Training Sessions Over Time</h2>
              <p className="text-xs text-slate-500">Monthly completed training volume</p>
            </div>
            <span className="text-xs text-indigo-400 font-medium">12-Month Trend</span>
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sessionsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#cbd5e1' }}
                  />
                  <Area type="monotone" dataKey="value" name="Sessions" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#sessionGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Rating by Department */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Average Rating by Department</h2>
              <p className="text-xs text-slate-500">Evaluation score benchmark out of 5.0</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium">Departmental Quality</span>
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingByDept} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 5]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#cbd5e1' }}
                    formatter={(val: number) => [`${val.toFixed(2)} / 5.0`, 'Avg Rating']}
                  />
                  <Bar dataKey="value" name="Avg Rating" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">Loading chart...</div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses by Participation */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Top Courses by Participation</h2>
              <p className="text-xs text-slate-500">Total attendees per training offering</p>
            </div>
            <span className="text-xs text-slate-500">Top 6 Courses</span>
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCourses} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#cbd5e1' }}
                    formatter={(val: number) => [val.toLocaleString(), 'Participants']}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Rating Distribution</h2>
              <p className="text-xs text-slate-500">Score breakdown across all evaluations</p>
            </div>
            <span className="text-xs text-amber-400 font-medium">1 to 5 Stars</span>
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDist} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#cbd5e1' }}
                    formatter={(val: number) => [`${val} reviews`, 'Count']}
                  />
                  <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">Loading chart...</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Training Sessions Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Training Sessions</h2>
            <p className="text-xs text-slate-500">Latest recorded training activities</p>
          </div>
          <Link
            href="/dashboard/analytics"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            View all sessions &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Session ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Rating</th>
                <th className="py-3 px-4 text-right">Participants</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentSessions.map((row) => (
                <tr key={row.training_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">{row.training_id}</td>
                  <td className="py-3 px-4">{row.training_date}</td>
                  <td className="py-3 px-4 font-medium text-white">{row.course}</td>
                  <td className="py-3 px-4">{row.instructor}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {row.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                        row.rating >= 4.0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : row.rating >= 3.0
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {row.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">{row.participant_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
