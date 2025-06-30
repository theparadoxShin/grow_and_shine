import React, { useState } from 'react';
import { Sparkles, FileText, Wand2, Copy, Download, RefreshCw, Calendar, Send, Clock } from 'lucide-react';
import { useApp, GeneratedContent } from '../contexts/AppContext';

export default function ContentGenerator() {
  const { state, dispatch } = useApp();
  const [prompt, setPrompt] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<GeneratedContent | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const availableDocuments = state.documents.filter(doc => doc.status === 'ready');
  const connectedPlatforms = state.socialAccounts.filter(acc => acc.connected);

  const platforms = [
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: '💼', 
      color: 'from-blue-600 to-blue-700',
      maxLength: 3000,
      description: 'Contenu professionnel et B2B'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: '📘', 
      color: 'from-blue-500 to-blue-600',
      maxLength: 63206,
      description: 'Posts engageants pour communauté'
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: '🐦', 
      color: 'from-sky-400 to-sky-500',
      maxLength: 280,
      description: 'Messages courts et percutants'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: '📸', 
      color: 'from-pink-500 to-purple-600',
      maxLength: 2200,
      description: 'Contenu visuel et lifestyle'
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    setTimeout(() => {
      const mockContent = generateMockContent(prompt, selectedPlatform);
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        title: prompt,
        prompt: prompt,
        content: mockContent,
        platform: selectedPlatform,
        createdAt: new Date().toISOString(),
        wordCount: mockContent.split(' ').length,
        scheduled: false,
        published: false
      };

      dispatch({ type: 'ADD_GENERATED_CONTENT', payload: newContent });
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { message: `Contenu généré pour ${platforms.find(p => p.id === selectedPlatform)?.name} !`, type: 'success' } 
      });
      
      setLastGenerated(newContent);
      setIsGenerating(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 3000 + Math.random() * 2000);
  };

  const generateMockContent = (prompt: string, platform: string): string => {
    const templates = {
      linkedin: `🚀 ${prompt}

L'intelligence artificielle révolutionne notre façon de travailler et de créer du contenu. 

💡 Points clés à retenir :
• Automatisation des processus créatifs
• Amélioration de la productivité des équipes
• Personnalisation à grande échelle
• ROI mesurable dès les premiers mois

Les entreprises qui adoptent l'IA générative prennent une longueur d'avance significative sur leur marché.

Qu'en pensez-vous ? Partagez votre expérience en commentaire ! 👇

#IA #Innovation #Marketing #Transformation #Digitale`,

      facebook: `🎯 ${prompt}

Saviez-vous que l'IA générative peut transformer votre stratégie de contenu ?

✨ Voici ce que nous avons découvert :
- 60% de gain de temps sur la création
- Contenu plus cohérent et personnalisé
- Engagement client amélioré

L'avenir du marketing digital passe par l'intelligence artificielle ! 

👉 Que pensez-vous de cette évolution ? Dites-nous tout en commentaire !

#Marketing #IA #Innovation`,

      twitter: `🚀 ${prompt}

L'IA générative change la donne :
✅ +60% de productivité
✅ Contenu personnalisé
✅ ROI positif

L'avenir du #marketing est là ! 

#IA #Innovation #MarketingDigital`,

      instagram: `✨ ${prompt} ✨

L'intelligence artificielle transforme notre créativité ! 🎨

🔥 Ce qui nous passionne :
• Création automatisée
• Personnalisation unique  
• Résultats mesurables

L'innovation n'attend pas ! 💫

#IA #Innovation #Créativité #Marketing #Futur #Tech #Digital #Inspiration`
    };

    return templates[platform as keyof typeof templates] || templates.linkedin;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { message: 'Contenu copié dans le presse-papier', type: 'success' } 
    });
  };

  const handleSchedulePost = () => {
    if (!scheduledDate || !scheduledTime) {
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { message: 'Veuillez sélectionner une date et heure', type: 'error' } 
      });
      return;
    }

    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { message: `Publication programmée pour le ${scheduledDate} à ${scheduledTime}`, type: 'success' } 
    });
  };

  const handlePublishNow = () => {
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { message: `Contenu publié sur ${platforms.find(p => p.id === selectedPlatform)?.name} !`, type: 'success' } 
    });
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Générer du Contenu</h1>
        <p className="text-gray-600">Créez du contenu optimisé pour chaque réseau social</p>
      </div>

      {/* Sélection de plateforme */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choisir la plateforme</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => {
            const isConnected = connectedPlatforms.some(acc => acc.platform === platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                disabled={!isConnected}
                className={`
                  relative p-4 rounded-xl border-2 transition-all text-left
                  ${selectedPlatform === platform.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : isConnected 
                      ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-xl flex items-center justify-center text-white text-xl mb-3`}>
                  {platform.icon}
                </div>
                <h3 className="font-medium text-gray-900">{platform.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{platform.description}</p>
                <p className="text-xs text-gray-500">Max: {platform.maxLength} caractères</p>
                {!isConnected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-xl">
                    <span className="text-sm font-medium text-gray-500">Non connecté</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de génération */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
            
            {/* Document source */}
            {availableDocuments.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document source (optionnel)
                </label>
                <select
                  value={selectedDocument}
                  onChange={(e) => setSelectedDocument(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                >
                  <option value="">Aucun document sélectionné</option>
                  {availableDocuments.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Prompt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet ou instruction
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Ex: Rédigez un post ${selectedPlatformData?.name} sur les tendances du marketing digital...`}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 resize-none"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Optimisé pour {selectedPlatformData?.name}</span>
                <span>Max: {selectedPlatformData?.maxLength} caractères</span>
              </div>
            </div>

            {/* Bouton de génération */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || !connectedPlatforms.some(acc => acc.platform === selectedPlatform)}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Générer le contenu
                </>
              )}
            </button>
          </div>
        </div>

        {/* Résultat */}
        <div className="space-y-6">
          {lastGenerated ? (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${selectedPlatformData?.color} rounded-lg flex items-center justify-center text-white`}>
                      {selectedPlatformData?.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedPlatformData?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {lastGenerated.content.length} caractères • {lastGenerated.wordCount} mots
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(lastGenerated.content)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Copier"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                      title="Régénérer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Actions de publication */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-50 focus:border-blue-500"
                    />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-50 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handlePublishNow}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Publier maintenant
                    </button>
                    <button
                      onClick={handleSchedulePost}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Programmer
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {lastGenerated.content}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${selectedPlatformData?.color} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                {selectedPlatformData?.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Prêt à générer</h3>
              <p className="text-gray-600">
                Créez du contenu optimisé pour {selectedPlatformData?.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contenu récent par plateforme */}
      {state.generatedContent.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenu récent par plateforme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.generatedContent.slice(0, 6).map((content) => {
              const platformData = platforms.find(p => p.id === content.platform);
              return (
                <div key={content.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${platformData?.color || 'from-gray-400 to-gray-500'} rounded-lg flex items-center justify-center text-white text-sm`}>
                      {platformData?.icon || '📱'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{platformData?.name || 'Plateforme'}</span>
                    {content.scheduled && (
                      <Clock className="w-4 h-4 text-blue-500" title="Programmé" />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{content.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {content.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{content.content.length} caractères</span>
                    <span>{new Date(content.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}