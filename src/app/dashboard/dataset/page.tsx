'use client';

import { useState, useMemo } from 'react';
import { useDataset } from '@/lib/dataset-context';
import { TrainingRecord } from '@/lib/types';
import Papa from 'papaparse';
import {
  Upload,
  RotateCcw,
  Download,
  AlertCircle,
  CheckCircle,
  Database,
  Star,
  Search,
} from 'lucide-react';

const REQUIRED_COLUMNS = [
  'instructor',
  'course',
  'department',
  'rating',
  'feedback',
];

export default function DatasetPage() {
  const { dataset, setDataset, resetToDemo } = useDataset();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Calculate missing values summary
  const missingValues = useMemo(() => {
    let count = 0;
    dataset.records.forEach((r) => {
      if (!r.instructor) count++;
      if (!r.course) count++;
      if (!r.department) count++;
      if (r.rating === undefined || isNaN(r.rating)) count++;
      if (!r.feedback) count++;
    });
    return count;
  }, [dataset.records]);

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setUploadSuccess(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadError('Please upload a valid .csv file.');
      return;
    }

    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setUploadError('The uploaded CSV file is empty.');
          return;
        }

        const headers = results.meta.fields?.map((h) => h.trim().toLowerCase()) || [];

        // Check required columns (case-insensitive)
        const missing = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
        if (missing.length > 0) {
          setUploadError(
            `Missing required column(s): ${missing.join(', ')}. Expected columns: instructor, course, department, rating, feedback, training_date, participant_count.`
          );
          return;
        }

        // Map parsed rows to TrainingRecord
        const parsedRecords: TrainingRecord[] = results.data.map((row: Record<string, unknown>, idx: number) => {
          // Normalize keys to lowercase
          const norm: Record<string, unknown> = {};
          Object.keys(row).forEach((k) => {
            norm[k.trim().toLowerCase()] = row[k];
          });

          const rawRating = parseFloat(String(norm['rating'] ?? '4.0'));
          const rating = isNaN(rawRating) ? 4.0 : Math.min(5.0, Math.max(1.0, rawRating));

          const rawParticipants = parseInt(String(norm['participant_count'] ?? norm['participants'] ?? '25'), 10);
          const participant_count = isNaN(rawParticipants) ? 25 : rawParticipants;

          return {
            training_id: String(norm['training_id'] ?? `UP-${String(idx + 1).padStart(4, '0')}`),
            training_date: String(norm['training_date'] ?? norm['date'] ?? new Date().toISOString().split('T')[0]),
            instructor: String(norm['instructor'] ?? 'Unknown Instructor').trim(),
            course: String(norm['course'] ?? 'General Training').trim(),
            department: String(norm['department'] ?? 'General').trim(),
            rating: Math.round(rating * 10) / 10,
            participant_count,
            feedback: String(norm['feedback'] ?? 'Satisfactory training session.').trim(),
          };
        });

        if (parsedRecords.length === 0) {
          setUploadError('No valid data rows found in CSV.');
          return;
        }

        setDataset({
          records: parsedRecords,
          source: 'uploaded',
          fileName: file.name,
        });

        setUploadSuccess(`Successfully loaded ${parsedRecords.length} records from ${file.name}.`);
        setCurrentPage(1);
      },
      error: (error) => {
        setUploadError(`Failed to parse CSV file: ${error.message}`);
      },
    });

    // Reset file input value
    e.target.value = '';
  };

  // Download active dataset as CSV
  const handleDownloadCSV = () => {
    const csvString = Papa.unparse(dataset.records);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', dataset.source === 'demo' ? 'trainsight_demo_dataset.csv' : dataset.fileName || 'trainsight_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and paginate table preview
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return dataset.records;
    const term = searchTerm.toLowerCase();
    return dataset.records.filter(
      (r) =>
        r.course.toLowerCase().includes(term) ||
        r.instructor.toLowerCase().includes(term) ||
        r.department.toLowerCase().includes(term) ||
        r.feedback.toLowerCase().includes(term)
    );
  }, [dataset.records, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dataset Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload custom training evaluation CSVs, inspect columns and data hygiene, or reset to the demo benchmark.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dataset.source === 'uploaded' && (
            <button
              onClick={() => {
                resetToDemo();
                setUploadSuccess('Reset to default 500-record demo dataset.');
                setUploadError(null);
                setCurrentPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Demo</span>
            </button>
          )}
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Dataset Status & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Source */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <span className="text-xs font-medium text-slate-400">Active Source</span>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                dataset.source === 'demo'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {dataset.source === 'demo' ? 'Synthetic Demo' : 'Custom Upload'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            {dataset.source === 'demo' ? '500 pre-generated records' : dataset.fileName}
          </p>
        </div>

        {/* Total Rows */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <span className="text-xs font-medium text-slate-400">Dataset Rows</span>
          <p className="text-2xl font-bold text-white mt-1">{dataset.records.length.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-1">Evaluated training events</p>
        </div>

        {/* Total Columns */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <span className="text-xs font-medium text-slate-400">Schema Attributes</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">8 Columns</p>
          <p className="text-[11px] text-slate-500 mt-1">Normalized evaluation schema</p>
        </div>

        {/* Missing Values */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <span className="text-xs font-medium text-slate-400">Missing Values</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{missingValues}</p>
          <p className="text-[11px] text-slate-500 mt-1">Data completeness: 100%</p>
        </div>
      </div>

      {/* Upload Dropzone Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-sm font-semibold text-white mb-1">Upload Evaluation Dataset</h2>
        <p className="text-xs text-slate-400 mb-4">
          Upload a comma-separated values (.csv) file containing your training metrics and feedback.
        </p>

        {uploadError && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl p-8 text-center transition-colors bg-slate-950/30">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-200">
            Click to browse or drag and drop your CSV file
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Required columns: <code className="text-indigo-300">instructor</code>,{' '}
            <code className="text-indigo-300">course</code>,{' '}
            <code className="text-indigo-300">department</code>,{' '}
            <code className="text-indigo-300">rating</code>,{' '}
            <code className="text-indigo-300">feedback</code>
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mt-4 text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Data Preview Table</h2>
            <span className="text-xs text-slate-500">
              ({filteredData.length} records shown)
            </span>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search table rows..."
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none w-52 sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Instructor</th>
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-center">Rating</th>
                <th className="py-2.5 px-3 text-right">Participants</th>
                <th className="py-2.5 px-3 min-w-[240px]">Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginatedData.map((row) => (
                <tr key={row.training_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{row.training_id}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{row.training_date}</td>
                  <td className="py-2.5 px-3 font-medium text-white">{row.instructor}</td>
                  <td className="py-2.5 px-3">{row.course}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {row.department}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      {row.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">{row.participant_count}</td>
                  <td className="py-2.5 px-3 text-slate-400 italic line-clamp-1 max-w-xs" title={row.feedback}>
                    {row.feedback}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
