import React, { useState } from 'react';
import { 
  NavigationPage, 
  UserSession 
} from '../types';
import { 
  ShieldCheck, 
  Terminal, 
  User, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  ArrowRight, 
  Phone, 
  Mail, 
  Layers, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  user: UserSession | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onQuickRoleSwitch?: (role: 'client' | 'admin' | 'visitor') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  user,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavigationPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'work', label: 'Architectures' },
    { id: 'pricing', label: 'Pricing & Retainers' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top micro bar for quick contact and active sprint availability */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-emerald-400 font-medium whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
              Accepting Q3/Q4 Development Engagements
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <a 
              href="mailto:nexgriddigital@gmail.com" 
              className="hidden sm:inline-flex items-center hover:text-white transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
              nexgriddigital@gmail.com
            </a>
            <a 
              href="tel:+251906697634" 
              className="hidden lg:inline-flex items-center hover:text-white transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
              +251 906697634
            </a>
          </div>

          <div className="flex items-center space-x-4 ml-auto text-xs">
            {user ? (
              <div className="inline-flex items-center space-x-2 text-slate-200 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-400">Authenticated:</span>
                <span className="text-white font-semibold">{user.role === 'admin' ? 'Admin Portal' : user.company}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center text-indigo-300 hover:text-white transition-colors cursor-pointer font-medium"
              >
                <LogIn className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                <span>Portal Sign In</span>
              </button>
            )}

            {/* SLA Status indicator */}
            <span className="hidden md:inline-flex items-center text-slate-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              99.98% SLA
            </span>
          </div>
        </div>
      </div>


      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* NexGrid Minimalist Swiss Logo */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-3 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
        >
          <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center font-mono font-bold text-base shadow-sm border border-slate-700 group-hover:bg-indigo-600 transition-colors">
            <span className="text-indigo-400 group-hover:text-white">N</span>
            <span className="text-white text-xs">G</span>
          </div>
          <div>
            <div className="font-heading font-extrabold text-slate-900 text-lg tracking-tight flex items-center">
              NEXGRID
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 ml-1"></span>
            </div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-medium -mt-1">
              Digital Solutions
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                  isActive
                    ? 'bg-slate-100 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Client Portal / Admin Portal Quick Links */}
          <button
            type="button"
            id="nav-client-portal-btn"
            onClick={() => {
              if (user?.role === 'admin') {
                onNavigate('admin-portal');
              } else if (user?.role === 'client') {
                onNavigate('client-portal');
              } else {
                onOpenAuth();
              }
            }}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
              currentPage === 'client-portal' || currentPage === 'admin-portal'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {user?.role === 'admin' ? (
              <>
                <Terminal className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Admin Ops Portal
              </>
            ) : user?.role === 'client' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Client Portal
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Access Portal
              </>
            )}
          </button>

          {/* User Status / Login Button */}
          {user ? (
            <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="font-medium text-slate-800 max-w-[130px] truncate hover:text-indigo-600 transition-colors cursor-pointer text-left"
                title="Click to view or switch account"
              >
                {user.role === 'admin' ? 'NexGrid Admin' : user.name}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-0.5"
                title="Log out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="header-login-btn"
              onClick={onOpenAuth}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 rounded transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              Sign In
            </button>
          )}

          {/* Primary CTA */}
          <button
            type="button"
            id="header-start-project-btn"
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-md text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/20 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Start a Project
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onNavigate(user?.role === 'admin' ? 'admin-portal' : 'client-portal')}
            className="px-2.5 py-1 text-xs font-medium border border-slate-300 rounded bg-white text-slate-700"
          >
            Portal
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-1.5 pb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === link.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('client-portal');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-slate-50 text-slate-800 border border-slate-200 flex items-center justify-between"
            >
              <span className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-indigo-600" />
                Client Portal (Contracts & Tickets)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('admin-portal');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-slate-50 text-slate-800 border border-slate-200 flex items-center justify-between"
            >
              <span className="flex items-center">
                <Terminal className="w-4 h-4 mr-2 text-indigo-600" />
                Admin Operations Portal
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-slate-600">
                    Logged in as <strong>{user.name}</strong> ({user.role})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-600 font-semibold hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-md"
                >
                  Sign In with Email OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm"
            >
              Start a Project
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
