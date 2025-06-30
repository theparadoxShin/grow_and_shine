import React from 'react';
import { LayoutDashboard, FileText, Sparkles, History, User, Settings, Menu, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { state, dispatch } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Mes Documents', icon: FileText },
    { id: 'generate', label: 'Générer Contenu', icon: Sparkles },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'social-config', label: 'Réseaux Sociaux', icon: Settings },
  ] as const;

  const handleNavigation = (view: typeof state.currentView) => {
    dispatch({ type: 'SET_VIEW', payload: view });
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 w-64
      `}>
        <div className="p-6">
          {/* Header mobile */}
          <div className="flex items-center justify-between mb-8 md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">SynthAI</span>
            </div>
            <button
              onClick={onToggle}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats */}
          <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Statistiques</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Documents</span>
                <span className="font-medium text-blue-600">{state.documents.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Contenus générés</span>
                <span className="font-medium text-blue-600">{state.generatedContent.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Réseaux connectés</span>
                <span className="font-medium text-green-600">{state.socialAccounts.filter(acc => acc.connected).length}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 p-2 bg-white border border-gray-200 rounded-xl shadow-lg md:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}