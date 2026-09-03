import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentPortal from './components/StudentPortal';
import CompanyPortal from './components/CompanyPortal';
import InstitutionPortal from './components/InstitutionPortal';
import PlatformPortal from './components/PlatformPortal';
import AdminPortal from './components/AdminPortal';
import PublicPortfolioModal from './components/PublicPortfolioModal';
import HomePage from './components/HomePage';
import AuthModal from './components/AuthModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState('student'); // student | company | institution | platform | admin
  const [publicPortfolioId, setPublicPortfolioId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Starts at null -> renders HomePage landing page
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState('login'); // 'login' | 'register'

  const handleOpenAuth = (mode = 'login') => {
    setInitialAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role) {
      setCurrentRole(user.role);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // If user is NOT logged in, render Public Home Page
  if (!currentUser) {
    return (
      <>
        <HomePage onOpenAuth={handleOpenAuth} />

        {/* Auth Modal triggered by Sign In / Sign Up top right buttons */}
        <AuthModal
          isOpen={showAuthModal}
          initialMode={initialAuthMode}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // Once authenticated, render strict role portal
  const renderActivePortal = () => {
    switch (currentRole) {
      case 'student':
        return <StudentPortal studentId={currentUser.id || "usr-student-1"} onSharePortfolio={(id) => setPublicPortfolioId(id)} />;
      case 'company':
        return <CompanyPortal companyId={currentUser.id || "usr-company-1"} />;
      case 'institution':
        return <InstitutionPortal instId={currentUser.id || "usr-institution-1"} />;
      case 'platform':
        return <PlatformPortal platformId={currentUser.id || "usr-platform-1"} />;
      case 'admin':
        return <AdminPortal />;
      default:
        return <StudentPortal studentId={currentUser.id || "usr-student-1"} onSharePortfolio={(id) => setPublicPortfolioId(id)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 pb-16">
        {renderActivePortal()}
      </main>

      {/* Shareable Public Digital Portfolio Modal */}
      {publicPortfolioId && (
        <PublicPortfolioModal
          studentId={publicPortfolioId}
          onClose={() => setPublicPortfolioId(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>AYUSH KaushalSetu • Ministry of AYUSH (SIH26044)</span>
          <span>DPDP Act 2023 Compliant • ABDM Health Grid Interoperable</span>
        </div>
      </footer>
    </div>
  );
}
