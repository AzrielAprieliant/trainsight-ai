'use client';

import { useState, useMemo } from 'react';
import { useDataset } from '@/lib/dataset-context';
import {
  getFeedbackSentiment,
  getCommonThemes,
  classifyFeedback,
  prepareClaudeContext,
} from '@/lib/analytics';
import {
  Sparkles,
  ThumbsUp,
  MinusCircle,
  ThumbsDown,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Star,
} from 'lucide-react';

interface AISummaryResponse {
  overallSummary: string;
  positiveThemes: string[];
  commonComplaints: string[];
  areasForImprovement: string[];
  followUpQuestions: string[];
}

export default function FeedbackAnalysisPage() {
  const { dataset } = useDataset();

  // Sentiment and Themes
  const sentiment = useMemo(() => getFeedbackSentiment(dataset.records), [dataset.records]);
  const themes = useMemo(() => getCommonThemes(dataset.records), [dataset.records]);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');

  // AI Summary State
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState<AISummaryResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const total = dataset.records.length;
  const posPct = total > 0 ? ((sentiment.positive / total) * 100).toFixed(1) : '0';
  const neuPct = total > 0 ? ((sentiment.neutral / total) * 100).toFixed(1) : '0';
  const negPct = total > 0 ? ((sentiment.negative / total) * 100).toFixed(1) : '0';

  // Filter feedback
  const filteredFeedback = useMemo(() => {
    return dataset.records
      .filter((r) => {
        const textMatch =
          r.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        if (!textMatch) return false;

        if (sentimentFilter === 'all') return true;
        const itemSentiment = classifyFeedback(r.feedback);
        return itemSentiment === sentimentFilter;
      })
      .slice(0, 50); // display top 50 matches for performance
  }, [dataset.records, searchTerm, sentimentFilter]);

  const handleGenerateSummary = async () => {
    setLoadingAI(true);
    setAiError(null);

    try {
      const context = prepareClaudeContext(dataset.records);
      const res = await fetch('/api/ai/analyze-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAiError(data.error || 'Failed to generate AI summary.');
        return;
      }

      if (!data.available) {
        setAiError(data.error || 'AI features are unavailable in this deployment. Analytics features remain available.');
        return;
      }

      if (data.summary) {
        setAiResult(data.summary);
      } else {
        setAiError('Unexpected response format from Claude API.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setAiError(`Connection error: ${msg}`);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Feedback Analysis</h1>
          <p className="text-sm text-slate-400 mt-1">
            Participant sentiment distribution, recurring curriculum themes, and Claude AI synthesis.
          </p>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={loadingAI}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white transition-all shadow-md shadow-indigo-600/20 w-fit"
        >
          {loadingAI ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing with Claude...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Summary</span>
            </>
          )}
        </button>
      </div>

      {/* AI Error / Unavailable Notice */}
      {aiError && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-amber-300 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-200">AI Service Notice</p>
            <p className="mt-0.5 text-xs text-amber-300/90">{aiError}</p>
          </div>
        </div>
      )}

      {/* AI Summary Results */}
      {aiResult && (
        <div className="bg-slate-900/80 border border-indigo-500/40 rounded-xl p-6 shadow-xl shadow-indigo-500/5 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">AI Feedback Summary</h2>
                <p className="text-xs text-slate-400">Synthesized by Anthropic Claude 3.5 Sonnet</p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Active Dataset ({dataset.records.length} records)
            </span>
          </div>

          {/* Overall Summary */}
          <div className="mb-6 bg-slate-950/40 border border-slate-800 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">Overall Summary</h3>
            <p className="text-sm text-slate-200 leading-relaxed">{aiResult.overallSummary}</p>
          </div>

          {/* Positive Themes & Common Complaints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Positive */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Positive Themes</span>
              </div>
              <ul className="space-y-2">
                {aiResult.positiveThemes.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Complaints */}
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Common Complaints</span>
              </div>
              <ul className="space-y-2">
                {aiResult.commonComplaints.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Areas for Improvement & Follow-up Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Improvements */}
            <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>Areas for Improvement</span>
              </div>
              <ul className="space-y-2">
                {aiResult.areasForImprovement.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow-up Questions */}
            <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Potential Follow-up Questions</span>
              </div>
              <ul className="space-y-2">
                {aiResult.followUpQuestions.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sentiment Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Positive */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Positive Feedback</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{sentiment.positive}</span>
            <span className="text-xs text-emerald-400 font-medium">({posPct}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${posPct}%` }} />
          </div>
        </div>

        {/* Neutral */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Neutral Feedback</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MinusCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{sentiment.neutral}</span>
            <span className="text-xs text-amber-400 font-medium">({neuPct}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${neuPct}%` }} />
          </div>
        </div>

        {/* Negative */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Negative Feedback</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ThumbsDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{sentiment.negative}</span>
            <span className="text-xs text-rose-400 font-medium">({negPct}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${negPct}%` }} />
          </div>
        </div>
      </div>

      {/* Common Themes Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
        <h2 className="text-sm font-semibold text-white mb-1">Common Feedback Themes</h2>
        <p className="text-xs text-slate-500 mb-4">Frequency of key concepts identified across evaluations</p>
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => (
            <div
              key={t.theme}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200"
            >
              <span>{t.theme}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {t.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Participant Feedback Explorer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Participant Comments Explorer</h2>
            <p className="text-xs text-slate-500">Showing {filteredFeedback.length} responses</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search feedback..."
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none w-48 sm:w-60"
              />
            </div>
            {/* Sentiment Pill Filter */}
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value as 'all' | 'positive' | 'neutral' | 'negative')}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>

        {/* Comments Feed */}
        <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
          {filteredFeedback.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No participant comments match your search criteria.
            </div>
          ) : (
            filteredFeedback.map((item) => {
              const itemSent = classifyFeedback(item.feedback);
              return (
                <div key={item.training_id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-xs text-white">{item.course}</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="text-xs text-slate-400">{item.instructor}</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="text-[11px] text-slate-500">{item.department}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        {item.rating.toFixed(1)}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded capitalize ${
                          itemSent === 'positive'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : itemSent === 'neutral'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {itemSent}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic mt-1 leading-relaxed">
                    &ldquo;{item.feedback}&rdquo;
                  </p>
                  <div className="mt-2 text-[10px] text-slate-500 font-mono">
                    Session {item.training_id} &bull; {item.training_date}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
