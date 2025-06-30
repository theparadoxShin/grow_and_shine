import React from 'react';
import { Sparkles, Bell, User, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from '../utils/i18n';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation(state.language);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Grow&Shine</h1>
            <p className="text-xs text-gray-500">AI Marketing Platform</p>
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
          
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <img
              src={state.user?.avatar}
              alt={state.user?.name}
              className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{state.user?.name}</p>
              <p className="text-xs text-gray-500">{state.user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}