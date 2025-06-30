import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DocumentUploader from './components/DocumentUploader';
import ContentGenerator from './components/ContentGenerator';
import History from './components/History';
import Profile from './components/Profile';
import SocialConfig from './components/SocialConfig';
import Notifications from './components/Notifications';

function AppContent() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // Show landing page if not authenticated and landing is enabled
  if (!state.isAuthenticated && showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // Show login page if not authenticated
  if (!state.isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (state.currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'documents':
        return <DocumentUploader />;
      case 'generate':
        return <ContentGenerator />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      case 'social-config':
        return <SocialConfig />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      <Notifications />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;