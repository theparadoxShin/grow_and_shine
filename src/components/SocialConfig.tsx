import React, { useState } from 'react';
import { Plus, Settings, Trash2, RefreshCw, Users, TrendingUp, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp, SocialAccount } from '../contexts/AppContext';

export default function SocialConfig() {
  const { state, dispatch } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const availablePlatforms = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: '📘', 
      color: 'from-blue-500 to-blue-600',
      description: 'Connectez votre page Facebook Business'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: '💼', 
      color: 'from-blue-600 to-blue-700',
      description: 'Connectez votre profil ou page LinkedIn'
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: '🐦', 
      color: 'from-sky-400 to-sky-500',
      description: 'Connectez votre compte Twitter'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: '📸', 
      color: 'from-pink-500 to-purple-600',
      description: 'Connectez votre compte Instagram Business'
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: '📺', 
      color: 'from-red-500 to-red-600',
      description: 'Connectez votre chaîne YouTube'
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: '🎵', 
      color: 'from-gray-800 to-black',
      description: 'Connectez votre compte TikTok Business'
    }
  ];

  const handleConnectAccount = (platformId: string) => {
    const platform = availablePlatforms.find(p => p.id === platformId);
    if (!platform) return;

    // Simulate OAuth connection
    setTimeout(() => {
      const newAccount: SocialAccount = {
        id: Date.now().toString(),
        platform: platformId as any,
        username: `@synthai_${platformId}`,
        displayName: `SynthAI ${platform.name}`,
        avatar: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=40&h=40&fit=crop&crop=face',
        connected: true,
        followers: Math.floor(Math.random() * 50000) + 1000,
        engagement: Math.floor(Math.random() * 10) + 1,
        lastSync: new Date().toISOString()
      };

      dispatch({ type: 'CONNECT_SOCIAL_ACCOUNT', payload: newAccount });
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { message: `${platform.name} connecté avec succès !`, type: 'success' } 
      });
      setShowAddModal(false);
      setSelectedPlatform('');
    }, 2000);
  };

  const handleDisconnectAccount = (accountId: string) => {
    const account = state.socialAccounts.find(acc => acc.id === accountId);
    if (account) {
      dispatch({ type: 'DISCONNECT_SOCIAL_ACCOUNT', payload: accountId });
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { message: `${availablePlatforms.find(p => p.id === account.platform)?.name} déconnecté`, type: 'info' } 
      });
    }
  };

  const handleSyncAccount = (accountId: string) => {
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { message: 'Synchronisation en cours...', type: 'info' } 
    });
    
    setTimeout(() => {
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { message: 'Synchronisation terminée', type: 'success' } 
      });
    }, 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const connectedAccounts = state.socialAccounts.filter(acc => acc.connected);
  const unconnectedPlatforms = availablePlatforms.filter(
    platform => !state.socialAccounts.some(acc => acc.platform === platform.id && acc.connected)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration des Réseaux Sociaux</h1>
          <p className="text-gray-600">Connectez et gérez vos comptes de réseaux sociaux</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Ajouter un compte
        </button>
      </div>

      {/* Comptes connectés */}
      {connectedAccounts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comptes connectés ({connectedAccounts.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedAccounts.map((account) => {
              const platform = availablePlatforms.find(p => p.id === account.platform);
              return (
                <div key={account.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${platform?.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                        {platform?.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{platform?.name}</h3>
                        <p className="text-sm text-gray-600">{account.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Abonnés</span>
                      <span className="font-medium text-gray-900">{formatNumber(account.followers)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engagement</span>
                      <span className="font-medium text-gray-900">{account.engagement}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dernière sync</span>
                      <span className="font-medium text-gray-900">
                        {new Date(account.lastSync).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSyncAccount(account.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Sync
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDisconnectAccount(account.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Plateformes disponibles */}
      {unconnectedPlatforms.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plateformes disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unconnectedPlatforms.map((platform) => (
              <div key={platform.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                    <p className="text-sm text-gray-600">Non connecté</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{platform.description}</p>

                <button
                  onClick={() => handleConnectAccount(platform.id)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all"
                >
                  Connecter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques globales */}
      {connectedAccounts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Statistiques globales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(connectedAccounts.reduce((acc, account) => acc + account.followers, 0))}
              </div>
              <div className="text-sm text-gray-600">Abonnés totaux</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {connectedAccounts.length > 0 
                  ? `${(connectedAccounts.reduce((acc, account) => acc + account.engagement, 0) / connectedAccounts.length).toFixed(1)}%`
                  : '0%'
                }
              </div>
              <div className="text-sm text-gray-600">Engagement moyen</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {state.generatedContent.filter(c => c.scheduled).length}
              </div>
              <div className="text-sm text-gray-600">Posts programmés</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {state.generatedContent.filter(c => c.published).length}
              </div>
              <div className="text-sm text-gray-600">Posts publiés</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un compte</h3>
            
            <div className="space-y-3 mb-6">
              {unconnectedPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                    selectedPlatform === platform.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center text-white`}>
                      {platform.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{platform.name}</h4>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedPlatform('');
                }}
                className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => selectedPlatform && handleConnectAccount(selectedPlatform)}
                disabled={!selectedPlatform}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-all disabled:cursor-not-allowed"
              >
                Connecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* État vide */}
      {connectedAccounts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun compte connecté</h3>
          <p className="text-gray-600 mb-4">Connectez vos réseaux sociaux pour commencer à publier du contenu</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all"
          >
            Connecter mon premier compte
          </button>
        </div>
      )}
    </div>
  );
}