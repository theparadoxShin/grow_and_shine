import React from 'react';
import { LayoutDashboard, FileText, Sparkles, History, User, Settings, Menu, X, MessageCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from '../utils/i18n';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation(state.language);

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'documents', label: t.documents, icon: FileText },
    { id: 'generate', label: t.aiStudio, icon: Sparkles },
    { id: 'comments', label: t.comments, icon: MessageCircle },
    { id: 'history', label: t.history, icon: History },
    { id: 'profile', label: t.profile, icon: User },
    { id: 'social-config', label: t.socialNetworks, icon: Settings },
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
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full bg-white/90 backdrop-blur-xl border-r border-gray-200/50 z-30 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 w-64
      `}>
        <div className="p-6">
          {/* Header mobile */}
          <div className="flex items-center justify-between mb-8 md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Grow&Shine</span>
            </div>
            <button
              onClick={onToggle}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats */}
          <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 transition-all duration-300 hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Documents</span>
                <span className="font-medium text-blue-600">{state.documents.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Generated content</span>
                <span className="font-medium text-blue-600">{state.generatedContent.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Connected networks</span>
                <span className="font-medium text-green-600">{state.socialAccounts.filter(acc => acc.connected).length}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="text-xs text-blue-600 font-medium animate-pulse">
                🤖 Powered by Amazon Bedrock
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 p-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg md:hidden transition-all duration-200 hover:scale-105"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}