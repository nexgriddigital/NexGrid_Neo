import React from 'react';
import { NavigationPage } from '../../types';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Cpu, 
  Layers, 
  Gauge, 
  Clock, 
  Mail, 
  Phone, 
  Send,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenPortal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenPortal
}) => {
  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION - Swiss Minimalist Architectural Layout */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-8 border-b border-slate-200 swiss-grid-pattern bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Top subtle status ticker */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-mono text-indigo-700 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold">NEXGRID DIGITAL SOLUTIONS</span>
            <span className="text-slate-400">•</span>
            <span>Q3/Q4 Sprint Capacity Open</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-slate-900 tracking-tight leading-[1.08]">
                Precision Engineering for{' '}
                <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">
                  High-Performance
                </span>{' '}
                Digital Systems.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-body leading-relaxed max-w-2xl">
                NexGrid builds mission-critical <strong>custom SaaS applications</strong>, <strong>sub-second marketing engines</strong>, and <strong>headless e-commerce architectures</strong>. Powered by strict TypeScript, modern cloud databases, and dedicated monthly retainers.
              </p>

              {/* Action Cluster */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  id="hero-start-project-btn"
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Start a Technical Discovery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="hero-explore-work-btn"
                  onClick={() => onNavigate('work')}
                  className="px-6 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>Interactive Architecture Demos</span>
                </button>

                <button
                  type="button"
                  id="hero-open-portal-btn"
                  onClick={onOpenPortal}
                  className="px-4 py-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap border border-slate-200"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Client / Admin Portal</span>
                </button>
              </div>

              {/* Verified Quality Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200">
                <div className="space-y-1">
                  <div className="text-2xl font-heading font-extrabold text-slate-900 flex items-center">
                    99+
                    <Gauge className="w-4 h-4 text-emerald-600 ml-1.5" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">Lighthouse Audit</div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-heading font-extrabold text-slate-900 flex items-center">
                    100%
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-1.5" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">Type-Safe Stack</div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-heading font-extrabold text-slate-900 flex items-center">
                    &lt; 4h
                    <Clock className="w-4 h-4 text-emerald-600 ml-1.5" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">Critical SLA</div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-heading font-extrabold text-slate-900 flex items-center">
                    0%
                    <Zap className="w-4 h-4 text-indigo-600 ml-1.5" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">Vendor Lock-In</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Architectural System Terminal */}
            <div className="lg:col-span-4">
              <div className="bg-slate-950 text-slate-300 rounded-xl p-6 border border-slate-800 shadow-2xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-widest">
                    nexgrid-runtime.sys
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-indigo-400">
                    $ nexgrid deploy --cluster=production --strict-audit
                  </div>
                  <div className="text-slate-400">
                    ✔ TypeScript Engine: 0 type errors
                  </div>
                  <div className="text-slate-400">
                    ✔ Bundle Size: 41.2 kB (tree-shaken)
                  </div>
                  <div className="text-slate-400">
                    ✔ Firestore Security: 100% rule coverage
                  </div>
                  <div className="text-emerald-400">
                    ✔ Lighthouse Score: Performance 99 | A11y 100
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-300">
                    <div className="text-white font-bold mb-1">
                      Flagship Retainer Active:
                    </div>
                    <div>Plan: Scale & Performance Tier</div>
                    <div>SLA: Guaranteed 4-Hour Response</div>
                    <div>Assigned: Lead Staff Engineer</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-center font-bold text-xs transition-colors cursor-pointer"
                >
                  Explore Retainer Plans ($7,500/mo) →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE CORE PILLARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            Agency Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Engineered to Solve Complex Business Challenges
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            We avoid generic templates and slow CMS bloat. Every system is purpose-crafted for raw speed, high conversion, and seamless scalability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-5 hover:border-indigo-300 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-mono font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Custom Web Apps & SaaS
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Full-stack web applications, microfrontends, real-time dashboards, multi-tenant databases, and modern API orchestration designed for high concurrency.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>React 19, TypeScript & Vite frontend</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Real-time Firestore & Cloud SQL backends</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Email OTP & OAuth role-based security</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-5 hover:border-indigo-300 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-mono font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-xl text-slate-900">
                High-Performance Marketing Sites
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sub-second marketing platforms that turn traffic into qualified pipeline. Optimized for Core Web Vitals, technical SEO, and conversion friction elimination.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>99+ Google Lighthouse performance score</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Sub-50ms Time to First Byte (TTFB)</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Tailored Swiss typography & motion design</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-5 hover:border-indigo-300 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-mono font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Headless E-Commerce Systems
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Next-generation commerce architectures decoupling checkout from presentation. Built for instantaneous page loads, frictionless checkout, and high average order values.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Shopify Headless Storefront API & Medusa</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Instantaneous cart calculation & Stripe Elements</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Global edge CDN caching with zero lag</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURED FLAGSHIP RETAINER: SCALE & PERFORMANCE TIER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono border border-indigo-500/40">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              Flagship Retainer Architecture
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight">
              Scale & Performance Tier ($7,500 / month)
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Designed for scaling organizations that require continuous engineering horsepower without the overhead of hiring an in-house squad. Includes <strong>50 engineering hours/mo</strong>, <strong>guaranteed 4-hour critical SLA</strong>, dedicated staging branches, and direct real-time communication via the NexGrid Client Portal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>50 Dedicated Engineering Hours per month</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Guaranteed 4-Hour Response SLA</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live Contract Expiration & Ticket Tracker</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Chat with Principal Engineers</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('pricing')}
                className="px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Review Full Retainer Details
              </button>
              <button
                type="button"
                onClick={onOpenPortal}
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
              >
                Inspect Live Client Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDING PARTNER & DIRECT REACH BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">
              Direct Access to Leadership
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              Work Directly with Principal Engineers.
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              No account managers, no junior hand-offs, and no bureaucratic friction. At NexGrid, you collaborate directly with senior architects who write the code, inspect the database schemas, and safeguard your uptime.
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="text-xs font-mono font-semibold uppercase text-slate-500">
              Immediate Contact Channels
            </div>

            <div className="space-y-3 text-sm">
              <a 
                href="mailto:nexgriddigital@gmail.com" 
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600">Email NexGrid</div>
                    <div className="text-xs text-slate-500 font-mono">nexgriddigital@gmail.com</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </a>

              <a 
                href="tel:+251906697634" 
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-emerald-600">Direct Call / WhatsApp</div>
                    <div className="text-xs text-slate-500 font-mono">+251 906697634</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </a>

              <a 
                href="https://t.me/NexGridDigital" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Send className="w-5 h-5 text-indigo-500" />
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600">Telegram Direct</div>
                    <div className="text-xs text-slate-500 font-mono">@NexGridDigital</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
