import React, { useState } from "react";
import { Terminal, Copy, Check, Play, CheckCircle2, FileCode, Code, ArrowRight } from "lucide-react";

export const DevelopmentTerminal: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testQuery, setTestQuery] = useState("button hover focus ring");
  const [testDomain, setTestDomain] = useState("ux");
  const [executing, setExecuting] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunSearch = async () => {
    setExecuting(true);
    setTestOutput(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(testQuery)}&domain=${encodeURIComponent(testDomain)}&limit=2`);
      const data = await res.json();
      setTestOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestOutput(`Error: ${err?.message || "Execution failed"}`);
    } finally {
      setExecuting(false);
    }
  };

  const prompts = [
    {
      id: "p1",
      title: "1. Build a Production Landing Page",
      badge: "Full Workflow",
      text: `Build a modern landing page for my SaaS analytics product.
Query the UI/UX Pro Max skill with --design-system to get the recommended pattern, style, colors, and typography.
Follow the Master + Overrides pattern and pre-delivery checklist. Avoid AI purple/pink gradients and emojis as icons.`,
    },
    {
      id: "p2",
      title: "2. Build a Data-Dense Dashboard",
      badge: "Component / Page",
      text: `Create an analytics dashboard with dark mode support.
Use UI/UX Pro Max data-dense dashboard style with KPI metric cards, interactive charts, and high-contrast table states.
Ensure compact labels have whitespace-nowrap and all buttons have cursor-pointer and visible focus.`,
    },
    {
      id: "p3",
      title: "3. UI/UX Audit & Refactor",
      badge: "Code Review",
      text: `Review this page against UI/UX Pro Max 119 UX guidelines.
Check for WCAG AA compliance (4.5:1 contrast), nested corner radius math (inner = outer - padding), and resilient text reflow without layout shift.`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Ready Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Environment Ready for Development
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                The UI/UX Pro Max intelligence engine is installed, AGENTS.md / GEMINI.md system directives are configured, and the BM25 search engine is online.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold rounded-lg whitespace-nowrap">
              Python 3.10 Engine Active
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Command Runner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" /> Live Search.py Query Playground
          </h3>
          <span className="text-xs text-slate-400 font-mono">BM25 Real-time Search</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Query String:</label>
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Domain / Catalog:</label>
            <div className="flex gap-2">
              <select
                value={testDomain}
                onChange={(e) => setTestDomain(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
              >
                <option value="ux">ux (Guidelines)</option>
                <option value="style">style (79 Styles)</option>
                <option value="color">color (192 Palettes)</option>
                <option value="typography">typography (74 Fonts)</option>
                <option value="chart">chart (25 Charts)</option>
                <option value="icons">icons (Lucide/SVG)</option>
              </select>

              <button
                onClick={handleRunSearch}
                disabled={executing}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run</span>
              </button>
            </div>
          </div>
        </div>

        {testOutput && (
          <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">JSON Output:</span>
              <button
                onClick={() => handleCopy(testOutput, "test-output")}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedId === "test-output" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === "test-output" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-cyan-300/90 max-h-60 overflow-y-auto bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              {testOutput}
            </pre>
          </div>
        )}
      </div>

      {/* Copyable Prompts for the User */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" /> Prompt Formulas for Development
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Use these prompts in your next instructions to invoke the UI/UX Pro Max intelligence automatically:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prompts.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {p.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{p.title}</h4>
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-300 font-mono leading-relaxed select-all">
                  {p.text}
                </div>
              </div>

              <button
                onClick={() => handleCopy(p.text, p.id)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedId === p.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{copiedId === p.id ? "Copied Prompt!" : "Copy Prompt to Clipboard"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
