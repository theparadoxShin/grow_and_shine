import React, { useState } from 'react';
import { History as HistoryIcon, Search, Filter, Eye, Copy, Download, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function History() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredContent = state.generatedContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { message: 'Contenu copié dans le presse-papier', type: 'success' } 
    });
  };

  const groupContentByDate = (contents: typeof state.generatedContent) => {
    const groups: { [key: string]: typeof contents } = {};
    
    contents.forEach(content => {
      const date = new Date(content.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey: string;
      
      if (date.toDateString() === today.toDateString()) {
        groupKey = "Aujourd'hui";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Hier";
      } else {
        groupKey = date.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(content);
    });
    
    return groups;
  };

  const groupedContent = groupContentByDate(filteredContent);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Historique</h1>
        <p className="text-gray-600">Retrouvez tous vos contenus générés</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher dans l'historique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="article">Articles</option>
              <option value="summary">Résumés</option>
              <option value="social">Posts sociaux</option>
              <option value="email">Emails</option>
            </select>
            
            <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{state.generatedContent.length}</div>
          <div className="text-sm text-gray-600">Contenus générés</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {state.generatedContent.reduce((acc, content) => acc + content.wordCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Mots créés</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {state.generatedContent.filter(c => 
              new Date(c.createdAt).toDateString() === new Date().toDateString()
            ).length}
          </div>
          <div className="text-sm text-gray-600">Aujourd'hui</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(state.generatedContent.reduce((acc, content) => acc + content.wordCount, 0) / Math.max(state.generatedContent.length, 1))}
          </div>
          <div className="text-sm text-gray-600">Mots / contenu</div>
        </div>
      </div>

      {/* Liste des contenus groupés par date */}
      {Object.keys(groupedContent).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedContent).map(([date, contents]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">{date}</h2>
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-sm text-gray-500">{contents.length} élément{contents.length > 1 ? 's' : ''}</span>
              </div>
              
              <div className="space-y-4">
                {contents.map((content) => (
                  <div key={content.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{content.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{content.wordCount} mots</span>
                          <span>{new Date(content.createdAt).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Voir le contenu"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(content.content)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Copier"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {content.content.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Aucun résultat' : 'Aucun historique'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Essayez avec d\'autres mots-clés'
              : 'Générez votre premier contenu pour voir l\'historique ici'
            }
          </p>
        </div>
      )}
    </div>
  );
}