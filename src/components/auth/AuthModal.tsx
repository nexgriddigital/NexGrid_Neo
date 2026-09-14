import React, { useState } from 'react';
import { UserSession, MASTER_ADMIN_EMAIL, ADMIN_USER_SESSION } from '../../types';
import { getProvisionedClientsFirestore } from '../../lib/firebase';
import { 
  X, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  Lock,
  FileText,
  ShieldAlert
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: UserSession) => void;
  onAuthSuccess?: (user: UserSession) => void;
  defaultEmail?: string;
  onNavigateContact?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onAuthSuccess,
  defaultEmail = MASTER_ADMIN_EMAIL,
  onNavigateContact
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'client' | 'onboard'>('admin');
  
  // Admin form state
  const [adminEmail, setAdminEmail] = useState(MASTER_ADMIN_EMAIL);
  const [adminPassword, setAdminPassword] = useState('');
  
  // Client form state
  const [clientEmail, setClientEmail] = useState('');
  const [clientAccessKey, setClientAccessKey] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const notifySuccess = (authenticatedUser: UserSession) => {
    try {
      localStorage.setItem('nexgrid_user_session', JSON.stringify(authenticatedUser));
    } catch (err) {
      console.warn('Could not store session in localStorage:', err);
    }

    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(authenticatedUser);
    }
    if (typeof onAuthSuccess === 'function') {
      onAuthSuccess(authenticatedUser);
    }
    onClose();
  };

  // Handle Administrator Login
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = adminEmail.trim().toLowerCase();
    if (cleanEmail !== MASTER_ADMIN_EMAIL) {
      setError(`Access Restricted: Only the primary administrator (${MASTER_ADMIN_EMAIL}) can access the Operations Portal.`);
      return;
    }

    if (!adminPassword) {
      setError('Please enter your administrator password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: adminPassword })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg('Administrator verified. Loading master operations dashboard...');
        setTimeout(() => {
          notifySuccess(data.user);
        }, 500);
        return;
      }
    } catch {
      // Static host fallback (e.g. GitHub Pages without Node.js backend)
    }

    // Static host or direct credential validation
    if (cleanEmail === MASTER_ADMIN_EMAIL && adminPassword === 'NexGrid@2026!Admin') {
      setSuccessMsg('Administrator verified. Loading master operations dashboard...');
      setTimeout(() => {
        notifySuccess(ADMIN_USER_SESSION);
      }, 500);
      return;
    }

    setError('Invalid administrator credentials. Please check your password.');
    setLoading(false);
  };

  // Handle Client Access Key Login
  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = clientEmail.trim().toLowerCase();
    const cleanKey = clientAccessKey.trim().toUpperCase();

    if (!cleanEmail || !cleanKey) {
      setError('Please provide your authorized business email and issued Access Key.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/client-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, accessKey: cleanKey })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`Welcome, ${data.user.name}. Loading your retainer portal...`);
        setTimeout(() => {
          notifySuccess(data.user);
        }, 500);
        return;
      }
    } catch {
      // Static host fallback (e.g. GitHub Pages without Node.js backend)
    }

    // Direct verification from Firestore for static hosting environments
    try {
      const clients = await getProvisionedClientsFirestore();
      const matched = clients.find(c => 
        c.email.toLowerCase() === cleanEmail && 
        c.accessKey.toUpperCase() === cleanKey &&
        c.status === 'active'
      );

      if (matched) {
        const clientUser: UserSession = {
          id: matched.id,
          email: matched.email,
          name: matched.name,
          role: 'client',
          company: matched.company,
          contractId: matched.contractId
        };
        setSuccessMsg(`Welcome, ${matched.name}. Loading your retainer portal...`);
        setTimeout(() => {
          notifySuccess(clientUser);
        }, 500);
        return;
      } else {
        throw new Error('Access Denied: This account has not been provisioned by the NexGrid Administrator, or the Access Key is invalid.');
      }
    } catch (fsErr: any) {
      setError(fsErr.message || 'Access Denied: Account not provisioned.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-white shadow-sm">
              NG
            </div>
            <div>
              <h3 className="font-heading font-bold text-base tracking-tight text-white flex items-center">
                NexGrid Secure Access
                <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Encrypted Retainer Infrastructure
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setError(null); }}
            className={`py-3 px-2 text-center transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'admin' 
                ? 'bg-white text-indigo-700 border-b-2 border-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            <span className="whitespace-nowrap">Admin Portal</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab('client'); setError(null); }}
            className={`py-3 px-2 text-center transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'client' 
                ? 'bg-white text-indigo-700 border-b-2 border-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
            <span className="whitespace-nowrap">Client Login</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('onboard'); setError(null); }}
            className={`py-3 px-2 text-center transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'onboard' 
                ? 'bg-white text-indigo-700 border-b-2 border-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="whitespace-nowrap">Get Access</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-start space-x-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1 leading-relaxed">
                <span className="font-semibold">Security Notice: </span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-start space-x-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <p className="flex-1 font-semibold">{successMsg}</p>
            </div>
          )}

          {/* TAB 1: MASTER ADMIN LOGIN */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                <div className="flex items-center space-x-1.5 font-semibold text-slate-900 mb-0.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Exclusive Administrator Sign-In</span>
                </div>
                <p className="text-slate-600">
                  Access is strictly authorized for <strong className="text-slate-900">{MASTER_ADMIN_EMAIL}</strong>.
                </p>
              </div>

              <div>
                <label htmlFor="admin-email" className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-700 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    id="admin-email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-pass" className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-700 mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    id="admin-pass"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter administrator password"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Default credentials configured for NexGrid operations.
                </p>
              </div>

              <button
                type="submit"
                id="admin-login-btn"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Authority...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Admin Operations</span>
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: PROVISIONED CLIENT LOGIN */}
          {activeTab === 'client' && (
            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-950">
                <div className="flex items-center space-x-1.5 font-semibold text-indigo-900 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Provisioned Client Access</span>
                </div>
                <p className="text-slate-600">
                  Enter your business email and the Access Key issued by the NexGrid Administrator.
                </p>
              </div>

              <div>
                <label htmlFor="client-email" className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-700 mb-1.5">
                  Authorized Business Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    id="client-email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="partner@yourcompany.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="client-key" className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-700 mb-1.5">
                  Issued Access Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    id="client-key"
                    type="text"
                    value={clientAccessKey}
                    onChange={(e) => setClientAccessKey(e.target.value)}
                    placeholder="NXG-XXXX-XXXX"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-mono tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Obtained during contract signing or retainer initiation.
                </p>
              </div>

              <button
                type="submit"
                id="client-login-btn"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Access Key...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Client Retainer Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: PROSPECTIVE CLIENT / GET ACCESS */}
          {activeTab === 'onboard' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  <span>Invite-Only Retainer Provisioning</span>
                </div>
                <p className="leading-relaxed">
                  NexGrid Digital Solutions maintains a strict capacity limit of concurrent engineering retainers to guarantee our dedicated 4-hour SLA commitments.
                </p>
                <p className="leading-relaxed">
                  All new accounts must be formally reviewed and provisioned by our Operations Lead (<strong className="text-slate-900">{MASTER_ADMIN_EMAIL}</strong>).
                </p>
              </div>

              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs space-y-1 text-indigo-900">
                <div className="font-semibold flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                  How to receive client credentials:
                </div>
                <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-1 pt-1">
                  <li>Submit your project discovery inquiry or reach out directly.</li>
                  <li>Our lead architect conducts a code & architecture triage.</li>
                  <li>Your customized SLA contract and secure Access Key are issued.</li>
                </ol>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onNavigateContact) onNavigateContact();
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Request Retainer Onboarding</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </button>
            </div>
          )}

          {/* Footer security badge */}
          <div className="pt-3 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
            <span>Direct Admin Contact:</span>
            <a href="mailto:nexgriddigital@gmail.com" className="text-indigo-600 font-mono hover:underline cursor-pointer">
              nexgriddigital@gmail.com
            </a>
            <span>•</span>
            <a href="tel:+251906697634" className="text-indigo-600 font-mono hover:underline cursor-pointer">
              +251 906697634
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
