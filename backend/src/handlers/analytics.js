const dynamodb = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

const POSTS_TABLE = process.env.POSTS_TABLE;
const COMMENTS_TABLE = process.env.COMMENTS_TABLE;
const SOCIAL_ACCOUNTS_TABLE = process.env.SOCIAL_ACCOUNTS_TABLE;
const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE;

const getDashboard = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;

    // Récupérer toutes les données en parallèle
    const [posts, comments, socialAccounts, documents] = await Promise.all([
      dynamodb.query(
        POSTS_TABLE,
        'userId = :userId',
        { ':userId': userId },
        'UserPostsIndex'
      ),
      dynamodb.scan(
        COMMENTS_TABLE,
        'userId = :userId',
        { ':userId': userId }
      ),
      dynamodb.query(
        SOCIAL_ACCOUNTS_TABLE,
        'userId = :userId',
        { ':userId': userId }
      ),
      dynamodb.query(
        DOCUMENTS_TABLE,
        'userId = :userId',
        { ':userId': userId },
        'UserDocumentsIndex'
      )
    ]);

    // Calculer les statistiques
    const stats = {
      totalPosts: posts.length,
      publishedPosts: posts.filter(p => p.status === 'published').length,
      scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
      draftPosts: posts.filter(p => p.status === 'draft').length,
      totalDocuments: documents.length,
      processedDocuments: documents.filter(d => d.status === 'ready').length,
      connectedAccounts: socialAccounts.filter(a => a.status === 'connected').length,
      totalFollowers: socialAccounts.reduce((sum, acc) => sum + (acc.followers || 0), 0),
      averageEngagement: socialAccounts.length > 0 
        ? (socialAccounts.reduce((sum, acc) => sum + (acc.engagement || 0), 0) / socialAccounts.length).toFixed(1)
        : 0
    };

    // Analyse des sentiments par plateforme
    const sentimentByPlatform = {};
    socialAccounts.forEach(account => {
      const platformComments = comments.filter(c => c.platform === account.platform);
      
      if (platformComments.length > 0) {
        const sentimentCounts = {
          POSITIVE: platformComments.filter(c => c.sentiment === 'POSITIVE').length,
          NEUTRAL: platformComments.filter(c => c.sentiment === 'NEUTRAL').length,
          NEGATIVE: platformComments.filter(c => c.sentiment === 'NEGATIVE').length
        };

        const total = platformComments.length;
        sentimentByPlatform[account.platform] = {
          positive: Math.round((sentimentCounts.POSITIVE / total) * 100),
          neutral: Math.round((sentimentCounts.NEUTRAL / total) * 100),
          negative: Math.round((sentimentCounts.NEGATIVE / total) * 100),
          total,
          trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
        };
      }
    });

    // Posts récents par plateforme
    const recentPostsByPlatform = {};
    posts.slice(0, 10).forEach(post => {
      if (!recentPostsByPlatform[post.platform]) {
        recentPostsByPlatform[post.platform] = [];
      }
      recentPostsByPlatform[post.platform].push(post);
    });

    // Activité récente
    const recentActivity = [
      ...posts.slice(0, 5).map(post => ({
        id: post.postId,
        type: 'content_generated',
        title: post.title,
        description: `Contenu généré pour ${post.platform}`,
        timestamp: post.createdAt,
        status: post.status
      })),
      ...documents.slice(0, 3).map(doc => ({
        id: doc.docId,
        type: 'document_uploaded',
        title: doc.filename,
        description: `Document traité (${doc.wordCount} mots)`,
        timestamp: doc.processedAt || doc.createdAt,
        status: doc.status
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

    // Métriques de performance (simulées)
    const performanceMetrics = {
      contentCreationTime: Math.round(Math.random() * 30 + 10), // 10-40 minutes
      averageEngagementRate: parseFloat((Math.random() * 5 + 2).toFixed(1)), // 2-7%
      contentQualityScore: Math.round(Math.random() * 20 + 80), // 80-100
      timesSaved: Math.round(stats.totalPosts * 2.5), // heures économisées
    };

    return success({
      stats,
      sentimentByPlatform,
      recentPostsByPlatform,
      recentActivity,
      performanceMetrics,
      socialAccounts: socialAccounts.map(acc => ({
        platform: acc.platform,
        followers: acc.followers,
        engagement: acc.engagement,
        lastSync: acc.lastSync
      }))
    });

  } catch (err) {
    console.error('Get dashboard analytics error:', err);
    return error('Erreur lors de la récupération des analytics', 500);
  }
};

module.exports = {
  getDashboard,
  handler: async (event) => {
    const { httpMethod } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    if (httpMethod === 'GET') {
      return await getDashboard(event);
    }

    return error('Méthode non autorisée', 405);
  }
};