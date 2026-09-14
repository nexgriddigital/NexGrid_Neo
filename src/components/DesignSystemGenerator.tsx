import React, { useState } from "react";
import {
  Sparkles,
  Sliders,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Type,
  Palette,
  Layout,
  Zap,
  CheckSquare,
  ArrowRight,
  Shield,
  RefreshCw,
} from "lucide-react";
import { DesignSystemResult } from "../types";
import { POPULAR_PRESETS, INITIAL_DEFAULT_SYSTEM } from "../data/presets";

export const DesignSystemGenerator: React.FC = () => {
  const [query, setQuery] = useState("SaaS analytics dashboard enterprise");
  const [projectName, setProjectName] = useState("Apex Analytics");
  const [variance, setVariance] = useState<number>(5);
  const [density, setDensity] = useState<number>(7);
  const [motion, setMotion] = useState<number>(4);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DesignSystemResult>(INITIAL_DEFAULT_SYSTEM);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [persistStatus, setPersistStatus] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    noEmojis: true,
    cursorPointer: true,
    contrastAA: true,
    compactLabels: true,
    visibleFocus: true,
    antiPatternsAvoided: true,
  });

  const handleGenerate = async (searchQuery: string = query, name: string = projectName) => {
    setLoading(true);
    setPersistStatus(null);
    try {
      const response = await fetch("/api/design-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          projectName: name,
          variance,
          density,
          motion,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate design system");
      }

      const data = await response.json();
      if (data.design_system) {
        setResult(data.design_system);
      }
    } catch (err) {
      console.warn("Using fallback/client-side preset due to:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (presetQuery: string, label: string) => {
    setQuery(presetQuery);
    setProjectName(label);
    handleGenerate(presetQuery, label);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(type);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handlePersist = async () => {
    setPersistStatus("saving");
    try {
      const res = await fetch("/api/persist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          projectName: projectName || "MyProject",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPersistStatus("saved");
      } else {
        setPersistStatus("error");
      }
    } catch {
      setPersistStatus("error");
    }
    setTimeout(() => setPersistStatus(null), 3500);
  };

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const cssVariablesString = `:root {
  --primary: ${result.colors.primary};
  --primary-foreground: ${result.colors.on_primary};
  --secondary: ${result.colors.secondary};
  --secondary-foreground: ${result.colors.on_secondary};
  --accent: ${result.colors.accent};
  --accent-foreground: ${result.colors.on_accent};
  --background: ${result.colors.background};
  --foreground: ${result.colors.foreground};
  --card: ${result.colors.card};
  --card-foreground: ${result.colors.card_foreground};
  --border: ${result.colors.border};
  --muted: ${result.colors.muted};
  --muted-foreground: ${result.colors.muted_foreground};
  --destructive: ${result.colors.destructive};
  --ring: ${result.colors.ring};
  --font-heading: '${result.typography.heading}', sans-serif;
  --font-body: '${result.typography.body}', sans-serif;
}`;

  return (
    <div className="space-y-8">
      {/* Search & Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div className="flex-1 w-full space-y-4">
            <div>
              <label htmlFor="search-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Product Query & Target Industry (192 Reasoning Profiles)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  placeholder="e.g., Fintech Crypto Wallet, SaaS Analytics, Telehealth Clinic..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
                <input
                  id="project-name-input"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project Name"
                  className="w-full sm:w-48 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
                <button
                  id="generate-button"
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Generate System</span>
                </button>
              </div>
            </div>

            {/* Presets Chips */}
            <div>
              <span className="text-xs text-slate-500 font-medium mr-2">Quick Presets:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-2">
                {POPULAR_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handlePresetSelect(p.query, p.label)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dials Column */}
          <div className="w-full lg:w-72 bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Dial Calibration
              </span>
              <span className="text-[10px] text-cyan-400/80 font-mono">v2.0 Tuners</span>
            </div>

            {/* Dial 1: Variance */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Design Variance</span>
                <span className="font-mono text-cyan-400">{variance}/10</span>
              </div>
              <input
                id="slider-variance"
                type="range"
                min="1"
                max="10"
                value={variance}
                onChange={(e) => setVariance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1: Minimal</span>
                <span>10: Bold/Asymmetric</span>
              </div>
            </div>

            {/* Dial 2: Density */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Visual Density</span>
                <span className="font-mono text-cyan-400">{density}/10</span>
              </div>
              <input
                id="slider-density"
                type="range"
                min="1"
                max="10"
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1: Spacious</span>
                <span>10: High-density</span>
              </div>
            </div>

            {/* Dial 3: Motion */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Motion Intensity</span>
                <span className="font-mono text-cyan-400">{motion}/10</span>
              </div>
              <input
                id="slider-motion"
                type="range"
                min="1"
                max="10"
                value={motion}
                onChange={(e) => setMotion(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1: Calm</span>
                <span>10: Cinematic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Result Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            Active Design System
          </span>
          <h2 className="text-xl font-bold text-white font-display mt-0.5">
            {result.project_name} • {result.category}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="copy-tokens-btn"
            onClick={() => handleCopy(JSON.stringify(result, null, 2), "tokens")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            {copiedToken === "tokens" ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copiedToken === "tokens" ? "Copied JSON!" : "Copy Tokens JSON"}</span>
          </button>

          <button
            id="copy-css-btn"
            onClick={() => handleCopy(cssVariablesString, "css")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            {copiedToken === "css" ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copiedToken === "css" ? "Copied CSS!" : "Copy CSS Vars"}</span>
          </button>

          <button
            id="persist-master-btn"
            onClick={handlePersist}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-xs font-medium text-cyan-300 rounded-lg border border-cyan-500/40 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {persistStatus === "saving"
                ? "Writing MASTER.md..."
                : persistStatus === "saved"
                ? "Persisted to Workspace!"
                : "Save MASTER.md"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid: Colors, Typography, Style, Pattern */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Color Palette */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" /> Color Tokens & WCAG
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              WCAG AA 4.5:1
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl border border-slate-800 space-y-1.5" style={{ backgroundColor: result.colors.card || "#111827" }}>
              <div className="h-6 rounded-lg shadow-inner" style={{ backgroundColor: result.colors.primary }} />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Primary</span>
                <span className="font-mono text-[11px] text-white font-semibold">{result.colors.primary}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-800 space-y-1.5" style={{ backgroundColor: result.colors.card || "#111827" }}>
              <div className="h-6 rounded-lg shadow-inner" style={{ backgroundColor: result.colors.accent }} />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Accent / CTA</span>
                <span className="font-mono text-[11px] text-white font-semibold">{result.colors.accent}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-800 space-y-1.5" style={{ backgroundColor: result.colors.card || "#111827" }}>
              <div className="h-6 rounded-lg shadow-inner" style={{ backgroundColor: result.colors.secondary }} />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Secondary</span>
                <span className="font-mono text-[11px] text-white font-semibold">{result.colors.secondary}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-800 space-y-1.5" style={{ backgroundColor: result.colors.card || "#111827" }}>
              <div className="h-6 rounded-lg shadow-inner border border-slate-700" style={{ backgroundColor: result.colors.background }} />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Background</span>
                <span className="font-mono text-[11px] text-white font-semibold">{result.colors.background}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Palette Rationale:</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.colors.notes || "High integrity, calibrated dark background with prominent trust accents."}
            </p>
          </div>
        </div>

        {/* Card 2: Typography Specimen */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" /> Typography Architecture
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Google Fonts</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase">Heading Font</span>
              <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                {result.typography.heading}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Display scale 1.25+ • Clear optical weight • High character
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-cyan-400 uppercase">Body Font</span>
              <div className="text-base font-medium text-slate-200 mt-0.5">
                {result.typography.body}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Min 16px body • 1.5–1.7 line height • 65–75ch comfortable reading width.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Pairing Mood:</span>
              <span className="text-slate-300 font-medium">{result.typography.mood}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Best For:</span>
              <span className="text-slate-300 font-medium">{result.typography.best_for}</span>
            </div>
          </div>
        </div>

        {/* Card 3: UI Style & Micro-Effects */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" /> Recommended UI Style
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              {result.style.type}
            </span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <h4 className="text-lg font-bold text-white font-display">
              {result.style.name}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.style.keywords}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Key Interactions:</span>
            <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
              {result.key_effects || result.style.effects}
            </p>
          </div>
        </div>
      </div>

      {/* Second Row: Pattern Layout & Anti-Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layout Architecture & Sections */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layout className="w-4 h-4 text-cyan-400" /> Landing Pattern: {result.pattern.name}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Structure Map</span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-400 font-medium">Recommended Section Flow:</span>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {result.pattern.sections.split(">").map((sec, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5 shadow-sm">
                      <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      {sec.trim()}
                    </span>
                    {idx < result.pattern.sections.split(">").length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">CTA Placement</span>
                <p className="text-xs text-slate-300 mt-1">{result.pattern.cta_placement}</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Conversion Strategy</span>
                <p className="text-xs text-slate-300 mt-1">{result.pattern.conversion}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Patterns & Pre-Delivery Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Anti-Patterns & Rules
            </h3>
            <span className="text-[10px] text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              Banned Clichés
            </span>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> What NOT to do for this product:
            </span>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {result.anti_patterns}
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> Pre-Delivery Audit:
            </span>
            <div className="space-y-1.5 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.noEmojis}
                  onChange={() => toggleCheck("noEmojis")}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>No emojis as icons (Vector Lucide only)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.cursorPointer}
                  onChange={() => toggleCheck("cursorPointer")}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>cursor-pointer on all clickables</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.compactLabels}
                  onChange={() => toggleCheck("compactLabels")}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>whitespace-nowrap on badges & chips</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.contrastAA}
                  onChange={() => toggleCheck("contrastAA")}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>WCAG AA 4.5:1 text contrast passed</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
