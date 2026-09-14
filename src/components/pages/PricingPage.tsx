import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  Sliders, 
  DollarSign, 
  Layers, 
  Cpu, 
  Zap,
  Check
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenPortal: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onOpenPortal
}) => {
  // Estimator state
  const [projectType, setProjectType] = useState<'saas' | 'ecommerce' | 'marketing'>('saas');
  const [selectedRetainer, setSelectedRetainer] = useState<'none' | 'launch' | 'scale' | 'enterprise'>('scale');
  const [includeAuth, setIncludeAuth] = useState(true);
  const [includeRealtime, setIncludeRealtime] = useState(true);
  const [includeStripe, setIncludeStripe] = useState(false);
  const [includeLighthouseAudit, setIncludeLighthouseAudit] = useState(true);

  // Price calculations
  const basePrices = {
    saas: 18000,
    ecommerce: 14000,
    marketing: 7500
  };

  const retainerPrices = {
    none: 0,
    launch: 3500,
    scale: 7500,
    enterprise: 15000
  };

  const calculatedSetup = 
    basePrices[projectType] +
    (includeAuth ? 2000 : 0) +
    (includeRealtime ? 2500 : 0) +
    (includeStripe ? 1800 : 0) +
    (includeLighthouseAudit ? 1200 : 0);

  const calculatedMonthly = retainerPrices[selectedRetainer];

  return (
    <div className="space-y-16 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
          Transparent Investment
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">
          Retainers & Continuous Engineering
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Predictable monthly engineering capacity with guaranteed response SLAs. No surprise invoices, no hidden management fees, and real-time tracking through the NexGrid Client Portal.
        </p>
      </div>

      {/* THREE RETAINER TIERS (FEATURING SCALE & PERFORMANCE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Tier 1: Launch */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Entry Partnership
            </div>
            <h3 className="text-2xl font-heading font-extrabold text-slate-900">
              Launch Tier
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Ideal for newly launched applications and marketing sites requiring continuous maintenance, security updates, and steady feature evolution.
            </p>

            <div className="pt-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-heading font-extrabold text-slate-900">$3,500</span>
                <span className="text-slate-500 text-xs font-mono">/ month</span>
              </div>
              <div className="text-xs text-indigo-600 font-mono mt-1">
                20 dedicated engineering hours/mo
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24-Hour Business SLA Response</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Monthly security & dependency updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Client Portal Access & Ticket Submissions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Basic Lighthouse performance checks</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="w-full py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Select Launch Tier
          </button>
        </div>

        {/* Tier 2: Scale & Performance Tier (FLAGSHIP) */}
        <div className="bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-8 shadow-xl border-2 border-indigo-500 relative flex flex-col justify-between space-y-6 transform lg:-translate-y-2">
          {/* Flagship Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
            ★ Most Popular • Flagship Tier
          </div>

          <div className="space-y-4 pt-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              Continuous Horsepower
            </div>
            <h3 className="text-2xl font-heading font-extrabold text-white">
              Scale & Performance
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              The flagship retainer for revenue-generating SaaS platforms and high-traffic e-commerce operations needing dedicated staff engineering bandwidth.
            </p>

            <div className="pt-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-heading font-extrabold text-white">$7,500</span>
                <span className="text-slate-300 text-xs font-mono">/ month</span>
              </div>
              <div className="text-xs text-indigo-300 font-mono mt-1 font-semibold">
                50 dedicated engineering hours/mo
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Guaranteed 4-Hour Critical Incident SLA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Assigned Dedicated Staff Principal Engineer</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bi-weekly architectural & feature release sprints</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full Client Portal: Real-time Expiration & Chat</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Isolated staging branch and preview environments</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sub-second database & query optimization</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="w-full py-3.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Deploy Scale & Performance Tier
          </button>
        </div>

        {/* Tier 3: Enterprise Grid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              High-Velocity Scale
            </div>
            <h3 className="text-2xl font-heading font-extrabold text-slate-900">
              Enterprise Grid
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              For complex multi-tenant ecosystems, high-compliance platforms, or rapid multi-product product development squads.
            </p>

            <div className="pt-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-heading font-extrabold text-slate-900">$15,000</span>
                <span className="text-slate-500 text-xs font-mono">/ month</span>
              </div>
              <div className="text-xs text-indigo-600 font-mono mt-1">
                120 dedicated engineering hours/mo
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-Hour Emergency Incident SLA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated squad (2 Senior Engineers + Architect)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom Cloud SQL / Firestore rule audits</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Weekly sprint planning & sprint reviews</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="w-full py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Select Enterprise Grid
          </button>
        </div>
      </div>

      {/* INTERACTIVE SCOPE & PRICING ESTIMATOR */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            <Sliders className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            Interactive Project Scope Estimator
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
            Configure Your Target Architecture
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Select your project specifications to calculate an instant architectural setup estimate and continuous retainer projection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: System Type */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                1. System Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setProjectType('saas')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    projectType === 'saas'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Cpu className="w-5 h-5 text-indigo-600 mb-2" />
                  <div className="font-bold text-xs text-slate-900">Custom SaaS App</div>
                  <div className="text-[11px] text-slate-500 mt-1">From $18k setup</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProjectType('ecommerce')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    projectType === 'ecommerce'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Layers className="w-5 h-5 text-indigo-600 mb-2" />
                  <div className="font-bold text-xs text-slate-900">Headless Commerce</div>
                  <div className="text-[11px] text-slate-500 mt-1">From $14k setup</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProjectType('marketing')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    projectType === 'marketing'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Zap className="w-5 h-5 text-indigo-600 mb-2" />
                  <div className="font-bold text-xs text-slate-900">Marketing Engine</div>
                  <div className="text-[11px] text-slate-500 mt-1">From $7.5k setup</div>
                </button>
              </div>
            </div>

            {/* Step 2: Advanced Capabilities */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                2. Architectural Capabilities & Modules
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeAuth}
                    onChange={(e) => setIncludeAuth(e.target.checked)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900 block">Email OTP & Role Auth</span>
                    <span className="text-slate-500 text-[11px]">+$2,000 (Session tokens + API proxy)</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeRealtime}
                    onChange={(e) => setIncludeRealtime(e.target.checked)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900 block">Real-Time Firestore Sync</span>
                    <span className="text-slate-500 text-[11px]">+$2,500 (Reactive listeners + security)</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeStripe}
                    onChange={(e) => setIncludeStripe(e.target.checked)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900 block">Stripe Elements Payment</span>
                    <span className="text-slate-500 text-[11px]">+$1,800 (Webhooks + subscription cycle)</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeLighthouseAudit}
                    onChange={(e) => setIncludeLighthouseAudit(e.target.checked)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900 block">99+ Lighthouse Guarantee</span>
                    <span className="text-slate-500 text-[11px]">+$1,200 (Asset budget + strict audits)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 3: Retainer Attachment */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                3. Post-Launch Retainer Alignment
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRetainer('none')}
                  className={`p-2.5 rounded-lg border text-xs font-mono text-center cursor-pointer ${
                    selectedRetainer === 'none' ? 'bg-slate-900 text-white font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  No Retainer ($0)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRetainer('launch')}
                  className={`p-2.5 rounded-lg border text-xs font-mono text-center cursor-pointer ${
                    selectedRetainer === 'launch' ? 'bg-slate-900 text-white font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Launch ($3.5k/mo)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRetainer('scale')}
                  className={`p-2.5 rounded-lg border text-xs font-mono text-center cursor-pointer ${
                    selectedRetainer === 'scale' ? 'bg-indigo-600 text-white font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Scale ($7.5k/mo) ★
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRetainer('enterprise')}
                  className={`p-2.5 rounded-lg border text-xs font-mono text-center cursor-pointer ${
                    selectedRetainer === 'enterprise' ? 'bg-slate-900 text-white font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Enterprise ($15k/mo)
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Summary Card */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Scope Projection
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                Estimate Ready
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Initial Build & Architecture:</span>
                <span className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  ${calculatedSetup.toLocaleString()}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-slate-800 pt-3">
                <span className="text-xs text-slate-400">Ongoing Retainer:</span>
                <span className="text-xl font-heading font-bold text-indigo-400">
                  ${calculatedMonthly.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>• Category: {projectType.toUpperCase()} Stack</div>
              <div>• SLA: {selectedRetainer === 'scale' ? 'Guaranteed 4-Hour Response' : selectedRetainer === 'enterprise' ? '1-Hour Priority SLA' : selectedRetainer === 'launch' ? '24-Hour SLA' : 'Standard Delivery'}</div>
              <div>• Client Portal: Included with real-time tracking</div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Lock In Discovery with NexGrid</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* RETAINER FAQ SECTION */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-6">
        <h3 className="text-2xl font-heading font-extrabold text-slate-900">
          Frequently Asked Questions About Retainers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600">
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-slate-900">
              How do we track remaining retainer hours?
            </h4>
            <p className="leading-relaxed">
              Every client receives login credentials to the <strong>NexGrid Client Portal</strong>. You can see your exact hours allocated vs. hours consumed in real time, along with ticket-by-ticket engineer logs.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-heading font-bold text-slate-900">
              What happens if our contract is approaching expiration?
            </h4>
            <p className="leading-relaxed">
              The Client Portal includes an automated expiration countdown. You can renew your contract with a single click or request scope expansion directly in the portal.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-heading font-bold text-slate-900">
              How does the 4-Hour SLA work?
            </h4>
            <p className="leading-relaxed">
              On the <strong>Scale & Performance Tier</strong>, any Critical or High priority maintenance ticket triggers an automated notification to your designated principal engineer, with triage guaranteed within 4 hours.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-heading font-bold text-slate-900">
              Can unused retainer hours roll over?
            </h4>
            <p className="leading-relaxed">
              Up to 25% of unused hours can roll over into the subsequent monthly cycle, ensuring your engineering budget is never wasted during low-intensity sprints.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
