export interface Translations {
  // Navigation
  dashboard: string;
  documents: string;
  aiStudio: string;
  comments: string;
  history: string;
  profile: string;
  socialNetworks: string;
  
  // Common
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  copy: string;
  download: string;
  upload: string;
  generate: string;
  publish: string;
  schedule: string;
  
  // Dashboard
  welcomeMessage: string;
  todayOverview: string;
  documentsUploaded: string;
  contentGenerated: string;
  networksConnected: string;
  averageEngagement: string;
  sentimentAnalysis: string;
  quickActions: string;
  recentActivity: string;
  
  // Content Generation
  aiCreationStudio: string;
  createPersonalizedContent: string;
  generationMode: string;
  textOnly: string;
  textWithImage: string;
  imageScene: string;
  aiVideo: string;
  choosePlatform: string;
  configuration: string;
  contentStyle: string;
  videoStyle: string;
  videoDuration: string;
  sourceDocument: string;
  topicOrInstruction: string;
  generateWithBedrock: string;
  generateWithVeo3: string;
  publishNow: string;
  schedulePost: string;
  
  // Comments
  commentsManagement: string;
  analyzeAndRespond: string;
  totalComments: string;
  positiveComments: string;
  sentReplies: string;
  escalatedComments: string;
  allPlatforms: string;
  allFilters: string;
  positive: string;
  neutral: string;
  negative: string;
  unanswered: string;
  escalated: string;
  reply: string;
  replied: string;
  
  // Landing Page
  heroTitle: string;
  heroSubtitle: string;
  getStartedFree: string;
  seeDemo: string;
  whyChoose: string;
  ourVision: string;
  choosePlan: string;
  readyToRevolutionize: string;
  
  // Pricing
  starter: string;
  professional: string;
  enterprise: string;
  perMonth: string;
  choosePlan: string;
  
  // Footer
  allRightsReserved: string;
  privacyPolicy: string;
  termsOfService: string;
  cookies: string;
}

