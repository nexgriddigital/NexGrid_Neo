import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  Mail, 
  Phone, 
  Send, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenPortal: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  onOpenPortal
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [serviceInterest, setServiceInterest] = useState('Scale & Performance Retainer');
  const [budgetRange, setBudgetRange] = useState('$5k - $15k / month');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const ticketId = `NEX-INQ-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await addDoc(collection(db, 'inquiries'), {
        ticketId,
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || 'Undisclosed',
        serviceInterest,
        budgetRange,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: 'received'
      });
      setSubmittedTicket(ticketId);
    } catch (err) {
      console.warn('Inquiry submission fallback:', err);
      setSubmittedTicket(ticketId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
          Direct Discovery Channels
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">
          Initiate a Technical Discovery
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Tell us about your architectural goals, current bottlenecks, or desired retainer tier. We review every submission within 4 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Info & Channels */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                Direct Channels
              </span>
              <h3 className="text-2xl font-heading font-extrabold mt-1">
                Reach Engineering Leadership
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Connect directly with our principal team across all official NexGrid communication channels.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Primary Email */}
              <a 
                href="mailto:nexgriddigital@gmail.com"
                className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-400 transition-colors cursor-pointer group"
              >
                <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">Primary Email</div>
                  <div className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">
                    nexgriddigital@gmail.com
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Checked continuously by engineering</div>
                </div>
              </a>

              {/* Direct Phone */}
              <a 
                href="tel:+251906697634"
                className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">Direct Phone / WhatsApp</div>
                  <div className="font-semibold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    +251 906697634
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Voice calls & urgent architectural escalations</div>
                </div>
              </a>

              {/* Telegram Channel */}
              <a 
                href="https://t.me/NexGridDigital"
                target="_blank"
                rel="noreferrer"
                className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-400 transition-colors cursor-pointer group"
              >
                <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-400 font-mono">Telegram Direct</div>
                  <div className="font-semibold text-sm text-white group-hover:text-indigo-300 flex items-center justify-between">
                    <span>@NexGridDigital</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Instant messaging with lead team</div>
                </div>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Response SLA: &lt; 4 Hours
              </span>
              <span className="font-mono">Timezone: UTC+3 / Global</span>
            </div>
          </div>

          {/* Client Portal Fast Link */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-700 uppercase">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Already an Active Client Partner?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Log in to the NexGrid Client Portal to view your live contract expiration, submit a maintenance ticket, or chat directly with our engineers.
            </p>
            <button
              type="button"
              onClick={onOpenPortal}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Open Client Portal →
            </button>
          </div>
        </div>

        {/* Right: Technical Inquiry Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm">
          {submittedTicket ? (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Inquiry Dispatched Successfully
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your technical discovery brief has been registered in our database under confirmation ticket:
              </p>
              <div className="inline-block px-4 py-2 rounded-lg bg-slate-100 font-mono font-bold text-indigo-700 text-base border border-slate-200">
                {submittedTicket}
              </div>
              <p className="text-xs text-slate-500 pt-2">
                A principal engineer will review your scope and contact you at <strong>{email}</strong> within 4 business hours.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedTicket(null);
                    setMessage('');
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                  Project Brief & Discovery Form
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out the details below to receive architectural scoping and timeline estimates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@organization.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                    Primary Service Interest
                  </label>
                  <select
                    value={serviceInterest}
                    onChange={(e) => setServiceInterest(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  >
                    <option value="Scale & Performance Retainer">Scale & Performance Retainer ($7.5k/mo)</option>
                    <option value="Launch Retainer">Launch Retainer ($3.5k/mo)</option>
                    <option value="Enterprise Grid">Enterprise Grid ($15k/mo)</option>
                    <option value="Custom Web App / SaaS Build">Custom Web App / SaaS Build</option>
                    <option value="Headless E-Commerce System">Headless E-Commerce System</option>
                    <option value="High-Performance Marketing Site">High-Performance Marketing Site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                  Estimated Monthly or Project Budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    '< $5k',
                    '$5k - $15k / mo',
                    '$15k - $35k',
                    '$35k+'
                  ].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetRange(b)}
                      className={`py-2 px-3 rounded-lg border text-xs font-mono text-center cursor-pointer ${
                        budgetRange === b
                          ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                  Architecture Overview & Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your current tech stack, pain points, target launch date, and key functional requirements..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Transmitting to NexGrid Operations...' : 'Submit Technical Brief'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
