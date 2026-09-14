import React, { useState, useEffect } from 'react';
import { 
  UserSession, 
  Contract, 
  MaintenanceRequest, 
  ChatMessage, 
  MaintenanceCategory, 
  MaintenancePriority 
} from '../../types';
import { 
  db, 
  INITIAL_CONTRACTS, 
  INITIAL_TICKETS, 
  INITIAL_MESSAGES 
} from '../../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  getDocs,
  setDoc
} from 'firebase/firestore';
import { 
  Clock, 
  ShieldCheck, 
  Plus, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Check, 
  ArrowRight, 
  Terminal, 
  Layers, 
  Cpu, 
  FileText, 
  Sparkles,
  RefreshCw,
  User
} from 'lucide-react';

interface ClientPortalProps {
  user: UserSession;
  onNavigateToAdmin: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  user,
  onNavigateToAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'contract' | 'maintenance' | 'chat'>('contract');

  // Contract State
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);

  // Resilient contract determination for the authenticated client
  const fallbackContract: Contract = {
    id: user.contractId || `contract-${user.id}`,
    clientName: user.name || 'Client Lead',
    clientEmail: user.email,
    company: user.company || 'Client Partner Organization',
    tier: 'Scale & Performance',
    monthlyFee: 7500,
    startDate: new Date().toISOString().split('T')[0],
    expirationDate: '2026-12-31',
    daysRemaining: 90,
    status: 'active',
    hoursAllocated: 50,
    hoursUsed: 0,
    slaHours: 4,
    scopeItems: [
      'Dedicated engineering capacity & technical leadership',
      'Continuous performance auditing & Web Vitals optimization',
      'Guaranteed 4-Hour SLA priority response & rapid incident triage'
    ],
    dedicatedEngineer: 'NexGrid Lead Staff Engineer',
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  const currentContract = contracts.find(c => 
    (c.clientEmail && c.clientEmail.toLowerCase() === user.email.toLowerCase()) || 
    (user.contractId && c.id === user.contractId)
  ) || fallbackContract;

  // Maintenance Tickets State
  const [tickets, setTickets] = useState<MaintenanceRequest[]>(INITIAL_TICKETS);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketCategory, setTicketCategory] = useState<MaintenanceCategory>('Feature Update');
  const [ticketPriority, setTicketPriority] = useState<MaintenancePriority>('medium');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [newChatText, setNewChatText] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Expiration Countdown calculation
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: currentContract.daysRemaining || 30,
    hours: 14,
    minutes: 32,
    seconds: 10
  });

  // Calculate live countdown safely
  useEffect(() => {
    const expDateStr = currentContract.expirationDate || '2026-12-31';
    const targetDate = new Date(expDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentContract.expirationDate]);


  // Firestore Real-time Listeners
  useEffect(() => {
    let unsubscribeTickets = () => {};
    let unsubscribeMessages = () => {};
    let unsubscribeContracts = () => {};

    try {
      // Listen to maintenance requests
      const ticketsRef = collection(db, 'maintenance_requests');
      unsubscribeTickets = onSnapshot(ticketsRef, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: MaintenanceRequest[] = [];
          snapshot.forEach((d) => {
            loaded.push({ id: d.id, ...d.data() } as MaintenanceRequest);
          });
          // Sort latest first
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setTickets(loaded);
        }
      }, (err) => {
        console.warn('Tickets snapshot warning (using local fallback):', err);
      });

      // Listen to messages
      const msgsRef = collection(db, 'messages');
      unsubscribeMessages = onSnapshot(msgsRef, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: ChatMessage[] = [];
          snapshot.forEach((d) => {
            loaded.push({ id: d.id, ...d.data() } as ChatMessage);
          });
          loaded.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setMessages(loaded);
        }
      }, (err) => {
        console.warn('Messages snapshot warning:', err);
      });

      // Listen to contracts
      const contractsRef = collection(db, 'contracts');
      unsubscribeContracts = onSnapshot(contractsRef, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Contract[] = [];
          snapshot.forEach((d) => {
            loaded.push({ id: d.id, ...d.data() } as Contract);
          });
          setContracts(loaded);
        }
      }, (err) => {
        console.warn('Contracts snapshot warning:', err);
      });
    } catch (e) {
      console.warn('Firestore initialization fallback:', e);
    }

    return () => {
      unsubscribeTickets();
      unsubscribeMessages();
      unsubscribeContracts();
    };
  }, []);

  // Handle Maintenance Ticket Submission
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDescription.trim()) return;

    setSubmittingTicket(true);
    const newReq: MaintenanceRequest = {
      id: `req-${Date.now()}`,
      clientEmail: user.email,
      clientCompany: user.company || currentContract.company,
      title: ticketTitle.trim(),
      description: ticketDescription.trim(),
      category: ticketCategory,
      priority: ticketPriority,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminNotes: 'Queued for NexGrid triage. SLA clock initiated.',
      assignedEngineer: 'Alex Mercer (Lead Staff)'
    };

    try {
      await setDoc(doc(db, 'maintenance_requests', newReq.id), newReq);
      setTickets(prev => [newReq, ...prev]);
      setTicketSuccessMsg('Maintenance request successfully dispatched to NexGrid engineering.');
      setTicketTitle('');
      setTicketDescription('');
      setIsSubmitModalOpen(false);
      setTimeout(() => setTicketSuccessMsg(null), 5000);
    } catch (err) {
      console.error('Failed to submit ticket to Firestore:', err);
      // Fallback local update
      setTickets(prev => [newReq, ...prev]);
      setIsSubmitModalOpen(false);
      setTicketSuccessMsg('Maintenance request recorded locally.');
      setTimeout(() => setTicketSuccessMsg(null), 5000);
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Handle Chat Send
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    setSendingChat(true);
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: `${user.name} (${user.company || 'Client'})`,
      senderRole: 'client',
      clientEmail: user.email,
      clientCompany: user.company || currentContract.company,
      content: newChatText.trim(),
      timestamp: new Date().toISOString(),
      readByAdmin: false,
      readByClient: true
    };

    try {
      await setDoc(doc(db, 'messages', msg.id), msg);
      setMessages(prev => [...prev, msg]);
      setNewChatText('');
    } catch (err) {
      console.error('Failed to send chat to Firestore:', err);
      setMessages(prev => [...prev, msg]);
      setNewChatText('');
    } finally {
      setSendingChat(false);
    }
  };

  // Filter tickets strictly relevant to this provisioned client
  const clientTickets = tickets.filter(t => 
    (t.clientEmail && t.clientEmail.toLowerCase() === user.email.toLowerCase()) ||
    (t.clientCompany && currentContract.company && t.clientCompany.toLowerCase() === currentContract.company.toLowerCase())
  );


  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                Active Client Portal
              </span>
              <span className="text-xs font-mono text-slate-500">
                Contract ID: {currentContract.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              {currentContract.company}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Primary Partner: <strong className="text-slate-800">{user.name}</strong> ({user.email}) • Tier: <span className="font-semibold text-indigo-600">{currentContract.tier}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onNavigateToAdmin}
              className="inline-flex items-center px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap"
              title="Open the Admin Operations view to simulate responding as NexGrid Ops"
            >
              <Terminal className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              Switch to Admin Portal
            </button>

            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Maintenance Request
            </button>
          </div>
        </div>

        {ticketSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-between text-sm animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{ticketSuccessMsg}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-white px-6 rounded-t-xl">
          <button
            type="button"
            onClick={() => setActiveTab('contract')}
            className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'contract'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Contract & SLA Expiration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Maintenance & Feature Requests</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 font-mono">
              {clientTickets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Chat with NexGrid Ops</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>
        </div>

        {/* TAB 1: CONTRACT & EXPIRATION TRACKER */}
        {activeTab === 'contract' && (
          <div className="space-y-6">
            {/* Live Expiration Countdown Hero Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-b-xl rounded-t-none p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono border border-indigo-500/30">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                    Contract Status: {currentContract.status === 'active' ? 'Active & Healthy' : 'Expiring Soon'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
                    {currentContract.tier} Retainer Agreement
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Your continuous engineering retainers guarantee reserved sprint hours, dedicated principal architect oversight, and prioritized 4-hour SLA incident resolution.
                  </p>
                </div>

                {/* Expiration Countdown Clock */}
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 shrink-0 shadow-inner">
                  <div className="text-[11px] uppercase tracking-wider font-mono text-slate-400 mb-3 flex items-center justify-between">
                    <span>Time Until Contract Expiry</span>
                    <span className="text-indigo-400 font-semibold">{currentContract.expirationDate}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-lg min-w-[64px]">
                      <div className="text-2xl font-bold text-white tracking-tight">{countdown.days}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Days</div>
                    </div>
                    <div className="bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-lg min-w-[64px]">
                      <div className="text-2xl font-bold text-white tracking-tight">{countdown.hours}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Hours</div>
                    </div>
                    <div className="bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-lg min-w-[64px]">
                      <div className="text-2xl font-bold text-white tracking-tight">{countdown.minutes}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Mins</div>
                    </div>
                    <div className="bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-lg min-w-[64px]">
                      <div className="text-2xl font-bold text-indigo-400 tracking-tight">{countdown.seconds}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Secs</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Monthly Rate: ${currentContract.monthlyFee.toLocaleString()}/mo</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('chat');
                        setNewChatText('Hello NexGrid team, we would like to renew our Scale & Performance contract for another 12-month period.');
                      }}
                      className="text-xs text-indigo-300 hover:text-white font-semibold underline cursor-pointer"
                    >
                      Request Contract Extension
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Contract Metrics Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metric 1: Monthly Hours Consumption */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
                    Sprint Hours Quota
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                    Cycle Reset: 1st of Month
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {currentContract.hoursUsed}
                  </span>
                  <span className="text-slate-500 text-sm">
                    / {currentContract.hoursAllocated} hrs used
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (currentContract.hoursUsed / currentContract.hoursAllocated) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {currentContract.hoursAllocated - currentContract.hoursUsed} reserved engineering hours remaining this sprint cycle.
                </p>
              </div>

              {/* Metric 2: SLA Response Time */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
                    SLA Guarantee
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Guaranteed
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-heading font-extrabold text-emerald-600">
                    &lt; {currentContract.slaHours} Hours
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Critical incident triage and emergency fix deployment timeline. 24/7 automated uptime monitoring active.
                </p>
              </div>

              {/* Metric 3: Assigned Squad */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
                    Assigned Architect
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Lead Staff
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center font-mono text-sm">
                    AM
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {currentContract.dedicatedEngineer}
                    </div>
                    <div className="text-xs text-slate-500">
                      Direct Telegram & Portal Sync
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope Items Included in Contract */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-heading font-bold text-base text-slate-900 mb-4 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-indigo-600" />
                Active Scope of Work & Deliverables
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentContract.scopeItems.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MAINTENANCE REQUESTS DESK */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Maintenance & Feature Tickets
                </h3>
                <p className="text-xs text-slate-500">
                  Track progress, assign priorities, and review engineering audit notes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Submit New Request
              </button>
            </div>

            {clientTickets.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-heading font-bold text-slate-800">No active maintenance requests</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Everything is running smoothly! Submit a ticket whenever you need an optimization, bug patch, or feature sprint.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {clientTickets.map((ticket) => {
                  const statusColors = {
                    submitted: 'bg-amber-50 text-amber-700 border-amber-200',
                    accepted: 'bg-blue-50 text-blue-700 border-blue-200',
                    in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    declined: 'bg-rose-50 text-rose-700 border-rose-200'
                  };

                  const priorityColors = {
                    low: 'text-slate-500 bg-slate-100',
                    medium: 'text-blue-700 bg-blue-100',
                    high: 'text-amber-700 bg-amber-100',
                    critical: 'text-rose-700 bg-rose-100 font-bold'
                  };

                  return (
                    <div 
                      key={ticket.id} 
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 hover:border-indigo-200 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-semibold text-slate-400">
                            #{ticket.id}
                          </span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${statusColors[ticket.status]}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className={`text-[11px] px-2 py-0.5 rounded font-mono uppercase ${priorityColors[ticket.priority]}`}>
                            {ticket.priority} priority
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-heading font-bold text-base text-slate-900">
                          {ticket.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                          {ticket.description}
                        </p>
                      </div>

                      {/* Admin/Engineer Notes Box */}
                      {ticket.adminNotes && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-start space-x-2">
                          <Terminal className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-900 font-mono">NexGrid Engineering Update:</span>{' '}
                            <span>{ticket.adminNotes}</span>
                            {ticket.assignedEngineer && (
                              <span className="block mt-1 text-slate-500 font-mono text-[11px]">
                                Assigned to: {ticket.assignedEngineer} {ticket.estimatedHours ? `(${ticket.estimatedHours} hrs estimated)` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE CHAT WITH NEXGRID ADMIINS */}
        {activeTab === 'chat' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
            {/* Chat Top Banner */}
            <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-mono text-xs font-bold">
                  NG
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm tracking-tight">
                    NexGrid Operations Desk
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                    Direct engineering chat for {user.company || 'Acme Systems'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="text-xs text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 font-mono transition-colors cursor-pointer"
              >
                Switch to Admin view to reply
              </button>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg) => {
                const isMe = msg.senderRole === 'client';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-mono mb-1">
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div 
                      className={`max-w-md sm:max-w-lg rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
              <input
                type="text"
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                placeholder="Type your message to NexGrid principal engineers..."
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="submit"
                disabled={sendingChat || !newChatText.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: SUBMIT NEW MAINTENANCE REQUEST */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-heading font-bold text-sm">
                  Submit Maintenance / Feature Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-700 mb-1">
                  Request Title *
                </label>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="e.g. Optimize checkout speed for mobile browsers"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as MaintenanceCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans"
                  >
                    <option value="Feature Update">Feature Update</option>
                    <option value="Bug Fix">Bug Fix</option>
                    <option value="Performance Optimization">Performance Optimization</option>
                    <option value="Security Patch">Security Patch</option>
                    <option value="Emergency Down">Emergency Down</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as MaintenancePriority)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans"
                  >
                    <option value="low">Low (Next cycle)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="high">High (Sprint priority)</option>
                    <option value="critical">Critical (Immediate 4h SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-700 mb-1">
                  Detailed Scope / Requirements *
                </label>
                <textarea
                  rows={4}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Describe the desired behavior, current bug logs, or acceptance criteria..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  {submittingTicket ? 'Submitting to Firestore...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
