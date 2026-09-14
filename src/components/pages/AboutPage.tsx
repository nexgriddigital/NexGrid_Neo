import React from 'react';
import { NavigationPage } from '../../types';
import { 
  ShieldCheck, 
  Terminal, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Phone, 
  Send,
  Compass,
  Code,
  Layers
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
          Agency Ethos & Pedigree
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">
          Engineered with Zero Compromises
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          NexGrid Digital Solutions was founded on a simple premise: modern businesses deserve robust, resilient web architectures without the bloat, delayed handoffs, or technical debt typical of traditional creative agencies.
        </p>
      </div>

      {/* THREE CORE PRINCIPLES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono font-bold">
            01
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900">
            Swiss Structural Precision
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            We adhere to the timeless Swiss design tradition: deliberate typography pairings, disciplined white space, and mathematical layout rhythms that prioritize user comprehension over arbitrary decoration.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono font-bold">
            02
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900">
            Zero Tolerance for Bloat
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            We reject oversized component libraries and opaque frameworks. Every module is tailored, tree-shaken, and optimized to guarantee sub-second page loads and 99+ Lighthouse metrics.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono font-bold">
            03
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900">
            Accountable Partnerships
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            With our real-time <strong>Client Portal</strong> and <strong>Admin Operations Desk</strong>, clients have 24/7 visibility into their contract status, remaining hours, and engineer response times.
          </p>
        </div>
      </div>

      {/* LEADERSHIP & DIRECT ACCESS */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Engineering Team
          </span>
          <h2 className="text-3xl font-heading font-extrabold tracking-tight">
            Direct Access to Senior Leadership
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            When you engage NexGrid, you work directly with principal staff engineers who take personal ownership of your code, security rules, and business outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-heading font-extrabold text-white text-lg">
                AM
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-base">Alex Mercer</h4>
                <p className="text-xs text-indigo-300 font-mono">Principal Systems Architect & Partner</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-2">
              Specialist in full-stack TypeScript, distributed databases, real-time Firestore pipelines, and headless e-commerce architectures.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-heading font-extrabold text-white text-lg">
                NG
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-base">NexGrid Operations Core</h4>
                <p className="text-xs text-emerald-300 font-mono">Site Reliability & SLA Ops</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-2">
              Managing 24/7 incident triage, guaranteed 4-hour SLAs on our Scale & Performance retainers, and staging continuous deployment environments.
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between flex-wrap gap-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-mono">
            Direct Line: <strong>+251 906697634</strong> • Email: <strong>nexgriddigital@gmail.com</strong>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Start a Conversation →
          </button>
        </div>
      </section>
    </div>
  );
};
