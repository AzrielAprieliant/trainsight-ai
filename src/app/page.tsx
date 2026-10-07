import Link from 'next/link';
import {
  BarChart3, MessageSquare, Sparkles, Target,
  ArrowRight, Github, ChevronRight, TrendingUp, Users, Star,
} from 'lucide-react';

/* ── Feature cards ── */
const features = [
  { icon: BarChart3, title: 'Training Analytics', desc: 'Analyze ratings, instructors, courses, departments, and participation trends across your organization.' },
  { icon: MessageSquare, title: 'AI Feedback Analysis', desc: 'Use Claude to summarize participant feedback and identify recurring themes automatically.' },
  { icon: Sparkles, title: 'Natural Language Questions', desc: 'Ask questions about training data without manually building reports or queries.' },
  { icon: Target, title: 'Actionable Insights', desc: 'Surface patterns and areas that may require further investigation or improvement.' },
];

/* ── Steps ── */
const steps = [
  { num: '01', title: 'Upload Data', desc: 'Upload training evaluation data as a CSV file, or explore the built-in demo dataset.' },
  { num: '02', title: 'Explore Analytics', desc: 'View interactive dashboards with ratings, participation, and feedback breakdowns.' },
  { num: '03', title: 'Ask Claude', desc: 'Ask natural-language questions about your dataset and get AI-powered answers.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060b18]">
      {/* ── Nav ── */}
      <nav className="border-b border-slate-800/60 bg-[#060b18]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg text-white">TrainSight AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Product</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#status" className="hover:text-white transition-colors">About</a>
            <a href="https://github.com/azrielaprieliant/trainsight-ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:inline-flex text-sm text-slate-300 hover:text-white transition-colors px-3 py-1.5">
              Open Dashboard
            </Link>
            <Link href="/dashboard" className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3 h-3" /> Early-stage prototype
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Turn training feedback into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                actionable insights
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-lg">
              TrainSight AI helps professional training teams analyze evaluation data,
              understand participant feedback, and explore insights using AI.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Try the Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://github.com/azrielaprieliant/trainsight-ai" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
                <Github className="w-4 h-4" /> View on GitHub
              </a>
            </div>
          </div>

          {/* Decorative dashboard preview */}
          <div className="hidden lg:block relative">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-indigo-500/5">
              {/* Mini KPIs */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: TrendingUp, label: 'Sessions', val: '500', color: 'bg-indigo-500' },
                  { icon: Star, label: 'Avg Rating', val: '3.42', color: 'bg-amber-500' },
                  { icon: Users, label: 'Participants', val: '14.8k', color: 'bg-emerald-500' },
                ].map(k => (
                  <div key={k.label} className="bg-slate-800/60 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-5 h-5 rounded ${k.color} flex items-center justify-center`}>
                        <k.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[10px] text-slate-500">{k.label}</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{k.val}</p>
                  </div>
                ))}
              </div>
              {/* Mini chart bars */}
              <div className="bg-slate-800/40 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-3">Rating by Department</p>
                <div className="space-y-2">
                  {[
                    { name: 'Technology', w: '82%' },
                    { name: 'Operations', w: '76%' },
                    { name: 'Finance', w: '71%' },
                    { name: 'Data & Analytics', w: '68%' },
                    { name: 'Human Resources', w: '64%' },
                  ].map(d => (
                    <div key={d.name} className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 w-24 shrink-0 text-right">{d.name}</span>
                      <div className="flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: d.w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 rounded-2xl blur-2xl" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white">Product Features</h2>
          <p className="mt-3 text-slate-400">Everything you need to understand training performance.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
          <p className="mt-3 text-slate-400">Three simple steps to get insights from training data.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(s => (
            <div key={s.num} className="relative bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <span className="text-5xl font-black text-indigo-500/10">{s.num}</span>
              <h3 className="font-semibold text-white mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Try the demo now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Status ── */}
      <section id="status" className="max-w-3xl mx-auto px-6 py-20 border-t border-slate-800/60 text-center">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Prototype Status</h2>
          <p className="text-slate-400 leading-relaxed">
            TrainSight AI is currently an <strong className="text-slate-200">early-stage prototype</strong>.
            The public demo uses synthetic training data. This project explores how AI can support
            professional training analytics and is not a commercial product.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>TrainSight AI &middot; Prototype</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <a href="https://github.com/azrielaprieliant/trainsight-ai" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
