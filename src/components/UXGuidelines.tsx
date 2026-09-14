import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, XCircle, Search } from "lucide-react";
import { CORE_UX_GUIDELINES } from "../data/presets";

export const UXGuidelines: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", "Icons & Visuals", "Interaction", "Layout & Text", "Color & State", "Focus States", "Geometry", "Animation"];

  const filtered = CORE_UX_GUIDELINES.filter((item) => {
    const matchesCat = filter === "All" || item.category === filter;
    const matchesSearch =
      item.guideline.toLowerCase().includes(search.toLowerCase()) ||
      item.do.toLowerCase().includes(search.toLowerCase()) ||
      item.dont.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                119 UX Guidelines & Anti-Pattern Rules
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Deterministic design rules that prevent common production failures, broken wrapping, and generic AI design clichés.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search UX guidelines..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === cat
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((rule, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  {rule.category}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{rule.guideline}</h3>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${
                  rule.severity === "Critical"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    : rule.severity === "High"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                {rule.severity}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Do */}
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>DO (Best Practice)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rule.do}</p>
              </div>

              {/* Don't */}
              <div className="p-3.5 bg-rose-950/20 border border-rose-500/20 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>DON'T (Anti-Pattern)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rule.dont}</p>
              </div>
            </div>

            {rule.wcag && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Standard / Compliance:</span>
                <span className="font-mono text-slate-400">{rule.wcag}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
