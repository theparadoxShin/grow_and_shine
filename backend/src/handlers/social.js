const { v4: uuidv4 } = require('uuid');
const dynamodb = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

const SOCIAL_ACCOUNTS_TABLE = process.env.SOCIAL_ACCOUNTS_TABLE;
const COMMENTS_TABLE = process.env.COMMENTS_TABLE;

// Mock des plateformes sociales disponibles
const PLATFORMS = {
  facebook: { name: 'Facebook', icon: '📘', color: 'from-blue-500 to-blue-600' },
  linkedin: { name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-700' },
  twitter: { name: 'Twitter', icon: '🐦', color: 'from-sky-400 to-sky-500' },
  instagram: { name: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-600' },
  youtube: { name: 'YouTube', icon: '📺', color: 'from-red-500 to-red-600' },
  tiktok: { name: 'TikTok', icon: '🎵', color: 'from-gray-800 to-black' }
};

const connect = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { platform } = JSON.parse(event.body);

    if (!platform || !PLATFORMS[platform]) {
      return error('Plateforme non supportée', 400);
    }

    // Simuler la connexion OAuth (en réalité, cela impliquerait un flow OAuth complet)
    const accountId = uuidv4();
    const mockAccount = {
      userId,
      accountId,
      platform,
      username: `@synthai_${platform}`,
      displayName: `SynthAI ${PLATFORMS[platform].name}`,
      avatar: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=40&h=40&fit=crop&crop=face',
      accessToken: `mock_token_${accountId}`, // En production, stocker de manière sécurisée
      refreshToken: `mock_refresh_${accountId}`,
      followers: Math.floor(Math.random() * 50000) + 1000,
      engagement: Math.floor(Math.random() * 10) + 1,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      lastSync: new Date().toISOString()
    };

    await dynamodb.put(SOCIAL_ACCOUNTS_TABLE, mockAccount);

    // Générer des commentaires mock pour cette plateforme
    await generateMockComments(userId, platform);

    return success({
      account: mockAccount,
      message: `${PLATFORMS[platform].name} connecté avec succès`
    });

  } catch (err) {
    console.error('Social connect error:', err);
    return error('Erreur lors de la connexion du compte social', 500);
  }
};

const getAccounts = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;

    const accounts = await dynamodb.query(
      SOCIAL_ACCOUNTS_TABLE,
      'userId = :userId',
      { ':userId': userId }
    );

    return success(accounts);

  } catch (err) {
    console.error('Get social accounts error:', err);
    return error('Erreur lors de la récupération des comptes sociaux', 500);
  }
};

const generateMockComments = async (userId, platform) => {
  const mockComments = [
    "Super contenu ! Très informatif 👍",
    "Merci pour ce partage, très utile",
    "Excellente analyse, j'ai appris beaucoup",
    "Contenu de qualité comme toujours",
    "Très intéressant, merci !",
    "Parfait timing pour ce post",
    "Génial ! Continuez comme ça",
    "Très bon point de vue",
    "Merci pour ces insights",
    "Content de voir ce type de contenu"
  ];

  const negativeComments = [
    "Je ne suis pas d'accord avec cette approche",
    "Ça pourrait être mieux expliqué",
    "Pas convaincu par cette méthode"
  ];

  const neutralComments = [
    "Intéressant",
    "À voir",
    "Merci pour l'info",
    "Ok",
    "Noté"
  ];

  // Générer 15-25 commentaires par plateforme
  const numComments = Math.floor(Math.random() * 10) + 15;
  
  for (let i = 0; i < numComments; i++) {
    const sentiment = Math.random();
    let commentText;
    let sentimentScore;

    if (sentiment < 0.7) { // 70% positif
      commentText = mockComments[Math.floor(Math.random() * mockComments.length)];
      sentimentScore = 0.7 + Math.random() * 0.3; // 0.7-1.0
    } else if (sentiment < 0.9) { // 20% neutre
      commentText = neutralComments[Math.floor(Math.random() * neutralComments.length)];
      sentimentScore = 0.3 + Math.random() * 0.4; // 0.3-0.7
    } else { // 10% négatif
      commentText = negativeComments[Math.floor(Math.random() * negativeComments.length)];
      sentimentScore = Math.random() * 0.3; // 0.0-0.3
    }

    const comment = {
      commentId: uuidv4(),
      postId: `mock_post_${platform}_${i}`,
      platform,
      userId,
      text: commentText,
      sentiment: sentimentScore > 0.7 ? 'POSITIVE' : sentimentScore > 0.3 ? 'NEUTRAL' : 'NEGATIVE',
      sentimentScore,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Derniers 7 jours
    };

    await dynamodb.put(COMMENTS_TABLE, comment);
  }
};

const fetchComments = async (event) => {
  try {
    console.log('Fetching comments from social platforms...');
    
    // En production, cela ferait des appels aux APIs des réseaux sociaux
    // Pour la démo, on simule la récupération de nouveaux commentaires
    
    const accounts = await dynamodb.scan(SOCIAL_ACCOUNTS_TABLE);
    
    for (const account of accounts) {
      if (Math.random() > 0.3) { // 70% de chance d'avoir de nouveaux commentaires
        await generateMockComments(account.userId, account.platform);
      }
    }

    console.log('Comments fetched successfully');
    return { statusCode: 200, body: 'Comments fetched' };

  } catch (error) {
    console.error('Fetch comments error:', error);
    throw error;
  }
};

module.exports = {
  connect,
  getAccounts,
  fetchComments,
  handler: async (event) => {
    const { httpMethod, path } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    try {
      if (path === '/social/connect' && httpMethod === 'POST') {
        return await connect(event);
      }
      
      if (path === '/social/accounts' && httpMethod === 'GET') {
        return await getAccounts(event);
      }

      return error('Route non trouvée', 404);
    } catch (err) {
      console.error('Social handler error:', err);
      return error('Erreur interne du serveur', 500);
    }
  }
};