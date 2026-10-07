'use client';

import { useState, useRef, useEffect } from 'react';
import { useDataset } from '@/lib/dataset-context';
import { prepareClaudeContext } from '@/lib/analytics';
import {
  Send,
  User,
  Bot,
  AlertTriangle,
  RotateCcw,
  HelpCircle,
  Loader2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'Which instructors have the highest average ratings?',
  'Which courses receive the most negative feedback?',
  'What are the most common participant complaints?',
  'Which department has the lowest average rating?',
  'How has training participation changed over time?',
];

export default function AskAIPage() {
  const { dataset } = useDataset();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am TrainSight AI. I can answer questions about your current training evaluation dataset. Select a suggested query below or type your own question to get started.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim() || loading) return;

    setErrorNotice(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: questionText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const context = prepareClaudeContext(dataset.records);
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText.trim(),
          context,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorNotice(data.error || 'Failed to query Claude.');
        return;
      }

      if (!data.available) {
        setErrorNotice(data.error || 'AI features are unavailable in this deployment. Analytics features remain available.');
        const fallbackMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content:
            'AI features are unavailable in this deployment because ANTHROPIC_API_KEY is not configured. You can still explore the interactive dashboard and analytics tabs.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        return;
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'No response returned.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setErrorNotice(`Connection error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Conversation reset. You can ask any new question about the active training dataset.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorNotice(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-6.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Ask TrainSight AI</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Claude 3.5 Sonnet
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Ask questions about the currently loaded training dataset. All answers are grounded in calculated statistics.
          </p>
        </div>
        <button
          onClick={handleResetChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          title="Clear Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions */}
      <div className="shrink-0 bg-slate-900/50 border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Suggested Questions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              disabled={loading}
              className="text-xs bg-slate-800/80 hover:bg-indigo-950/60 hover:text-indigo-300 hover:border-indigo-500/40 border border-slate-700/80 text-slate-300 px-3 py-1.5 rounded-lg transition-colors text-left disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {errorNotice && (
        <div className="shrink-0 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-3 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-amber-200">Notice: </span>
            {errorNotice}
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 bg-slate-900/40 border border-slate-800 rounded-xl p-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 border border-slate-700/70 text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div
                  className={`text-[10px] mt-2 font-mono ${
                    isUser ? 'text-indigo-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 text-slate-300 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl rounded-tl-none p-4 text-xs text-slate-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Analyzing dataset statistics with Claude...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(inputQuestion);
        }}
        className="shrink-0 flex gap-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask a question about ratings, courses, instructors, or feedback..."
          disabled={loading}
          className="flex-1 bg-slate-900/90 border border-slate-700 text-slate-100 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !inputQuestion.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-5 rounded-xl transition-colors flex items-center justify-center shadow-md shadow-indigo-600/20"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
