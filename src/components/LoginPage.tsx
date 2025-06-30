import React, { useState } from 'react';
import { LogIn, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function LoginPage() {
  const { dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'Alex Dupont',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      };

      dispatch({ type: 'LOGIN', payload: mockUser });
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { message: 'Login successful!', type: 'success' } 
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grow&Shine</h1>
          <p className="text-gray-600">Transform your social presence with AI</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Demo - Use any email/password
            </p>
          </div>
        </div>

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <Sparkles className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Advanced AI</p>
          </div>
          <div className="p-4">
            <Sparkles className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Smart Analytics</p>
          </div>
          <div className="p-4">
            <LogIn className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}