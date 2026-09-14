/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { NavigationPage, UserSession, MASTER_ADMIN_EMAIL } from "./types";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/auth/AuthModal";
import { ClientPortal } from "./components/portal/ClientPortal";
import { AdminPortal } from "./components/portal/AdminPortal";
import { HomePage } from "./components/pages/HomePage";
import { ServicesPage } from "./components/pages/ServicesPage";
import { WorkPage } from "./components/pages/WorkPage";
import { PricingPage } from "./components/pages/PricingPage";
import { AboutPage } from "./components/pages/AboutPage";
import { ContactPage } from "./components/pages/ContactPage";
import { Lock, ShieldCheck, KeyRound } from "lucide-react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>("home");
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('nexgrid_user_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load session from localStorage', e);
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Handle Open Portal from any page
  const handleOpenPortal = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (user.role === "admin") {
      setCurrentPage("admin-portal");
    } else {
      setCurrentPage("client-portal");
    }
  };

  // Handle Authentication Success
  const handleAuthSuccess = (authenticatedUser: UserSession) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem('nexgrid_user_session', JSON.stringify(authenticatedUser));
    } catch (e) {}
    setIsAuthModalOpen(false);
    if (authenticatedUser.role === "admin") {
      setCurrentPage("admin-portal");
    } else {
      setCurrentPage("client-portal");
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('nexgrid_user_session');
    } catch (e) {}
    if (currentPage === "client-portal" || currentPage === "admin-portal") {
      setCurrentPage("home");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900 font-body">
      {/* Primary Header with Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Routing Body */}
      <main className="flex-1 w-full">
        {currentPage === "home" && (
          <HomePage 
            onNavigate={setCurrentPage} 
            onOpenPortal={handleOpenPortal} 
          />
        )}

        {currentPage === "services" && (
          <ServicesPage 
            onNavigate={setCurrentPage} 
          />
        )}

        {currentPage === "work" && (
          <WorkPage 
            onNavigate={setCurrentPage} 
          />
        )}

        {currentPage === "pricing" && (
          <PricingPage 
            onNavigate={setCurrentPage} 
            onOpenPortal={handleOpenPortal} 
          />
        )}

        {currentPage === "about" && (
          <AboutPage 
            onNavigate={setCurrentPage} 
          />
        )}

        {currentPage === "contact" && (
          <ContactPage 
            onNavigate={setCurrentPage} 
            onOpenPortal={handleOpenPortal} 
          />
        )}

        {currentPage === "client-portal" && (
          user ? (
            <ClientPortal
              user={user}
              onNavigateToAdmin={() => {
                if (user.role === 'admin') {
                  setCurrentPage("admin-portal");
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
            />
          ) : (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
              <div className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-slate-900">Protected Client Portal</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Only provisioned client partners with an issued Access Key can access the maintenance dashboard and SLA triage.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm transition-all"
                  >
                    Client Sign In (Email & Access Key)
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Need access? Inquire at {MASTER_ADMIN_EMAIL}
                </div>
              </div>
            </div>
          )
        )}

        {currentPage === "admin-portal" && (
          user && user.role === 'admin' ? (
            <AdminPortal
              user={user}
              onNavigateToClient={() => setCurrentPage("client-portal")}
            />
          ) : (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
              <div className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-slate-900">NexGrid Operations Portal</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Master administrator access is strictly restricted to <strong className="text-slate-800">{MASTER_ADMIN_EMAIL}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm transition-all"
                  >
                    Admin Sign In
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Primary Footer with Agency Details */}
      <Footer onNavigate={setCurrentPage} />

      {/* Strict Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onLoginSuccess={handleAuthSuccess}
      />
    </div>
  );
}
