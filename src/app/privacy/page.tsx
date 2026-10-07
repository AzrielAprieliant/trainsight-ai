import Link from 'next/link';
import { Sparkles, Shield, ArrowLeft, Lock, Database, EyeOff } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#060b18] text-slate-200">
      {/* Navigation */}
      <nav className="border-b border-slate-800/60 bg-[#060b18]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg text-white">TrainSight AI</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Prototype Privacy Policy</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Privacy & Data Handling</h1>
          <p className="text-sm text-slate-400 mt-2">
            Transparency on how data is handled in the TrainSight AI demonstration prototype.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Database className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-white mb-1">Synthetic Demo Data</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Default datasets consist solely of computer-generated mock entries. No real individuals or organizations are represented.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <EyeOff className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-white mb-1">Session-Only Scope</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uploaded files are processed entirely in browser memory. There is no persistent database storing your evaluations.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-white mb-1">Claude AI Processing</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI requests send aggregated statistical context to Anthropic only when you explicitly invoke AI features.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6 text-sm text-slate-300 leading-relaxed">
          <section>
            <h3 className="text-base font-semibold text-white mb-2">1. Demonstration Prototype Status</h3>
            <p>
              TrainSight AI is an experimental prototype designed to showcase modern AI-assisted analytics
              for organizational learning and talent teams. It is not an enterprise data processor, and
              users must not upload confidential, legally privileged, proprietary, or Personally Identifiable
              Information (PII).
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">2. Uploaded Dataset Handling</h3>
            <p>
              When you upload a CSV file via the Dataset Management interface:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-400">
              <li>The file is parsed locally using client-side JavaScript (Papa Parse).</li>
              <li>Data is held in memory for the duration of your browser session.</li>
              <li>Refreshing the page or navigating away clears the uploaded dataset.</li>
              <li>No server database or external storage bucket retains your uploaded files.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">3. Third-Party AI Services (Anthropic Claude)</h3>
            <p>
              When you trigger the &ldquo;Generate AI Summary&rdquo; button or ask questions in &ldquo;Ask TrainSight AI&rdquo;,
              a compact statistical summary and a limited subset of feedback comments are sent via server-side
              API route to the Anthropic Claude API for synthesis. No raw full-database dumps are transmitted.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">4. User Responsibility</h3>
            <p>
              Please utilize only sanitized, public, or sample data when testing custom uploads. You are
              responsible for complying with your organization&apos;s data governance and confidentiality policies.
            </p>
          </section>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
