import React from 'react';
import { NavigationPage } from '../../types';
import { 
  Cpu, 
  Zap, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Code, 
  Workflow, 
  Activity,
  Boxes,
  Lock,
  Compass
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
          Core Capabilities
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">
          Full-Stack Digital Engineering Services
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          NexGrid delivers production-grade web systems built on modern TypeScript architectures. We bridge the gap between high-aesthetic Swiss visual design and resilient enterprise backend infrastructure.
        </p>
      </div>

      {/* SERVICE 1: Custom Web Applications & SaaS */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-mono font-bold">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
            Custom Web Applications & SaaS
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From zero-to-one MVP builds to complex enterprise refactoring, we construct scalable SaaS applications designed for multi-tenant security, real-time collaboration, and high throughput.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Discuss SaaS Architecture →
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              State & Auth Architectures
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Email OTP, OAuth2, RBAC role enforcement, and token persistence built directly into the UI workflow.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Real-Time Synchronization
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reactive live listeners via Firestore and WebSocket streams for multi-user collaboration and instant telemetry.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Multi-Tenant Data Modeling
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict document boundaries, subcollection isolation, and schema validation guaranteeing zero cross-tenant leaks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              API Gateway & Microservices
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clean REST and GraphQL endpoints proxied securely through Node/Express servers to keep all credentials safe.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICE 2: High-Performance Marketing Websites */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-mono font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
            High-Performance Marketing Platforms
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Websites that load under 500ms, rank at the top of technical search results, and guide visitors into verified sales conversions. No sluggish WordPress plugins.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Plan Marketing Redesign →
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              99+ Lighthouse Guarantee
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We engineer directly for green audits across Performance, Accessibility, Best Practices, and SEO.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Sub-50ms Edge Delivery
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Global CDN deployment, intelligent asset compression, and modern AVIF/WebP image pipelines.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Swiss Minimalist Aesthetics
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Crisp typography pairings, strict mathematical spacing grids, and subtle motion micro-interactions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Conversion Architecture
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tested lead generation forms, interactive scope calculators, and zero layout shift upon user interaction.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICE 3: Headless E-Commerce Systems */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-mono font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
            Headless E-Commerce Architectures
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Break free from monolithic store templates. We construct headless commerce layers on top of Shopify Plus, Medusa, or custom Stripe engines for instant checkout and maximum conversion rate.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Discuss Headless Commerce →
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Shopify Storefront API
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete custom frontend freedom with reliable Shopify backend order processing and inventory.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Zero-Friction Checkout Flows
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Integrated Stripe Elements, Apple Pay, Google Pay, and localized multi-currency pricing calculations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Instant Catalog Filtering
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Client-side search and faceted navigation with sub-10ms response times across 20,000+ SKUs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-semibold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              ERP & Inventory Sync
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated webhook integrations keeping fulfillment centers, warehouse stock, and accounting in sync.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICE 4: Continuous Engineering Retainers */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono border border-indigo-500/30">
            Continuous Partnership
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight">
            Scale & Performance Retainer Engagements
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Software does not stop evolving at launch. Our retainers guarantee ongoing sprint capacity, continuous performance monitoring, and an emergency SLA contract managed through our dedicated Client Portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              Guaranteed SLA
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              4-Hour Critical Response
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Immediate triage and engineer assignment for mission-critical production blockers.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              Transparent Tracking
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              Client Portal Access
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Real-time contract expiration countdown, monthly hours consumption progress bar, and ticket ticketing desk.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              Direct Communication
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              Engineer-to-Client Chat
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Direct channel to staff engineers on Telegram and our portal chat with zero bureaucratic intermediaries.
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between flex-wrap gap-4 border-t border-slate-800">
          <div className="text-sm text-slate-400 font-mono">
            Flagship Plan: <strong>Scale & Performance Tier</strong> ($7,500/mo for 50 dedicated hours)
          </div>
          <button
            type="button"
            onClick={() => onNavigate('pricing')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Compare All Retainer Tiers →
          </button>
        </div>
      </section>

      {/* TECHNOLOGY STACK RADAR */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
            The NexGrid Technology Standard
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            We pick battle-tested, high-performance tools that stand the test of time.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="font-heading font-bold text-slate-900 text-base">React 19 & Vite</div>
            <div className="text-xs text-slate-500 font-mono">Sub-second dev HMR</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="font-heading font-bold text-slate-900 text-base">TypeScript (Strict)</div>
            <div className="text-xs text-slate-500 font-mono">100% type coverage</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="font-heading font-bold text-slate-900 text-base">Tailwind CSS v4</div>
            <div className="text-xs text-slate-500 font-mono">Zero runtime CSS</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="font-heading font-bold text-slate-900 text-base">Cloud Firestore & SQL</div>
            <div className="text-xs text-slate-500 font-mono">Durable persistence</div>
          </div>
        </div>
      </section>
    </div>
  );
};
