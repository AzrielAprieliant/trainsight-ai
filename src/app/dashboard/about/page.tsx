import {
  Sparkles,
  Info,
  Shield,
  Cpu,
  Database,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">About TrainSight AI</h1>
        <p className="text-sm text-slate-400 mt-1">
          Project background, system architecture, and prototype disclosures.
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Project Mission</h2>
            <p className="text-xs text-slate-400">AI-assisted intelligence for training & development</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          TrainSight AI is an early-stage prototype exploring how artificial intelligence can help
          corporate learning and development (L&D) teams, trainers, and HR business partners
          understand course evaluations and open-ended participant feedback at scale.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed mt-3">
          Traditional survey tools produce static charts and spreadsheets that require hours of
          manual synthesis. TrainSight AI pairs aggregated statistical computing with Anthropic
          Claude to rapidly surface trends, recurring sentiment, and actionable curriculum improvements.
        </p>
      </div>

      {/* Prototype Status Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stage */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>Current Stage</span>
          </div>
          <p className="text-lg font-bold text-white">Early-Stage Prototype (v0.1)</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            This project is a functional technology proof-of-concept. It is not currently offered
            as a commercial SaaS product and has no paying enterprise customers or active monetization.
          </p>
        </div>

        {/* Demo Data */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Data Transparency</span>
          </div>
          <p className="text-lg font-bold text-white">100% Synthetic Demo Data</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            All default records, instructor names, course titles, evaluation scores, and feedback
            texts are programmatically generated. No real corporate or personal data is included.
          </p>
        </div>

        {/* AI Model */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>AI Architecture</span>
          </div>
          <p className="text-lg font-bold text-white">Anthropic Claude 3.5 Sonnet</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Natural language analysis and feedback summarization are powered by server-side calls
            to Claude using compact aggregated statistical contexts to prevent hallucinations.
          </p>
        </div>

        {/* Privacy & Safety */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Data Privacy</span>
          </div>
          <p className="text-lg font-bold text-white">Session-Based Memory</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Uploaded CSV files remain in memory during the active session. TrainSight AI does not
            persist user files in a permanent database.
          </p>
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-sm font-semibold text-white mb-3">Key Disclaimers</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300">
              <strong className="text-white">Commercial Status: </strong>
              TrainSight AI does not claim enterprise partnerships, active client revenue, or external investment.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300">
              <strong className="text-white">Grounded Responses: </strong>
              The AI prompt engineering mandates strict grounding in computed dataset statistics, explicitly acknowledging when data is insufficient.
            </p>
          </div>
        </div>
      </div>

      {/* Open Source / Links */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Source Code & Repository</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore the codebase, inspect the prompts, or deploy your own instance to Vercel.
          </p>
        </div>
        <a
          href="https://github.com/azrielaprieliant/trainsight-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors shrink-0"
        >
          <Github className="w-4 h-4" />
          <span>View on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>
    </div>
  );
}
