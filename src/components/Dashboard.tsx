import React from 'react';
import { FileText, Sparkles, TrendingUp, Clock, Download, Eye, Users, Heart, MessageCircle, Share2, TrendingDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Dashboard() {
  const { state, dispatch } = useApp();

  const stats = [
    {
      label: 'Documents téléchargés',
      value: state.documents.length,
      icon: FileText,
      color: 'blue',
      change: '+12%'
    },
    {
      label: 'Contenus générés',
      value: state.generatedContent.length,
      icon: Sparkles,
      color: 'green',
      change: '+24%'
    },
    {
      label: 'Réseaux connectés',
      value: state.socialAccounts.filter(acc => acc.connected).length,
      icon: Users,
      color: 'purple',
      change: '+2'
    },
    {
      label: 'Engagement moyen',
      value: state.socialAccounts.length > 0 
        ? `${(state.socialAccounts.reduce((acc, account) => acc + account.engagement, 0) / state.socialAccounts.length).toFixed(1)}%`
        : '0%',
      icon: Heart,
      color: 'pink',
      change: '+8%'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'generate',
      title: 'Article sur l\'IA générative',
      description: 'Contenu généré à partir du document "AI-Research.pdf"',
      time: 'Il y a 2 heures',
      status: 'completed'
    },
    {
      id: 2,
      type: 'social',
      title: 'Publication LinkedIn programmée',
      description: 'Post sur les tendances marketing - 14h00',
      time: 'Il y a 3 heures',
      status: 'scheduled'
    },
    {
      id: 3,
      type: 'upload',
      title: 'Nouveau document téléchargé',
      description: 'Marketing-Strategy-2024.pdf (2.3 MB)',
      time: 'Il y a 4 heures',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: 'Télécharger un document',
      description: 'Ajoutez un nouveau PDF à analyser',
      icon: FileText,
      color: 'blue',
      action: () => dispatch({ type: 'SET_VIEW', payload: 'documents' })
    },
    {
      title: 'Générer du contenu',
      description: 'Créez du contenu avec l\'IA',
      icon: Sparkles,
      color: 'green',
      action: () => dispatch({ type: 'SET_VIEW', payload: 'generate' })
    },
    {
      title: 'Configurer réseaux sociaux',
      description: 'Connectez vos comptes sociaux',
      icon: Users,
      color: 'purple',
      action: () => dispatch({ type: 'SET_VIEW', payload: 'social-config' })
    }
  ];

  const getSentimentColor = (platform: string) => {
    const colors = {
      facebook: 'from-blue-500 to-blue-600',
      linkedin: 'from-blue-700 to-blue-800',
      twitter: 'from-sky-400 to-sky-500',
      instagram: 'from-pink-500 to-purple-600',
      youtube: 'from-red-500 to-red-600',
      tiktok: 'from-gray-800 to-black'
    };
    return colors[platform as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘';
      case 'linkedin': return '💼';
      case 'twitter': return '🐦';
      case 'instagram': return '📸';
      case 'youtube': return '📺';
      case 'tiktok': return '🎵';
      default: return '📱';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bonjour, {state.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-600">Voici un aperçu de votre activité aujourd'hui</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analyse des sentiments */}
      {state.sentimentData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Analyse des Sentiments</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir détails
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.sentimentData.map((sentiment) => (
              <div key={sentiment.platform} className="relative">
                <div className={`bg-gradient-to-r ${getSentimentColor(sentiment.platform)} rounded-xl p-4 text-white`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPlatformIcon(sentiment.platform)}</span>
                      <span className="font-medium capitalize">{sentiment.platform}</span>
                    </div>
                    {getTrendIcon(sentiment.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Positif</span>
                      <span>{sentiment.positive}%</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-500"
                        style={{ width: `${sentiment.positive}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs opacity-80">
                      <span>Neutre: {sentiment.neutral}%</span>
                      <span>Négatif: {sentiment.negative}%</span>
                    </div>
                    <div className="text-xs opacity-80 mt-2">
                      {sentiment.total} commentaires analysés
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions rapides */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${action.color}-200 transition-colors`}>
                      <Icon className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Activité récente */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
          <div className="bg-white border border-gray-200 rounded-2xl">
            {recentActivity.map((activity, index) => (
              <div 
                key={activity.id}
                className={`p-4 ${index !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'generate' ? 'bg-green-100' : 
                    activity.type === 'social' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'generate' ? 
                      <Sparkles className="w-5 h-5 text-green-600" /> : 
                      activity.type === 'social' ?
                      <Share2 className="w-5 h-5 text-purple-600" /> :
                      <FileText className="w-5 h-5 text-blue-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}