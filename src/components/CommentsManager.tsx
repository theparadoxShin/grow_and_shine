import React, { useState, useEffect } from 'react';
import { MessageCircle, Filter, Search, Reply, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, Minus, Zap, Send, Copy, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Comment {
  commentId: string;
  platform: string;
  text: string;
  author: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  sentimentScore: number;
  replied: boolean;
  escalated: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  postId: string;
}

interface CommentStats {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  replied: number;
  escalated: number;
  replyRate: number;
  positiveRate: number;
}

interface ReplySuggestion {
  type: 'template' | 'ai_generated' | 'custom';
  text: string;
  confidence: number;
}

export default function CommentsManager() {
  const { state, dispatch } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentStats | null>(null);
  const [filter, setFilter] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [replyModal, setReplyModal] = useState<{
    comment: Comment | null;
    suggestions: ReplySuggestion[];
    isGenerating: boolean;
  }>({ comment: null, suggestions: [], isGenerating: false });

  const platforms = [
    { id: 'all', name: 'Toutes les plateformes', icon: '🌐', color: 'from-gray-500 to-gray-600' },
    { id: 'facebook', name: 'Facebook', icon: '📘', color: 'from-blue-500 to-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-700' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'from-sky-400 to-sky-500' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-600' }
  ];

  const filters = [
    { id: 'all', name: 'Tous', count: stats?.total || 0 },
    { id: 'positive', name: 'Positifs', count: stats?.positive || 0 },
    { id: 'neutral', name: 'Neutres', count: stats?.neutral || 0 },
    { id: 'negative', name: 'Négatifs', count: stats?.negative || 0 },
    { id: 'unanswered', name: 'Non répondus', count: (stats?.total || 0) - (stats?.replied || 0) },
    { id: 'escalated', name: 'Escaladés', count: stats?.escalated || 0 }
  ];

  useEffect(() => {
    loadComments();
    loadStats();
  }, [filter, selectedPlatform, searchTerm]);

  const loadComments = async () => {
    // Simulation de chargement des commentaires
    const mockComments: Comment[] = [
      {
        commentId: '1',
        platform: 'facebook',
        text: 'Super contenu ! Très informatif et bien expliqué. Merci pour ce partage 👍',
        author: 'Marie Dubois',
        sentiment: 'POSITIVE',
        sentimentScore: 0.89,
        replied: false,
        escalated: false,
        priority: 'low',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        postId: 'post_fb_1'
      },
      {
        commentId: '2',
        platform: 'linkedin',
        text: 'Je ne suis pas d\'accord avec cette approche. Il y a des risques que vous ne mentionnez pas.',
        author: 'Thomas Martin',
        sentiment: 'NEGATIVE',
        sentimentScore: 0.23,
        replied: false,
        escalated: true,
        priority: 'high',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        postId: 'post_li_1'
      },
      {
        commentId: '3',
        platform: 'twitter',
        text: 'Pouvez-vous expliquer davantage ce point ? Je ne comprends pas bien.',
        author: 'Sophie Laurent',
        sentiment: 'NEUTRAL',
        sentimentScore: 0.52,
        replied: false,
        escalated: false,
        priority: 'medium',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        postId: 'post_tw_1'
      },
      {
        commentId: '4',
        platform: 'instagram',
        text: 'Magnifique ! J\'adore cette approche créative 🎨✨',
        author: 'Alex Chen',
        sentiment: 'POSITIVE',
        sentimentScore: 0.94,
        replied: true,
        escalated: false,
        priority: 'low',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        postId: 'post_ig_1'
      },
      {
        commentId: '5',
        platform: 'facebook',
        text: 'Service client décevant. Aucune réponse depuis 3 jours.',
        author: 'Pierre Durand',
        sentiment: 'NEGATIVE',
        sentimentScore: 0.15,
        replied: false,
        escalated: true,
        priority: 'high',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        postId: 'post_fb_2'
      }
    ];

    // Filtrer les commentaires
    let filteredComments = mockComments;

    if (selectedPlatform !== 'all') {
      filteredComments = filteredComments.filter(c => c.platform === selectedPlatform);
    }

    if (filter !== 'all') {
      switch (filter) {
        case 'positive':
          filteredComments = filteredComments.filter(c => c.sentiment === 'POSITIVE');
          break;
        case 'neutral':
          filteredComments = filteredComments.filter(c => c.sentiment === 'NEUTRAL');
          break;
        case 'negative':
          filteredComments = filteredComments.filter(c => c.sentiment === 'NEGATIVE');
          break;
        case 'unanswered':
          filteredComments = filteredComments.filter(c => !c.replied);
          break;
        case 'escalated':
          filteredComments = filteredComments.filter(c => c.escalated);
          break;
      }
    }

    if (searchTerm) {
      filteredComments = filteredComments.filter(c => 
        c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setComments(filteredComments);
  };

  const loadStats = async () => {
    // Simulation des statistiques
    const mockStats: CommentStats = {
      total: 156,
      positive: 89,
      neutral: 34,
      negative: 33,
      replied: 98,
      escalated: 12,
      replyRate: 63,
      positiveRate: 57
    };

    setStats(mockStats);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'NEGATIVE':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'NEGATIVE':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleReply = async (comment: Comment) => {
    setReplyModal({ comment, suggestions: [], isGenerating: true });

    // Simuler la génération de suggestions
    setTimeout(() => {
      const mockSuggestions: ReplySuggestion[] = [
        {
          type: 'template',
          text: comment.sentiment === 'POSITIVE' 
            ? 'Merci beaucoup pour votre retour positif ! 😊'
            : comment.sentiment === 'NEGATIVE'
            ? 'Merci pour votre retour. Nous prenons vos commentaires très au sérieux.'
            : 'Merci pour votre commentaire !',
          confidence: 0.7
        },
        {
          type: 'ai_generated',
          text: comment.sentiment === 'POSITIVE'
            ? 'Nous sommes ravis que notre contenu vous plaise ! Votre soutien nous motive à continuer. 🙏'
            : comment.sentiment === 'NEGATIVE'
            ? 'Nous comprenons vos préoccupations et aimerions en discuter davantage. Pouvez-vous nous contacter en privé ?'
            : 'C\'est une excellente question ! Laissez-nous vous expliquer ce point plus en détail...',
          confidence: 0.85
        },
        {
          type: 'template',
          text: comment.sentiment === 'POSITIVE'
            ? 'Votre enthousiasme nous fait chaud au cœur ! ❤️'
            : comment.sentiment === 'NEGATIVE'
            ? 'Nous sommes désolés que votre expérience n\'ait pas été à la hauteur.'
            : 'Nous apprécions votre engagement avec notre contenu.',
          confidence: 0.6
        }
      ];

      setReplyModal({ comment, suggestions: mockSuggestions, isGenerating: false });
    }, 2000);
  };

  const handleSendReply = (suggestion: ReplySuggestion) => {
    if (!replyModal.comment) return;

    // Marquer le commentaire comme répondu
    setComments(prev => prev.map(c => 
      c.commentId === replyModal.comment?.commentId 
        ? { ...c, replied: true }
        : c
    ));

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { 
        message: `Réponse publiée sur ${replyModal.comment.platform}`, 
        type: 'success' 
      }
    });

    setReplyModal({ comment: null, suggestions: [], isGenerating: false });
    loadStats(); // Recharger les stats
  };

  const handleBulkAction = (action: string) => {
    if (selectedComments.length === 0) return;

    switch (action) {
      case 'reply':
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { 
            message: `${selectedComments.length} réponses en cours de traitement`, 
            type: 'info' 
          }
        });
        break;
      case 'escalate':
        setComments(prev => prev.map(c => 
          selectedComments.includes(c.commentId) 
            ? { ...c, escalated: true, priority: 'high' }
            : c
        ));
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { 
            message: `${selectedComments.length} commentaires escaladés`, 
            type: 'info' 
          }
        });
        break;
    }

    setSelectedComments([]);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Il y a moins d\'1h';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return `Il y a ${Math.floor(diffInHours / 24)}j`;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Commentaires</h1>
        <p className="text-gray-600">Analysez et répondez aux commentaires avec l'IA</p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-blue-600 font-medium">+12%</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              <p className="text-sm text-gray-600">Commentaires totaux</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">{stats.positiveRate}%</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stats.positive}</h3>
              <p className="text-sm text-gray-600">Commentaires positifs</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Reply className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-purple-600 font-medium">{stats.replyRate}%</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stats.replied}</h3>
              <p className="text-sm text-gray-600">Réponses envoyées</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-red-600 font-medium">Urgent</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stats.escalated}</h3>
              <p className="text-sm text-gray-600">Commentaires escaladés</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Filtres */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Filtres par plateforme */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Plateformes</h3>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    selectedPlatform === platform.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span className="font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtres par sentiment */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Filtres</h3>
            <div className="space-y-2">
              {filters.map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    filter === filterOption.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-medium">{filterOption.name}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {filterOption.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions en masse */}
          {selectedComments.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Actions ({selectedComments.length})
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleBulkAction('reply')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                  Répondre en masse
                </button>
                <button
                  onClick={() => handleBulkAction('escalate')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                  Escalader
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Liste des commentaires */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Barre de recherche */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher dans les commentaires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Commentaires */}
          <div className="space-y-4">
            {comments.map((comment) => {
              const platform = platforms.find(p => p.id === comment.platform);
              return (
                <div key={comment.commentId} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.commentId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedComments(prev => [...prev, comment.commentId]);
                        } else {
                          setSelectedComments(prev => prev.filter(id => id !== comment.commentId));
                        }
                      }}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${platform?.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                          {platform?.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{comment.author}</h4>
                          <p className="text-sm text-gray-500">{platform?.name} • {formatTimeAgo(comment.createdAt)}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(comment.sentiment)} flex items-center gap-1`}>
                            {getSentimentIcon(comment.sentiment)}
                            {comment.sentiment.toLowerCase()}
                          </div>
                          
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(comment.priority)}`}>
                            {comment.priority}
                          </div>

                          {comment.escalated && (
                            <AlertTriangle className="w-4 h-4 text-red-500" title="Escaladé" />
                          )}

                          {comment.replied && (
                            <CheckCircle className="w-4 h-4 text-green-500" title="Répondu" />
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">{comment.text}</p>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleReply(comment)}
                          disabled={comment.replied}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed"
                        >
                          <Reply className="w-4 h-4" />
                          {comment.replied ? 'Répondu' : 'Répondre'}
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all">
                          <Copy className="w-4 h-4" />
                          Copier
                        </button>

                        <div className="text-sm text-gray-500 ml-auto">
                          Confiance: {Math.round(comment.sentimentScore * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun commentaire</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all' || selectedPlatform !== 'all'
                  ? 'Aucun commentaire ne correspond à vos filtres'
                  : 'Les nouveaux commentaires apparaîtront ici'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de réponse */}
      {replyModal.comment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Répondre au commentaire</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 italic">"{replyModal.comment.text}"</p>
                <p className="text-sm text-gray-500 mt-2">- {replyModal.comment.author}</p>
              </div>
            </div>

            <div className="p-6">
              {replyModal.isGenerating ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Génération de suggestions avec Claude 3...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Suggestions de réponse :</h4>
                  
                  {replyModal.suggestions.map((suggestion, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            suggestion.type === 'ai_generated' 
                              ? 'bg-blue-100 text-blue-700'
                              : suggestion.type === 'template'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {suggestion.type === 'ai_generated' ? 'IA Claude 3' : 
                             suggestion.type === 'template' ? 'Template' : 'Personnalisé'}
                          </span>
                          <span className="text-sm text-gray-500">
                            Confiance: {Math.round(suggestion.confidence * 100)}%
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleSendReply(suggestion)}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all"
                        >
                          <Send className="w-3 h-3" />
                          Envoyer
                        </button>
                      </div>
                      
                      <p className="text-gray-700">{suggestion.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setReplyModal({ comment: null, suggestions: [], isGenerating: false })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => handleReply(replyModal.comment!)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Régénérer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}