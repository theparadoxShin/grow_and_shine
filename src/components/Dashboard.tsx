import React from 'react';
import { FileText, Sparkles, TrendingUp, Clock, Download, Eye, Users, Heart, MessageCircle, Share2, TrendingDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from '../utils/i18n';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation(state.language);

  const stats = [
    {
      label: t.documentsUploaded,
      value: state.documents.length,
      icon: FileText,
      color: 'blue',
      change: '+12%'
    },
    {
      label: t.contentGenerated,
      value: state.generatedContent.length,
      icon: Sparkles,
      color: 'green',
      change: '+24%'
    },
    {
      label: t.networksConnected,
      value: state.socialAccounts.filter(acc => acc.connected).length,
      icon: Users,
      color: 'purple',
      change: '+2'
    },
    {
      label: t.averageEngagement,
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
      title: 'AI-generated article',
      description: 'Content generated from "AI-Research.pdf" document',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'social',
      title: 'LinkedIn post scheduled',
      description: 'Marketing trends post - 2:00 PM',
      time: '3 hours ago',
      status: 'scheduled'
    },
    {
      id: 3,
      type: 'upload',
      title: 'New document uploaded',
      description: 'Marketing-Strategy-2024.pdf (2.3 MB)',
      time: '4 hours ago',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: 'Upload a document',
      description: 'Add a new PDF to analyze',
      icon: FileText,
      color: 'blue',
      action: () => dispatch({ type: 'SET_VIEW', payload: 'documents' })
    },
    {
      title: 'Generate content',
      description: 'Create content with AI',
      icon: Sparkles,
      color: 'green',
      action: () => dispatch({ type: 'SET_VIEW', payload: 'generate' })
    },
    {
      title: 'Configure social networks',
      description: 'Connect your social accounts',
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50/50 to-blue-50/30 min-h-screen">
      {/* En-tête */}
      <div className="animate-in fade-in slide-in-from-top duration-500">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t.welcomeMessage}, {state.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-600">{t.todayOverview}</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 100}ms` }}
            >
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 animate-in fade-in slide-in-from-bottom duration-700 delay-400">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{t.sentimentAnalysis}</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              View details
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.sentimentData.map((sentiment, index) => (
              <div 
                key={sentiment.platform} 
                className="relative animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${(index + 5) * 100}ms` }}
              >
                <div className={`bg-gradient-to-r ${getSentimentColor(sentiment.platform)} rounded-xl p-4 text-white hover:scale-105 transition-transform duration-300`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPlatformIcon(sentiment.platform)}</span>
                      <span className="font-medium capitalize">{sentiment.platform}</span>
                    </div>
                    {getTrendIcon(sentiment.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Positive</span>
                      <span>{sentiment.positive}%</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
                        style={{ width: `${sentiment.positive}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs opacity-80">
                      <span>Neutral: {sentiment.neutral}%</span>
                      <span>Negative: {sentiment.negative}%</span>
                    </div>
                    <div className="text-xs opacity-80 mt-2">
                      {sentiment.total} comments analyzed
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
        <div className="lg:col-span-1 animate-in fade-in slide-in-from-left duration-700 delay-600">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.quickActions}</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 text-left group"
                  style={{ animationDelay: `${(index + 8) * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${action.color}-200 transition-colors duration-300 group-hover:scale-110`}>
                      <Icon className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Activité récente */}
        <div className="lg:col-span-2 animate-in fade-in slide-in-from-right duration-700 delay-800">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.recentActivity}</h2>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl">
            {recentActivity.map((activity, index) => (
              <div 
                key={activity.id}
                className={`p-4 ${index !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50/50 transition-colors duration-200`}
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
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
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