import React from 'react';
import { NavigationPage } from '../types';
import { 
  Mail, 
  Phone, 
  Send, 
  ArrowUpRight, 
  Shield, 
  Zap, 
  CheckCircle, 
  Terminal,
  Cpu
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center font-mono font-bold text-sm">
                NG
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                NEXGRID DIGITAL SOLUTIONS
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Full-service digital engineering agency specializing in custom SaaS web applications, high-performance marketing engines, and modern headless e-commerce systems.
            </p>
            
            {/* Direct Contact Cluster */}
            <div className="pt-2 space-y-2 text-sm">
              <a 
                href="mailto:nexgriddigital@gmail.com" 
                className="flex items-center text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 mr-2.5 text-indigo-400 shrink-0" />
                <span>nexgriddigital@gmail.com</span>
              </a>
              <a 
                href="tel:+251906697634" 
                className="flex items-center text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 mr-2.5 text-indigo-400 shrink-0" />
                <span>+251 906697634 (Direct / WhatsApp)</span>
              </a>
              <a 
                href="https://t.me/NexGridDigital" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 mr-2.5 text-indigo-400 shrink-0" />
                <span>Telegram: @NexGridDigital</span>
                <ArrowUpRight className="w-3 h-3 ml-1 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Solutions & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
              Capabilities
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Custom SaaS & Web Apps
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  High-Performance Marketing
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Headless E-Commerce
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Scale & Performance Retainer
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigate('work')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Interactive Architecture Demos
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
              Platform & Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigate('client-portal')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer text-left flex items-center"
                >
                  <Shield className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  Client Portal
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigate('admin-portal')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer text-left flex items-center"
                >
                  <Terminal className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  Admin Operations Portal
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About & Engineering Standards
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Project Scope Estimator
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Schedule Technical Discovery
                </button>
              </li>
            </ul>
          </div>

          {/* Guarantees / Quality Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
              Quality Commitment
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                <span>99+ Google Lighthouse performance audit baseline</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                <span>100% Type-Safe TypeScript & Zero-Bloat codebases</span>
              </div>
              <div className="flex items-start">
                <Zap className="w-4 h-4 text-indigo-400 mr-2 shrink-0 mt-0.5" />
                <span>4-Hour SLA for Scale & Performance partners</span>
              </div>
              <div className="flex items-start">
                <Cpu className="w-4 h-4 text-indigo-400 mr-2 shrink-0 mt-0.5" />
                <span>Direct engineer-to-client sprint collaboration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & status row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} NexGrid Digital Solutions. All rights reserved.</span>
            <span>•</span>
            <span>Minimalist Swiss Precision Architecture</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              All Systems Operational (Firestore Sync Active)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
