import React, { useState } from "react";
import { Search, Layers, Sparkles, Copy, Check, Eye } from "lucide-react";
import { FEATURED_STYLES } from "../data/presets";
import { UIStyle } from "../types";

export const StyleExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePreviewStyle, setActivePreviewStyle] = useState<UIStyle>(FEATURED_STYLES[0]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const categories = ["All", "Modern UI", "Visual Effect", "Classic Modern", "Modern Pattern", "Expressive", "Refined Tactile"];

  const filteredStyles = FEATURED_STYLES.filter((style) => {
    const matchesSearch =
      style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      style.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
      style.best_for.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || style.type === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                79 UI Styles Taxonomy (50 Active)
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Curated architectural styles with mathematical spacing, precise border radii, and tailored micro-interactions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search styles, keywords..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Styles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStyles.map((style) => {
          const isSelected = activePreviewStyle.id === style.id;
          return (
            <div
              key={style.id}
              onClick={() => setActivePreviewStyle(style)}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-4 transition-all cursor-pointer hover:border-slate-700 ${
                isSelected ? "border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-500/10" : "border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {style.type}
                </span>
                <span className="text-xs text-cyan-400 font-mono flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Inspect
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-display">{style.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {style.keywords}
                </p>
              </div>

              {/* Visual mini specimen */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Best For:
                </div>
                <div className="text-xs text-slate-300 line-clamp-2">
                  {style.best_for}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Performance:</span>
                <span className="text-slate-300 font-mono text-[11px]">{style.performance.split("|")[0]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Detail Inspector for Selected Style */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Deep Inspector
            </span>
            <h3 className="text-2xl font-bold text-white font-display mt-0.5">
              {activePreviewStyle.name}
            </h3>
          </div>

          <button
            onClick={() =>
              handleCopy(
                `Design a ${activePreviewStyle.name} interface. Keywords: ${activePreviewStyle.keywords}. Effects: ${activePreviewStyle.effects}. Best for: ${activePreviewStyle.best_for}.`,
                "prompt"
              )
            }
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-xl border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            {copiedText === "prompt" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400" />
            )}
            <span>{copiedText === "prompt" ? "Copied Prompt!" : "Copy AI Prompt Guidelines"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Interaction & Effects:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activePreviewStyle.effects}
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-slate-300">Accessibility & Verification:</span>
              <p className="text-xs text-slate-400 font-mono">
                {activePreviewStyle.accessibility}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-slate-300">Tailwind Implementation Snippet:</span>
              <pre className="text-[11px] font-mono text-cyan-300/90 bg-slate-900 p-3 rounded-lg border border-slate-800 overflow-x-auto">
{activePreviewStyle.id === "glassmorphism"
  ? `className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl"`
  : activePreviewStyle.id === "bento-grid"
  ? `className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-950 rounded-3xl border border-slate-800"`
  : activePreviewStyle.id === "neo-brutalism"
  ? `className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"`
  : `className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm"`}
              </pre>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-slate-300">Target Platforms & Modes:</span>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>Light Mode: <strong className="text-white">{activePreviewStyle.light_mode}</strong></span>
                <span>Dark Mode: <strong className="text-white">{activePreviewStyle.dark_mode}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