export const translations: Record<string, Translations> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    documents: 'My Documents',
    aiStudio: 'AI Studio',
    comments: 'Comments',
    history: 'History',
    profile: 'Profile',
    socialNetworks: 'Social Networks',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    copy: 'Copy',
    download: 'Download',
    upload: 'Upload',
    generate: 'Generate',
    publish: 'Publish',
    schedule: 'Schedule',
    
    // Dashboard
    welcomeMessage: 'Hello',
    todayOverview: 'Here\'s an overview of your activity today',
    documentsUploaded: 'Documents uploaded',
    contentGenerated: 'Content generated',
    networksConnected: 'Networks connected',
    averageEngagement: 'Average engagement',
    sentimentAnalysis: 'Sentiment Analysis',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    
    // Content Generation
    aiCreationStudio: 'AI Creation Studio',
    createPersonalizedContent: 'Create personalized content with Amazon Bedrock, Claude 3 Sonnet & Google Veo3',
    generationMode: 'Generation Mode',
    textOnly: 'Text Only',
    textWithImage: 'Text + Image',
    imageScene: 'Image Scene',
    aiVideo: 'AI Video',
    choosePlatform: 'Choose Platform',
    configuration: 'Configuration',
    contentStyle: 'Content Style',
    videoStyle: 'Video Style',
    videoDuration: 'Video Duration',
    sourceDocument: 'Source Document (optional)',
    topicOrInstruction: 'Topic or Instruction',
    generateWithBedrock: 'Generate with Bedrock AI',
    generateWithVeo3: 'Generate with Veo3 AI',
    publishNow: 'Publish Now',
    schedulePost: 'Schedule Post',
    
    // Comments
    commentsManagement: 'Comments Management',
    analyzeAndRespond: 'Analyze and respond to comments with AI',
    totalComments: 'Total comments',
    positiveComments: 'Positive comments',
    sentReplies: 'Sent replies',
    escalatedComments: 'Escalated comments',
    allPlatforms: 'All platforms',
    allFilters: 'All',
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative',
    unanswered: 'Unanswered',
    escalated: 'Escalated',
    reply: 'Reply',
    replied: 'Replied',
    
    // Landing Page
    heroTitle: 'Stop Guessing, Start Growing: AI Marketing for Founders',
    heroSubtitle: 'The AI-Powered Marketing Platform That Transforms Startups & SMEs Into Marketing Pros by creating, scheduling and publishing engaging content across all your social networks!',
    getStartedFree: 'Get Started Free',
    seeDemo: 'See Demo',
    whyChoose: 'Why Choose Grow&Shine?',
    ourVision: 'Our Vision',
    choosePlan: 'Choose Your Plan',
    readyToRevolutionize: 'Ready to revolutionize your content strategy?',
    
    // Pricing
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
    perMonth: 'month',
    choosePlan: 'Choose Plan',
    
    // Footer
    allRightsReserved: 'All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    cookies: 'Cookies'
  },
  
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    documents: 'Mes Documents',
    aiStudio: 'Studio IA',
    comments: 'Commentaires',
    history: 'Historique',
    profile: 'Profil',
    socialNetworks: 'Réseaux Sociaux',
    
    // Common
    loading: 'Chargement...',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    copy: 'Copier',
    download: 'Télécharger',
    upload: 'Téléverser',
    generate: 'Générer',
    publish: 'Publier',
    schedule: 'Programmer',
    
    // Dashboard
    welcomeMessage: 'Bonjour',
    todayOverview: 'Voici un aperçu de votre activité aujourd\'hui',
    documentsUploaded: 'Documents téléchargés',
    contentGenerated: 'Contenus générés',
    networksConnected: 'Réseaux connectés',
    averageEngagement: 'Engagement moyen',
    sentimentAnalysis: 'Analyse des Sentiments',
    quickActions: 'Actions rapides',
    recentActivity: 'Activité récente',
    
    // Content Generation
    aiCreationStudio: 'Studio de Création IA',
    createPersonalizedContent: 'Créez du contenu personnalisé avec Amazon Bedrock, Claude 3 Sonnet et Google Veo3',
    generationMode: 'Mode de Génération',
    textOnly: 'Texte Seul',
    textWithImage: 'Texte + Image',
    imageScene: 'Image Scène',
    aiVideo: 'Vidéo IA',
    choosePlatform: 'Choisir la plateforme',
    configuration: 'Configuration',
    contentStyle: 'Style de contenu',
    videoStyle: 'Style de vidéo',
    videoDuration: 'Durée de la vidéo',
    sourceDocument: 'Document source (optionnel)',
    topicOrInstruction: 'Sujet ou instruction',
    generateWithBedrock: 'Générer avec Bedrock IA',
    generateWithVeo3: 'Générer avec Veo3 IA',
    publishNow: 'Publier maintenant',
    schedulePost: 'Programmer',
    
    // Comments
    commentsManagement: 'Gestion des Commentaires',
    analyzeAndRespond: 'Analysez et répondez aux commentaires avec l\'IA',
    totalComments: 'Commentaires totaux',
    positiveComments: 'Commentaires positifs',
    sentReplies: 'Réponses envoyées',
    escalatedComments: 'Commentaires escaladés',
    allPlatforms: 'Toutes les plateformes',
    allFilters: 'Tous',
    positive: 'Positifs',
    neutral: 'Neutres',
    negative: 'Négatifs',
    unanswered: 'Non répondus',
    escalated: 'Escaladés',
    reply: 'Répondre',
    replied: 'Répondu',
    
    // Landing Page
    heroTitle: 'Arrêtez de deviner, commencez à grandir : Marketing IA pour fondateurs',
    heroSubtitle: 'La plateforme marketing alimentée par l\'IA qui transforme les startups et PME en pros du marketing en créant, programmant et publiant du contenu engageant sur tous vos réseaux sociaux !',
    getStartedFree: 'Commencer gratuitement',
    seeDemo: 'Voir la démo',
    whyChoose: 'Pourquoi choisir Grow&Shine ?',
    ourVision: 'Notre Vision',
    choosePlan: 'Choisissez votre plan',
    readyToRevolutionize: 'Prêt à révolutionner votre stratégie de contenu ?',
    
    // Pricing
    starter: 'Starter',
    professional: 'Professionnel',
    enterprise: 'Enterprise',
    perMonth: 'mois',
    choosePlan: 'Choisir ce plan',
    
    // Footer
    allRightsReserved: 'Tous droits réservés.',
    privacyPolicy: 'Politique de confidentialité',
    termsOfService: 'Conditions d\'utilisation',
    cookies: 'Cookies'
  },
  
  es: {
    // Navigation
    dashboard: 'Panel',
    documents: 'Mis Documentos',
    aiStudio: 'Estudio IA',
    comments: 'Comentarios',
    history: 'Historial',
    profile: 'Perfil',
    socialNetworks: 'Redes Sociales',
    
    // Common
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    copy: 'Copiar',
    download: 'Descargar',
    upload: 'Subir',
    generate: 'Generar',
    publish: 'Publicar',
    schedule: 'Programar',
    
    // Dashboard
    welcomeMessage: 'Hola',
    todayOverview: 'Aquí tienes un resumen de tu actividad hoy',
    documentsUploaded: 'Documentos subidos',
    contentGenerated: 'Contenido generado',
    networksConnected: 'Redes conectadas',
    averageEngagement: 'Engagement promedio',
    sentimentAnalysis: 'Análisis de Sentimientos',
    quickActions: 'Acciones rápidas',
    recentActivity: 'Actividad reciente',
    
    // Content Generation
    aiCreationStudio: 'Estudio de Creación IA',
    createPersonalizedContent: 'Crea contenido personalizado con Amazon Bedrock, Claude 3 Sonnet y Google Veo3',
    generationMode: 'Modo de Generación',
    textOnly: 'Solo Texto',
    textWithImage: 'Texto + Imagen',
    imageScene: 'Escena de Imagen',
    aiVideo: 'Video IA',
    choosePlatform: 'Elegir Plataforma',
    configuration: 'Configuración',
    contentStyle: 'Estilo de contenido',
    videoStyle: 'Estilo de video',
    videoDuration: 'Duración del video',
    sourceDocument: 'Documento fuente (opcional)',
    topicOrInstruction: 'Tema o instrucción',
    generateWithBedrock: 'Generar con Bedrock IA',
    generateWithVeo3: 'Generar con Veo3 IA',
    publishNow: 'Publicar ahora',
    schedulePost: 'Programar',
    
    // Comments
    commentsManagement: 'Gestión de Comentarios',
    analyzeAndRespond: 'Analiza y responde a comentarios con IA',
    totalComments: 'Comentarios totales',
    positiveComments: 'Comentarios positivos',
    sentReplies: 'Respuestas enviadas',
    escalatedComments: 'Comentarios escalados',
    allPlatforms: 'Todas las plataformas',
    allFilters: 'Todos',
    positive: 'Positivos',
    neutral: 'Neutrales',
    negative: 'Negativos',
    unanswered: 'Sin responder',
    escalated: 'Escalados',
    reply: 'Responder',
    replied: 'Respondido',
    
    // Landing Page
    heroTitle: 'Deja de adivinar, empieza a crecer: Marketing IA para fundadores',
    heroSubtitle: 'La plataforma de marketing impulsada por IA que transforma startups y PYMES en profesionales del marketing creando, programando y publicando contenido atractivo en todas tus redes sociales!',
    getStartedFree: 'Comenzar gratis',
    seeDemo: 'Ver demo',
    whyChoose: '¿Por qué elegir Grow&Shine?',
    ourVision: 'Nuestra Visión',
    choosePlan: 'Elige tu plan',
    readyToRevolutionize: '¿Listo para revolucionar tu estrategia de contenido?',
    
    // Pricing
    starter: 'Inicial',
    professional: 'Profesional',
    enterprise: 'Empresarial',
    perMonth: 'mes',
    choosePlan: 'Elegir plan',
    
    // Footer
    allRightsReserved: 'Todos los derechos reservados.',
    privacyPolicy: 'Política de Privacidad',
    termsOfService: 'Términos de Servicio',
    cookies: 'Cookies'
  },

  de: {
    // Navigation
    dashboard: 'Dashboard',
    documents: 'Meine Dokumente',
    aiStudio: 'KI-Studio',
    comments: 'Kommentare',
    history: 'Verlauf',
    profile: 'Profil',
    socialNetworks: 'Soziale Netzwerke',
    
    // Common
    loading: 'Laden...',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    copy: 'Kopieren',
    download: 'Herunterladen',
    upload: 'Hochladen',
    generate: 'Generieren',
    publish: 'Veröffentlichen',
    schedule: 'Planen',
    
    // Dashboard
    welcomeMessage: 'Hallo',
    todayOverview: 'Hier ist eine Übersicht Ihrer heutigen Aktivitäten',
    documentsUploaded: 'Hochgeladene Dokumente',
    contentGenerated: 'Generierte Inhalte',
    networksConnected: 'Verbundene Netzwerke',
    averageEngagement: 'Durchschnittliches Engagement',
    sentimentAnalysis: 'Sentiment-Analyse',
    quickActions: 'Schnellaktionen',
    recentActivity: 'Letzte Aktivitäten',
    
    // Content Generation
    aiCreationStudio: 'KI-Erstellungsstudio',
    createPersonalizedContent: 'Erstellen Sie personalisierten Content mit Amazon Bedrock, Claude 3 Sonnet und Google Veo3',
    generationMode: 'Generierungsmodus',
    textOnly: 'Nur Text',
    textWithImage: 'Text + Bild',
    imageScene: 'Bildszene',
    aiVideo: 'KI-Video',
    choosePlatform: 'Plattform wählen',
    configuration: 'Konfiguration',
    contentStyle: 'Content-Stil',
    videoStyle: 'Video-Stil',
    videoDuration: 'Video-Dauer',
    sourceDocument: 'Quelldokument (optional)',
    topicOrInstruction: 'Thema oder Anweisung',
    generateWithBedrock: 'Mit Bedrock KI generieren',
    generateWithVeo3: 'Mit Veo3 KI generieren',
    publishNow: 'Jetzt veröffentlichen',
    schedulePost: 'Beitrag planen',
    
    // Comments
    commentsManagement: 'Kommentar-Management',
    analyzeAndRespond: 'Analysieren und antworten Sie auf Kommentare mit KI',
    totalComments: 'Gesamte Kommentare',
    positiveComments: 'Positive Kommentare',
    sentReplies: 'Gesendete Antworten',
    escalatedComments: 'Eskalierte Kommentare',
    allPlatforms: 'Alle Plattformen',
    allFilters: 'Alle',
    positive: 'Positiv',
    neutral: 'Neutral',
    negative: 'Negativ',
    unanswered: 'Unbeantwortet',
    escalated: 'Eskaliert',
    reply: 'Antworten',
    replied: 'Beantwortet',
    
    // Landing Page
    heroTitle: 'Hören Sie auf zu raten, fangen Sie an zu wachsen: KI-Marketing für Gründer',
    heroSubtitle: 'Die KI-gestützte Marketing-Plattform, die Startups und KMUs in Marketing-Profis verwandelt, indem sie ansprechende Inhalte für alle Ihre sozialen Netzwerke erstellt, plant und veröffentlicht!',
    getStartedFree: 'Kostenlos starten',
    seeDemo: 'Demo ansehen',
    whyChoose: 'Warum Grow&Shine wählen?',
    ourVision: 'Unsere Vision',
    choosePlan: 'Wählen Sie Ihren Plan',
    readyToRevolutionize: 'Bereit, Ihre Content-Strategie zu revolutionieren?',
    
    // Pricing
    starter: 'Starter',
    professional: 'Professionell',
    enterprise: 'Enterprise',
    perMonth: 'Monat',
    choosePlan: 'Plan wählen',
    
    // Footer
    allRightsReserved: 'Alle Rechte vorbehalten.',
    privacyPolicy: 'Datenschutzrichtlinie',
    termsOfService: 'Nutzungsbedingungen',
    cookies: 'Cookies'
  },

  it: {
    // Navigation
    dashboard: 'Dashboard',
    documents: 'I Miei Documenti',
    aiStudio: 'Studio IA',
    comments: 'Commenti',
    history: 'Cronologia',
    profile: 'Profilo',
    socialNetworks: 'Social Network',
    
    // Common
    loading: 'Caricamento...',
    save: 'Salva',
    cancel: 'Annulla',
    delete: 'Elimina',
    edit: 'Modifica',
    copy: 'Copia',
    download: 'Scarica',
    upload: 'Carica',
    generate: 'Genera',
    publish: 'Pubblica',
    schedule: 'Programma',
    
    // Dashboard
    welcomeMessage: 'Ciao',
    todayOverview: 'Ecco una panoramica della tua attività di oggi',
    documentsUploaded: 'Documenti caricati',
    contentGenerated: 'Contenuti generati',
    networksConnected: 'Reti connesse',
    averageEngagement: 'Engagement medio',
    sentimentAnalysis: 'Analisi del Sentiment',
    quickActions: 'Azioni rapide',
    recentActivity: 'Attività recente',
    
    // Content Generation
    aiCreationStudio: 'Studio di Creazione IA',
    createPersonalizedContent: 'Crea contenuti personalizzati con Amazon Bedrock, Claude 3 Sonnet e Google Veo3',
    generationMode: 'Modalità di Generazione',
    textOnly: 'Solo Testo',
    textWithImage: 'Testo + Immagine',
    imageScene: 'Scena Immagine',
    aiVideo: 'Video IA',
    choosePlatform: 'Scegli Piattaforma',
    configuration: 'Configurazione',
    contentStyle: 'Stile del contenuto',
    videoStyle: 'Stile del video',
    videoDuration: 'Durata del video',
    sourceDocument: 'Documento sorgente (opzionale)',
    topicOrInstruction: 'Argomento o istruzione',
    generateWithBedrock: 'Genera con Bedrock IA',
    generateWithVeo3: 'Genera con Veo3 IA',
    publishNow: 'Pubblica ora',
    schedulePost: 'Programma post',
    
    // Comments
    commentsManagement: 'Gestione Commenti',
    analyzeAndRespond: 'Analizza e rispondi ai commenti con IA',
    totalComments: 'Commenti totali',
    positiveComments: 'Commenti positivi',
    sentReplies: 'Risposte inviate',
    escalatedComments: 'Commenti escalati',
    allPlatforms: 'Tutte le piattaforme',
    allFilters: 'Tutti',
    positive: 'Positivi',
    neutral: 'Neutrali',
    negative: 'Negativi',
    unanswered: 'Non risposti',
    escalated: 'Escalati',
    reply: 'Rispondi',
    replied: 'Risposto',
    
    // Landing Page
    heroTitle: 'Smetti di indovinare, inizia a crescere: Marketing IA per fondatori',
    heroSubtitle: 'La piattaforma di marketing alimentata dall\'IA che trasforma startup e PMI in professionisti del marketing creando, programmando e pubblicando contenuti coinvolgenti su tutti i tuoi social network!',
    getStartedFree: 'Inizia gratis',
    seeDemo: 'Vedi demo',
    whyChoose: 'Perché scegliere Grow&Shine?',
    ourVision: 'La Nostra Visione',
    choosePlan: 'Scegli il tuo piano',
    readyToRevolutionize: 'Pronto a rivoluzionare la tua strategia di contenuti?',
    
    // Pricing
    starter: 'Starter',
    professional: 'Professionale',
    enterprise: 'Enterprise',
    perMonth: 'mese',
    choosePlan: 'Scegli piano',
    
    // Footer
    allRightsReserved: 'Tutti i diritti riservati.',
    privacyPolicy: 'Politica sulla Privacy',
    termsOfService: 'Termini di Servizio',
    cookies: 'Cookie'
  },

  pt: {
    // Navigation
    dashboard: 'Painel',
    documents: 'Meus Documentos',
    aiStudio: 'Estúdio IA',
    comments: 'Comentários',
    history: 'Histórico',
    profile: 'Perfil',
    socialNetworks: 'Redes Sociais',
    
    // Common
    loading: 'Carregando...',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    copy: 'Copiar',
    download: 'Baixar',
    upload: 'Enviar',
    generate: 'Gerar',
    publish: 'Publicar',
    schedule: 'Agendar',
    
    // Dashboard
    welcomeMessage: 'Olá',
    todayOverview: 'Aqui está uma visão geral da sua atividade hoje',
    documentsUploaded: 'Documentos enviados',
    contentGenerated: 'Conteúdo gerado',
    networksConnected: 'Redes conectadas',
    averageEngagement: 'Engajamento médio',
    sentimentAnalysis: 'Análise de Sentimento',
    quickActions: 'Ações rápidas',
    recentActivity: 'Atividade recente',
    
    // Content Generation
    aiCreationStudio: 'Estúdio de Criação IA',
    createPersonalizedContent: 'Crie conteúdo personalizado com Amazon Bedrock, Claude 3 Sonnet e Google Veo3',
    generationMode: 'Modo de Geração',
    textOnly: 'Apenas Texto',
    textWithImage: 'Texto + Imagem',
    imageScene: 'Cena de Imagem',
    aiVideo: 'Vídeo IA',
    choosePlatform: 'Escolher Plataforma',
    configuration: 'Configuração',
    contentStyle: 'Estilo do conteúdo',
    videoStyle: 'Estilo do vídeo',
    videoDuration: 'Duração do vídeo',
    sourceDocument: 'Documento fonte (opcional)',
    topicOrInstruction: 'Tópico ou instrução',
    generateWithBedrock: 'Gerar com Bedrock IA',
    generateWithVeo3: 'Gerar com Veo3 IA',
    publishNow: 'Publicar agora',
    schedulePost: 'Agendar post',
    
    // Comments
    commentsManagement: 'Gestão de Comentários',
    analyzeAndRespond: 'Analise e responda comentários com IA',
    totalComments: 'Comentários totais',
    positiveComments: 'Comentários positivos',
    sentReplies: 'Respostas enviadas',
    escalatedComments: 'Comentários escalados',
    allPlatforms: 'Todas as plataformas',
    allFilters: 'Todos',
    positive: 'Positivos',
    neutral: 'Neutros',
    negative: 'Negativos',
    unanswered: 'Não respondidos',
    escalated: 'Escalados',
    reply: 'Responder',
    replied: 'Respondido',
    
    // Landing Page
    heroTitle: 'Pare de adivinhar, comece a crescer: Marketing IA para fundadores',
    heroSubtitle: 'A plataforma de marketing alimentada por IA que transforma startups e PMEs em profissionais de marketing criando, agendando e publicando conteúdo envolvente em todas as suas redes sociais!',
    getStartedFree: 'Começar grátis',
    seeDemo: 'Ver demo',
    whyChoose: 'Por que escolher Grow&Shine?',
    ourVision: 'Nossa Visão',
    choosePlan: 'Escolha seu plano',
    readyToRevolutionize: 'Pronto para revolucionar sua estratégia de conteúdo?',
    
    // Pricing
    starter: 'Inicial',
    professional: 'Profissional',
    enterprise: 'Empresarial',
    perMonth: 'mês',
    choosePlan: 'Escolher plano',
    
    // Footer
    allRightsReserved: 'Todos os direitos reservados.',
    privacyPolicy: 'Política de Privacidade',
    termsOfService: 'Termos de Serviço',
    cookies: 'Cookies'
  }
};

export const useTranslation = (language: string = 'en') => {
  const t = translations[language] || translations.en;
  
  return {
    t,
    language,
    availableLanguages: Object.keys(translations)
  };
};