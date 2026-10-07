'use client';

import { useState, useMemo, useEffect } from 'react';
import { useDataset } from '@/lib/dataset-context';
import {
  filterRecords,
  getAverageRatingByInstructor,
  getAverageRatingByCourse,
  getParticipantsByDepartment,
  getMonthlyActivity,
  getInstructorTable,
  computeKPIs,
} from '@/lib/analytics';
import {
  Filter,
  RotateCcw,
  Star,
  Users,
  Calendar,
  ArrowUpDown,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const { dataset } = useDataset();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter state
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Table sort state
  const [sortField, setSortField] = useState<'instructor' | 'sessions' | 'averageRating' | 'totalParticipants'>('averageRating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Extract unique options for filter dropdowns from the current dataset
  const { allDepts, allCourses, allInstructors } = useMemo(() => {
    const depts = new Set<string>();
    const courses = new Set<string>();
    const instrs = new Set<string>();
    dataset.records.forEach((r) => {
      depts.add(r.department);
      courses.add(r.course);
      instrs.add(r.instructor);
    });
    return {
      allDepts: Array.from(depts).sort(),
      allCourses: Array.from(courses).sort(),
      allInstructors: Array.from(instrs).sort(),
    };
  }, [dataset.records]);

  // Apply filters
  const filteredRecords = useMemo(() => {
    return filterRecords(dataset.records, {
      departments: selectedDept !== 'all' ? [selectedDept] : undefined,
      courses: selectedCourse !== 'all' ? [selectedCourse] : undefined,
      instructors: selectedInstructor !== 'all' ? [selectedInstructor] : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
  }, [dataset.records, selectedDept, selectedCourse, selectedInstructor, dateFrom, dateTo]);

  // Filtered stats & chart data
  const filteredStats = useMemo(() => computeKPIs(filteredRecords), [filteredRecords]);
  const ratingByInstructor = useMemo(() => getAverageRatingByInstructor(filteredRecords).slice(0, 10), [filteredRecords]);
  const ratingByCourse = useMemo(() => getAverageRatingByCourse(filteredRecords).slice(0, 10), [filteredRecords]);
  const participantsByDept = useMemo(() => getParticipantsByDepartment(filteredRecords), [filteredRecords]);
  const monthlyActivity = useMemo(() => getMonthlyActivity(filteredRecords), [filteredRecords]);

  // Instructor table sorted
  const instructorTable = useMemo(() => {
    const data = getInstructorTable(filteredRecords);
    return data.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'instructor') {
        comparison = a.instructor.localeCompare(b.instructor);
      } else {
        comparison = a[sortField] - b[sortField];
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filteredRecords, sortField, sortDirection]);

  const handleSort = (field: 'instructor' | 'sessions' | 'averageRating' | 'totalParticipants') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleResetFilters = () => {
    setSelectedDept('all');
    setSelectedCourse('all');
    setSelectedInstructor('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters =
    selectedDept !== 'all' ||
    selectedCourse !== 'all' ||
    selectedInstructor !== 'all' ||
    dateFrom !== '' ||
    dateTo !== '';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Training Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">
            Deep-dive performance benchmarks with multi-dimensional filtering across departments, courses, and instructors.
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors w-fit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Filter Controls</span>
          <span className="text-[11px] font-normal text-slate-500 lowercase">
            ({filteredRecords.length} of {dataset.records.length} records matching)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Department */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {allDepts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Courses</option>
              {allCourses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Instructor</label>
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Instructors</option>
              {allInstructors.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Filtered Mini KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-3">
          <span className="text-[11px] text-slate-400">Sessions Filtered</span>
          <p className="text-xl font-bold text-white mt-0.5">{filteredStats.totalSessions}</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-3">
          <span className="text-[11px] text-slate-400">Average Rating</span>
          <p className="text-xl font-bold text-amber-400 mt-0.5">{filteredStats.averageRating.toFixed(2)} / 5.0</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-3">
          <span className="text-[11px] text-slate-400">Participants Reached</span>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">{filteredStats.totalParticipants.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-3">
          <span className="text-[11px] text-slate-400">Instructors Involved</span>
          <p className="text-xl font-bold text-indigo-400 mt-0.5">{filteredStats.activeInstructors}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating by Instructor */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Average Rating by Instructor</h2>
              <p className="text-xs text-slate-500">Evaluation score benchmark (Top 10)</p>
            </div>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingByInstructor} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" domain={[0, 5]} fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#cbd5e1' }}
                    formatter={(val: number) => [`${val.toFixed(2)} / 5.0`, 'Rating']}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Rating by Course */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Average Rating by Course</h2>
              <p className="text-xs text-slate-500">Curriculum quality comparison (Top 10)</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingByCourse} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" domain={[0, 5]} fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} width={120} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#cbd5e1' }}
                    formatter={(val: number) => [`${val.toFixed(2)} / 5.0`, 'Rating']}
                  />
                  <Bar dataKey="value" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Participant Count by Department */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Participant Count by Department</h2>
              <p className="text-xs text-slate-500">Audience distribution across business units</p>
            </div>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={participantsByDept} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#cbd5e1' }}
                    formatter={(val: number) => [val.toLocaleString(), 'Participants']}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Monthly Training Activity */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Monthly Training Activity</h2>
              <p className="text-xs text-slate-500">Session cadence and participant trajectory</p>
            </div>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#cbd5e1' }}
                  />
                  <Area type="monotone" dataKey="value" name="Sessions" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#activityGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">Loading chart...</div>
            )}
          </div>
        </div>
      </div>

      {/* Instructor Performance Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Instructor Performance Roster</h2>
            <p className="text-xs text-slate-500">Click column headers to sort by performance metrics</p>
          </div>
          <span className="text-xs text-slate-500">{instructorTable.length} instructors listed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th
                  onClick={() => handleSort('instructor')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Instructor</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sessions')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors select-none text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Sessions</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('averageRating')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors select-none text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Average Rating</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalParticipants')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors select-none text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total Participants</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {instructorTable.map((row) => (
                <tr key={row.instructor} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-white">{row.instructor}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-300">{row.sessions}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                        row.averageRating >= 4.0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : row.averageRating >= 3.0
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {row.averageRating.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-200">
                    {row.totalParticipants.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
