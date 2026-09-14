import React, { useState, useEffect } from 'react';
import { 
  UserSession, 
  Contract, 
  MaintenanceRequest, 
  ChatMessage, 
  MaintenanceStatus,
  RetainerTier,
  ProvisionedClient,
  MASTER_ADMIN_EMAIL
} from '../../types';
import { 
  db, 
  INITIAL_CONTRACTS, 
  INITIAL_TICKETS, 
  INITIAL_MESSAGES,
  getProvisionedClientsFirestore,
  saveProvisionedClientFirestore,
  revokeProvisionedClientFirestore
} from '../../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  Terminal, 
  ShieldCheck, 
  Users, 
  FileText, 
  MessageSquare, 
  Check, 
  Clock, 
  AlertTriangle, 
  Send, 
  Plus, 
  Search, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight, 
  KeyRound, 
  Copy, 
  Trash2, 
  Lock, 
  ShieldAlert,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface AdminPortalProps {
  user: UserSession;
  onNavigateToClient: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  user,
  onNavigateToClient
}) => {
  const [activeTab, setActiveTab] = useState<'provisioning' | 'contracts' | 'tickets' | 'chat'>('provisioning');

  // Provisioned Clients State
  const [provisionedClients, setProvisionedClients] = useState<ProvisionedClient[]>([]);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [justProvisioned, setJustProvisioned] = useState<ProvisionedClient | null>(null);

  // Form for Provisioning New Client
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTier, setNewTier] = useState<RetainerTier>('Scale & Performance');
  const [newMonthlyFee, setNewMonthlyFee] = useState(7500);
  const [newHoursAllocated, setNewHoursAllocated] = useState(50);
  const [newSlaHours, setNewSlaHours] = useState(4);
  const [customAccessKey, setCustomAccessKey] = useState('');
  const [provisioningLoading, setProvisioningLoading] = useState(false);
  const [provisionError, setProvisionError] = useState<string | null>(null);

  // Contracts state
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [searchContract, setSearchContract] = useState('');

  // Maintenance tickets state
  const [tickets, setTickets] = useState<MaintenanceRequest[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceRequest | null>(null);
  const [engineerNotes, setEngineerNotes] = useState('');
  const [assignedEngineer, setAssignedEngineer] = useState('Alex Mercer (Lead Staff)');
  const [estimatedHours, setEstimatedHours] = useState(4);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [selectedClientEmail, setSelectedClientEmail] = useState<string>('');
  const [adminReplyText, setAdminReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Firestore Real-time synchronization
  useEffect(() => {
    let unsubContracts = () => {};
    let unsubTickets = () => {};
    let unsubMessages = () => {};
    let unsubClients = () => {};

    try {
      // 1. Contracts sync
      unsubContracts = onSnapshot(collection(db, 'contracts'), (snapshot) => {
        const loaded: Contract[] = [];
        snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as Contract));
        setContracts(loaded);
      }, (err) => console.warn('Contracts snapshot notice:', err));

      // 2. Provisioned Clients sync
      unsubClients = onSnapshot(collection(db, 'provisioned_clients'), (snapshot) => {
        const loaded: ProvisionedClient[] = [];
        snapshot.forEach((d) => loaded.push(d.data() as ProvisionedClient));
        setProvisionedClients(loaded);
        if (loaded.length > 0 && !selectedClientEmail) {
          setSelectedClientEmail(loaded[0].email);
        }
      }, (err) => console.warn('Provisioned clients snapshot notice:', err));

      // 3. Tickets sync
      unsubTickets = onSnapshot(collection(db, 'maintenance_requests'), (snapshot) => {
        const loaded: MaintenanceRequest[] = [];
        snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as MaintenanceRequest));
        loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTickets(loaded);
      }, (err) => console.warn('Tickets snapshot notice:', err));

      // 4. Messages sync
      unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
        const loaded: ChatMessage[] = [];
        snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as ChatMessage));
        loaded.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setMessages(loaded);
      }, (err) => console.warn('Messages snapshot notice:', err));
    } catch (e) {
      console.warn('Firestore fallback on admin portal:', e);
    }

    return () => {
      unsubContracts();
      unsubClients();
      unsubTickets();
      unsubMessages();
    };
  }, []);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Provision New Client Action
  const handleProvisionClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisionError(null);

    const email = newClientEmail.trim().toLowerCase();
    const name = newClientName.trim();
    const company = newCompany.trim();

    if (!email || !name || !company) {
      setProvisionError('Client business email, contact name, and company name are required.');
      return;
    }

    setProvisioningLoading(true);

    try {
      const res = await fetch('/api/admin/provision-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: MASTER_ADMIN_EMAIL,
          email,
          name,
          company,
          tier: newTier,
          hoursAllocated: newHoursAllocated,
          slaHours: newSlaHours,
          monthlyFee: newMonthlyFee,
          customAccessKey: customAccessKey.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to provision client account.');
      }

      const client = data.client as ProvisionedClient;

      // Save to Firestore for permanent persistence
      await saveProvisionedClientFirestore(client);

      // Also create their active contract in Firestore
      const now = new Date();
      const expDate = new Date();
      expDate.setDate(now.getDate() + 90); // default 90-day retainer

      const newContract: Contract = {
        id: client.contractId,
        clientName: client.name,
        clientEmail: client.email,
        company: client.company,
        tier: client.tier,
        monthlyFee: client.monthlyFee,
        startDate: now.toISOString().split('T')[0],
        expirationDate: expDate.toISOString().split('T')[0],
        daysRemaining: 90,
        status: 'active',
        hoursAllocated: client.hoursAllocated,
        hoursUsed: 0,
        slaHours: client.slaHours,
        scopeItems: [
          `${client.tier} continuous engineering & architecture sprints`,
          'Scheduled security patching & database performance optimization',
          'Staging branch isolation and preview verification',
          `Guaranteed ${client.slaHours}-hour SLA priority incident triage`
        ],
        dedicatedEngineer: 'Alex Mercer (Principal Engineer)',
        lastUpdated: now.toISOString().split('T')[0]
      };

      await setDoc(doc(db, 'contracts', newContract.id), newContract);

      setJustProvisioned(client);
      setIsProvisionModalOpen(false);
      setNewClientName('');
      setNewClientEmail('');
      setNewCompany('');
      setCustomAccessKey('');
    } catch (err: any) {
      setProvisionError(err.message || 'Error provisioning client account.');
    } finally {
      setProvisioningLoading(false);
    }
  };

  // Revoke Provisioned Client
  const handleRevokeClient = async (clientId: string, clientEmail: string) => {
    if (!window.confirm(`Are you sure you want to revoke access for ${clientEmail}? This will immediately prevent them from logging in.`)) {
      return;
    }

    try {
      await fetch('/api/admin/revoke-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: MASTER_ADMIN_EMAIL,
          clientEmail
        })
      });

      await revokeProvisionedClientFirestore(clientId);
      setProvisionedClients(prev => prev.filter(c => c.id !== clientId));
    } catch (err) {
      console.error('Failed to revoke client:', err);
    }
  };

  // Update Ticket Status
  const handleUpdateTicketStatus = async (ticketId: string, newStatus: MaintenanceStatus) => {
    const updatedTickets = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: newStatus,
          adminNotes: engineerNotes || t.adminNotes,
          assignedEngineer: assignedEngineer || t.assignedEngineer,
          estimatedHours: estimatedHours || t.estimatedHours,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });

    setTickets(updatedTickets);

    try {
      const docRef = doc(db, 'maintenance_requests', ticketId);
      await updateDoc(docRef, {
        status: newStatus,
        adminNotes: engineerNotes || 'Status updated by NexGrid Ops.',
        assignedEngineer,
        estimatedHours,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Firestore ticket update notice:', err);
    }

    setSelectedTicket(null);
    setEngineerNotes('');
  };

  // Send Admin Chat Reply
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedClientEmail) return;

    setSendingReply(true);

    const activeContract = contracts.find(c => c.clientEmail.toLowerCase() === selectedClientEmail.toLowerCase());

    const replyMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: 'Alex Mercer (NexGrid Operations)',
      senderRole: 'admin',
      clientEmail: selectedClientEmail,
      clientCompany: activeContract?.company || 'Client Organization',
      content: adminReplyText.trim(),
      timestamp: new Date().toISOString(),
      readByAdmin: true,
      readByClient: false
    };

    try {
      await setDoc(doc(db, 'messages', replyMsg.id), replyMsg);
      setMessages(prev => [...prev, replyMsg]);
      setAdminReplyText('');
    } catch (err) {
      console.error('Failed to send admin reply:', err);
      setMessages(prev => [...prev, replyMsg]);
      setAdminReplyText('');
    } finally {
      setSendingReply(false);
    }
  };

  // Filtered Contracts
  const filteredContracts = contracts.filter(c => 
    c.company.toLowerCase().includes(searchContract.toLowerCase()) ||
    c.clientName.toLowerCase().includes(searchContract.toLowerCase()) ||
    c.clientEmail.toLowerCase().includes(searchContract.toLowerCase())
  );

  // Group messages for selected client
  const clientConversations: string[] = Array.from(new Set([
    ...provisionedClients.map(c => c.email),
    ...contracts.map(c => c.clientEmail)
  ]));

  const currentChatMessages = messages.filter(m => 
    m.clientEmail?.toLowerCase() === selectedClientEmail.toLowerCase() ||
    (m.senderRole === 'client' && m.clientEmail?.toLowerCase() === selectedClientEmail.toLowerCase())
  );

  // Metrics
  const totalMrr = contracts.reduce((sum, c) => sum + c.monthlyFee, 0);
  const activeContractsCount = contracts.filter(c => c.status === 'active' || c.status === 'expiring_soon').length;
  const pendingTicketsCount = tickets.filter(t => t.status === 'submitted').length;

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-8 font-body">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Operational Bar */}
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Terminal className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                NexGrid Central Operations
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Production Strict Security
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Master Admin Operations Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Authenticated Admin: <strong className="text-white">{MASTER_ADMIN_EMAIL}</strong> • Phone: <strong className="text-white">+251 906697634</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              id="admin-issue-login-btn"
              onClick={() => setIsProvisionModalOpen(true)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <KeyRound className="w-3.5 h-3.5 mr-1.5" />
              Issue New Client Login
            </button>

            <button
              type="button"
              onClick={onNavigateToClient}
              className="inline-flex items-center px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Preview Client Portal
            </button>
          </div>
        </div>

        {/* Banner: Just Provisioned Credentials */}
        {justProvisioned && (
          <div className="p-5 bg-indigo-900 text-white rounded-xl shadow-lg border border-indigo-700 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-heading font-bold text-sm tracking-tight">
                  Client Account Successfully Provisioned & Issued!
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setJustProvisioned(null)}
                className="text-xs text-indigo-300 hover:text-white cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            <p className="text-xs text-indigo-200">
              Provide these credentials to your client partner. They can now immediately log in via the Client Portal.
            </p>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-1">
                <div><span className="text-slate-400">Client:</span> <span className="text-white font-bold">{justProvisioned.name}</span> ({justProvisioned.company})</div>
                <div><span className="text-slate-400">Business Email:</span> <span className="text-emerald-400">{justProvisioned.email}</span></div>
                <div><span className="text-slate-400">Issued Access Key:</span> <span className="text-indigo-400 font-bold tracking-wider">{justProvisioned.accessKey}</span></div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(
                  `NexGrid Client Portal Credentials:\nEmail: ${justProvisioned.email}\nAccess Key: ${justProvisioned.accessKey}\nRetainer Tier: ${justProvisioned.tier}\nPortal Link: ${window.location.origin}`,
                  'just-provisioned'
                )}
                className="inline-flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-sans text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                {copiedKey === 'just-provisioned' ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                    <span>Copied Credentials!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>Copy Full Onboarding Info</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Operational Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
              <span>Provisioned Clients</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
              {provisionedClients.length}
              <span className="text-xs font-normal text-slate-500"> authorized logins</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Strict access keys issued by NexGrid Admin
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
              <span>Retainer MRR</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
              ${totalMrr.toLocaleString()}
              <span className="text-xs font-normal text-slate-500">/month</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {activeContractsCount} active engineering contracts
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
              <span>Pending Maintenance Triage</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-amber-600">
              {pendingTicketsCount}
              <span className="text-xs font-normal text-slate-500"> awaiting review</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {tickets.length} total requests in queue
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-slate-200 bg-white px-6 rounded-t-xl overflow-x-auto">
          <button
            type="button"
            id="tab-provisioning-btn"
            onClick={() => setActiveTab('provisioning')}
            className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'provisioning'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Client Provisioning & Logins</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold">
              {provisionedClients.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-contracts-btn"
            onClick={() => setActiveTab('contracts')}
            className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'contracts'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Active Retainer Contracts</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 font-mono">
              {contracts.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-tickets-btn"
            onClick={() => setActiveTab('tickets')}
            className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'tickets'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Maintenance & Triage Queue</span>
            {pendingTicketsCount > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 font-mono font-bold">
                {pendingTicketsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            id="tab-chat-btn"
            onClick={() => setActiveTab('chat')}
            className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Client Communications</span>
          </button>
        </div>

        {/* TAB 1: CLIENT PROVISIONING & ACCESS KEYS */}
        {activeTab === 'provisioning' && (
          <div className="bg-white border border-slate-200 rounded-b-xl rounded-t-none p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 flex items-center">
                  <KeyRound className="w-4 h-4 text-indigo-600 mr-2" />
                  Client Login Provisioning
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Public registrations are disabled. Only clients explicitly issued an Access Key by <strong className="text-slate-900">{MASTER_ADMIN_EMAIL}</strong> can access the Client Portal.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsProvisionModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Provision New Client
              </button>
            </div>

            {provisionedClients.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-base text-slate-800">
                  No Client Accounts Provisioned Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  All demo clients have been purged. You have exclusive administrator access. Click below to provision your first client partner and generate their unique Access Key.
                </p>
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow transition-all"
                >
                  <KeyRound className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  Issue First Client Access Key
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono tracking-wider text-[11px]">
                      <th className="py-3 px-4">Client Organization</th>
                      <th className="py-3 px-4">Authorized Email</th>
                      <th className="py-3 px-4">Issued Access Key</th>
                      <th className="py-3 px-4">Retainer Tier</th>
                      <th className="py-3 px-4">Fee / SLA</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {provisionedClients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 text-sm">{client.company}</div>
                          <div className="text-slate-500 text-[11px]">{client.name}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {client.email}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1.5">
                            <code className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono font-bold text-indigo-700 text-xs">
                              {client.accessKey}
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopy(client.accessKey, client.id)}
                              className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                              title="Copy Access Key"
                            >
                              {copiedKey === client.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded font-medium text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {client.tier}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          ${client.monthlyFee?.toLocaleString()}/mo • {client.slaHours}h SLA
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                            client.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {client.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedClientEmail(client.email);
                                setActiveTab('chat');
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-900 font-semibold cursor-pointer underline"
                            >
                              Chat
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRevokeClient(client.id, client.email)}
                              className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer p-1"
                              title="Revoke access"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONTRACTS MANAGER */}
        {activeTab === 'contracts' && (
          <div className="bg-white border border-slate-200 rounded-b-xl rounded-t-none p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchContract}
                  onChange={(e) => setSearchContract(e.target.value)}
                  placeholder="Search client, company, or tier..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Showing {filteredContracts.length} of {contracts.length} agreements
              </div>
            </div>

            {filteredContracts.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700">No active contracts found.</p>
                <p className="text-xs text-slate-500">When you provision a client under the Provisioning tab, their contract will automatically appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono tracking-wider text-[11px]">
                      <th className="py-3 px-4">Client / Organization</th>
                      <th className="py-3 px-4">Retainer Tier</th>
                      <th className="py-3 px-4">MRR</th>
                      <th className="py-3 px-4">Hours (Used / Allocated)</th>
                      <th className="py-3 px-4">Expiration Date</th>
                      <th className="py-3 px-4">Days Left</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredContracts.map((contract) => {
                      const isExpiringSoon = contract.daysRemaining <= 20;

                      return (
                        <tr key={contract.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900 text-sm">
                              {contract.company}
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              {contract.clientName} • {contract.clientEmail}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded font-medium text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {contract.tier}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                            ${contract.monthlyFee.toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {contract.hoursUsed} / {contract.hoursAllocated} hrs
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {contract.expirationDate}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                              isExpiringSoon ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {contract.daysRemaining} days
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                              contract.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {contract.status === 'active' ? 'Active' : 'Expiring Soon'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedClientEmail(contract.clientEmail);
                                setActiveTab('chat');
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-900 font-semibold cursor-pointer underline"
                            >
                              Chat
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MAINTENANCE & TRIAGE QUEUE */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Client Maintenance & Scope Triage
                </h3>
                <p className="text-xs text-slate-500">
                  Review incoming client requests, approve work, update progress, and log engineering notes.
                </p>
              </div>
            </div>

            {tickets.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No active tickets in queue.</p>
                <p className="text-xs text-slate-500">When your clients submit maintenance requests, they will arrive here in real-time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tickets List */}
                <div className="lg:col-span-2 space-y-3">
                  {tickets.map((ticket) => {
                    const statusColors = {
                      submitted: 'bg-amber-50 text-amber-700 border-amber-200',
                      accepted: 'bg-blue-50 text-blue-700 border-blue-200',
                      in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      declined: 'bg-rose-50 text-rose-700 border-rose-200'
                    };

                    const isSelected = selectedTicket?.id === ticket.id;

                    return (
                      <div
                        key={ticket.id}
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setEngineerNotes(ticket.adminNotes || '');
                          setAssignedEngineer(ticket.assignedEngineer || 'Alex Mercer');
                          setEstimatedHours(ticket.estimatedHours || 4);
                        }}
                        className={`bg-white border rounded-xl p-5 shadow-sm transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-indigo-600 ring-2 ring-indigo-600/10' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-slate-400">
                              #{ticket.id}
                            </span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold uppercase ${statusColors[ticket.status]}`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs font-semibold text-slate-800">
                              {ticket.clientCompany}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="font-heading font-bold text-sm text-slate-900">
                          {ticket.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {ticket.description}
                        </p>

                        {ticket.adminNotes && (
                          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                            <strong>Latest Ops Note:</strong> {ticket.adminNotes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Action / Inspector Panel */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5 h-fit sticky top-24">
                  {selectedTicket ? (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <div className="text-[11px] font-mono uppercase text-slate-400">
                          Manage Request #{selectedTicket.id}
                        </div>
                        <h4 className="font-heading font-bold text-base text-slate-900 mt-1">
                          {selectedTicket.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          From: {selectedTicket.clientCompany} ({selectedTicket.clientEmail})
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono font-semibold uppercase text-slate-700">
                          Update Status
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['submitted', 'accepted', 'in_progress', 'completed', 'declined'] as MaintenanceStatus[]).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => handleUpdateTicketStatus(selectedTicket.id, status)}
                              className={`py-1.5 px-2 rounded text-xs font-semibold capitalize border transition-all cursor-pointer ${
                                selectedTicket.status === status
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {status.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono font-semibold uppercase text-slate-700">
                          Lead Engineer Notes
                        </label>
                        <textarea
                          rows={3}
                          value={engineerNotes}
                          onChange={(e) => setEngineerNotes(e.target.value)}
                          placeholder="e.g. Staging branch deployed and verified; test cases passing with 100% type safety."
                          className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, selectedTicket.status)}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                      >
                        Save Engineer Notes
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-2">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500">
                        Select a maintenance ticket from the queue on the left to accept or update status.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CLIENT CHAT HUB */}
        {activeTab === 'chat' && (
          <div className="bg-white border border-slate-200 rounded-b-xl rounded-t-none overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-3 h-[620px]">
            {/* Conversations Sidebar */}
            <div className="border-r border-slate-200 p-4 space-y-3 bg-slate-50/50">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 px-1">
                Client Channels
              </h4>
              <div className="space-y-1.5">
                {clientConversations.length === 0 ? (
                  <p className="text-xs text-slate-400 p-2">No provisioned clients yet.</p>
                ) : (
                  clientConversations.map((email) => {
                    const clientContract = contracts.find(c => c.clientEmail.toLowerCase() === email.toLowerCase());
                    const isSelected = selectedClientEmail.toLowerCase() === email.toLowerCase();

                    return (
                      <button
                        key={email}
                        type="button"
                        onClick={() => setSelectedClientEmail(email)}
                        className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-indigo-500 shadow-sm'
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="font-semibold text-xs text-slate-900">
                          {clientContract?.company || email}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate font-mono">
                          {email}
                        </div>
                        <div className="text-[10px] text-indigo-600 mt-1 font-medium">
                          {clientContract?.tier || 'Client'}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Conversation Area */}
            <div className="md:col-span-2 flex flex-col h-full bg-white">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    Channel: {contracts.find(c => c.clientEmail.toLowerCase() === selectedClientEmail.toLowerCase())?.company || selectedClientEmail || 'Select a Client'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Messaging with client contact ({selectedClientEmail || 'none'})
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold font-mono">
                  SLA Active
                </span>
              </div>

              {/* Messages stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {currentChatMessages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    {selectedClientEmail ? 'No previous messages on this channel. Send the first response below!' : 'Select a client on the left to start communicating.'}
                  </div>
                ) : (
                  currentChatMessages.map((msg) => {
                    const isAdmin = msg.senderRole === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-mono mb-1">
                          <span>{msg.senderName}</span>
                          <span>•</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={`max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                            isAdmin
                              ? 'bg-slate-900 text-white rounded-br-xs'
                              : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Send Chat Form */}
              <form onSubmit={handleSendAdminReply} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center space-x-2">
                <input
                  type="text"
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  disabled={!selectedClientEmail || sendingReply}
                  placeholder={selectedClientEmail ? `Reply to ${selectedClientEmail}...` : "Select a client channel first..."}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-slate-100"
                />
                <button
                  type="submit"
                  disabled={!adminReplyText.trim() || !selectedClientEmail || sendingReply}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: PROVISION NEW CLIENT */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Provision Client Login & Retainer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Creates an authorized login and generates an encrypted Access Key.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProvisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {provisionError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{provisionError}</span>
              </div>
            )}

            <form onSubmit={handleProvisionClient} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                  Client Contact Name *
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Johnathan Hayes"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                  Client Business Email (Login ID) *
                </label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="e.g. j.hayes@vertexbiotech.com"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                  Client Organization / Company *
                </label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Vertex BioTech Inc."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                    Retainer Tier
                  </label>
                  <select
                    value={newTier}
                    onChange={(e) => {
                      const t = e.target.value as RetainerTier;
                      setNewTier(t);
                      if (t === 'Launch') {
                        setNewMonthlyFee(3500);
                        setNewHoursAllocated(20);
                        setNewSlaHours(24);
                      } else if (t === 'Scale & Performance') {
                        setNewMonthlyFee(7500);
                        setNewHoursAllocated(50);
                        setNewSlaHours(4);
                      } else {
                        setNewMonthlyFee(15000);
                        setNewHoursAllocated(120);
                        setNewSlaHours(1);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Launch">Launch ($3,500/mo - 24h SLA)</option>
                    <option value="Scale & Performance">Scale & Performance ($7,500/mo - 4h SLA)</option>
                    <option value="Enterprise Grid">Enterprise Grid ($15,000/mo - 1h SLA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-1">
                    Custom Access Key (Optional)
                  </label>
                  <input
                    type="text"
                    value={customAccessKey}
                    onChange={(e) => setCustomAccessKey(e.target.value)}
                    placeholder="Leave blank for auto NXG-XXXX"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={provisioningLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {provisioningLoading ? (
                    <span>Issuing Login...</span>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Provision & Issue Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
