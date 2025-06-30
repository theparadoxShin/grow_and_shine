const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

const comprehend = new AWS.Comprehend();
const bedrock = new AWS.BedrockRuntime({ region: 'us-east-1' });

const COMMENTS_TABLE = process.env.COMMENTS_TABLE;
const COMMENTS_MANAGEMENT_TABLE = process.env.COMMENTS_MANAGEMENT_TABLE;
const SOCIAL_ACCOUNTS_TABLE = process.env.SOCIAL_ACCOUNTS_TABLE;

// Templates de réponses pré-définis
const RESPONSE_TEMPLATES = {
  positive: [
    "Merci beaucoup pour votre retour positif ! 😊",
    "Nous sommes ravis que cela vous plaise ! 🙏",
    "Votre soutien nous fait chaud au cœur ! ❤️"
  ],
  neutral: [
    "Merci pour votre commentaire !",
    "Nous apprécions votre retour.",
    "Merci de nous suivre !"
  ],
  negative: [
    "Merci pour votre retour. Nous prenons vos commentaires très au sérieux.",
    "Nous sommes désolés que votre expérience n'ait pas été à la hauteur.",
    "Votre feedback est important pour nous améliorer."
  ],
  question: [
    "Excellente question ! Laissez-nous vous répondre...",
    "Merci pour cette question pertinente !",
    "C'est une très bonne question, voici notre réponse..."
  ]
};

const fetchComments = async (event) => {
  try {
    console.log('Fetching comments from social platforms...');
    
    // Récupérer tous les comptes sociaux connectés
    const accounts = await dynamodb.scan(SOCIAL_ACCOUNTS_TABLE);
    const connectedAccounts = accounts.filter(acc => acc.status === 'connected');

    let totalNewComments = 0;

    for (const account of connectedAccounts) {
      try {
        // Simuler l'appel API pour récupérer les commentaires
        const newComments = await fetchPlatformComments(account);
        
        // Analyser le sentiment de chaque commentaire
        for (const comment of newComments) {
          const sentimentResult = await analyzeSentiment(comment.text);
          
          const commentRecord = {
            commentId: uuidv4(),
            userId: account.userId,
            platform: account.platform,
            accountId: account.accountId,
            postId: comment.postId,
            text: comment.text,
            author: comment.author,
            sentiment: sentimentResult.sentiment,
            sentimentScore: sentimentResult.score,
            replied: false,
            escalated: false,
            createdAt: comment.createdAt,
            fetchedAt: new Date().toISOString()
          };

          await dynamodb.put(COMMENTS_TABLE, commentRecord);

          // Créer l'entrée de gestion
          const managementRecord = {
            commentId: commentRecord.commentId,
            userId: account.userId,
            platform: account.platform,
            sentiment: sentimentResult.sentiment,
            replied: false,
            escalated: sentimentResult.sentiment === 'NEGATIVE' && sentimentResult.score < 0.3,
            priority: calculatePriority(sentimentResult, comment),
            responseTemplate: null,
            assignedTo: null,
            createdAt: comment.createdAt
          };

          await dynamodb.put(COMMENTS_MANAGEMENT_TABLE, managementRecord);
          totalNewComments++;
        }

        // Mettre à jour la dernière synchronisation
        await dynamodb.update(
          SOCIAL_ACCOUNTS_TABLE,
          { userId: account.userId, accountId: account.accountId },
          'SET lastSync = :lastSync',
          { ':lastSync': new Date().toISOString() }
        );

      } catch (accountError) {
        console.error(`Error fetching comments for ${account.platform}:`, accountError);
      }
    }

    console.log(`Fetched ${totalNewComments} new comments`);
    return { statusCode: 200, body: `Fetched ${totalNewComments} comments` };

  } catch (error) {
    console.error('Fetch comments error:', error);
    throw error;
  }
};

const fetchPlatformComments = async (account) => {
  // Simulation des commentaires récents (en production, appels API réels)
  const mockComments = [
    {
      postId: `post_${account.platform}_${Date.now()}`,
      text: "Super contenu ! Très informatif 👍",
      author: "user123",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      postId: `post_${account.platform}_${Date.now() + 1}`,
      text: "Je ne suis pas d'accord avec cette approche",
      author: "critic456",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      postId: `post_${account.platform}_${Date.now() + 2}`,
      text: "Pouvez-vous expliquer davantage ce point ?",
      author: "curious789",
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Retourner 0-3 commentaires aléatoirement
  const numComments = Math.floor(Math.random() * 4);
  return mockComments.slice(0, numComments);
};

const analyzeSentiment = async (text) => {
  try {
    const params = {
      Text: text,
      LanguageCode: 'fr'
    };

    const result = await comprehend.detectSentiment(params).promise();
    
    return {
      sentiment: result.Sentiment,
      score: result.SentimentScore[result.Sentiment.toLowerCase()]
    };

  } catch (error) {
    console.error('Sentiment analysis error:', error);
    // Fallback simple
    return {
      sentiment: 'NEUTRAL',
      score: 0.5
    };
  }
};

const calculatePriority = (sentimentResult, comment) => {
  let priority = 'low';

  if (sentimentResult.sentiment === 'NEGATIVE' && sentimentResult.score < 0.3) {
    priority = 'high';
  } else if (sentimentResult.sentiment === 'NEGATIVE' || comment.text.includes('?')) {
    priority = 'medium';
  }

  return priority;
};

const getComments = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { platform, sentiment, replied, limit = 50 } = event.queryStringParameters || {};

    let filterExpression = 'userId = :userId';
    let expressionAttributeValues = { ':userId': userId };

    if (platform && platform !== 'all') {
      filterExpression += ' AND platform = :platform';
      expressionAttributeValues[':platform'] = platform;
    }

    if (sentiment && sentiment !== 'all') {
      filterExpression += ' AND sentiment = :sentiment';
      expressionAttributeValues[':sentiment'] = sentiment.toUpperCase();
    }

    if (replied !== undefined) {
      filterExpression += ' AND replied = :replied';
      expressionAttributeValues[':replied'] = replied === 'true';
    }

    const comments = await dynamodb.scan(
      COMMENTS_MANAGEMENT_TABLE,
      filterExpression,
      expressionAttributeValues
    );

    // Récupérer les détails complets des commentaires
    const detailedComments = await Promise.all(
      comments.slice(0, parseInt(limit)).map(async (comment) => {
        const fullComment = await dynamodb.get(COMMENTS_TABLE, { commentId: comment.commentId });
        return { ...comment, ...fullComment };
      })
    );

    // Trier par priorité et date
    detailedComments.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return success(detailedComments);

  } catch (err) {
    console.error('Get comments error:', err);
    return error('Erreur lors de la récupération des commentaires', 500);
  }
};

const generateReply = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { commentId, tone = 'professional', customPrompt } = JSON.parse(event.body);

    // Récupérer le commentaire
    const comment = await dynamodb.get(COMMENTS_TABLE, { commentId });
    if (!comment || comment.userId !== userId) {
      return error('Commentaire non trouvé', 404);
    }

    let suggestions = [];

    if (customPrompt) {
      // Génération personnalisée avec Bedrock
      const customReply = await generateCustomReply(comment.text, customPrompt, tone);
      suggestions.push(customReply);
    } else {
      // Suggestions basées sur templates + IA
      const templateSuggestions = getTemplateSuggestions(comment.sentiment);
      const aiSuggestion = await generateAIReply(comment.text, comment.sentiment, tone);
      
      suggestions = [...templateSuggestions, aiSuggestion];
    }

    return success({
      commentId,
      originalText: comment.text,
      sentiment: comment.sentiment,
      suggestions,
      tone
    });

  } catch (err) {
    console.error('Generate reply error:', err);
    return error('Erreur lors de la génération de réponse', 500);
  }
};

const generateCustomReply = async (commentText, prompt, tone) => {
  const params = {
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 200,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `Human: Génère une réponse ${tone} à ce commentaire: "${commentText}"\n\nInstructions: ${prompt}\n\nAssistant:`
        }
      ]
    })
  };

  const response = await bedrock.invokeModel(params).promise();
  const responseBody = JSON.parse(response.body.toString());
  
  return {
    type: 'custom',
    text: responseBody.content[0].text,
    confidence: 0.9
  };
};

const generateAIReply = async (commentText, sentiment, tone) => {
  const toneInstructions = {
    professional: 'Réponse professionnelle et courtoise',
    friendly: 'Réponse amicale et chaleureuse',
    humorous: 'Réponse avec une pointe d\'humour approprié'
  };

  const params = {
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 150,
      temperature: 0.6,
      messages: [
        {
          role: "user",
          content: `Human: Génère une réponse appropriée à ce commentaire ${sentiment.toLowerCase()}: "${commentText}"\n\nStyle: ${toneInstructions[tone]}\nLongueur: 1-2 phrases maximum\n\nAssistant:`
        }
      ]
    })
  };

  const response = await bedrock.invokeModel(params).promise();
  const responseBody = JSON.parse(response.body.toString());
  
  return {
    type: 'ai_generated',
    text: responseBody.content[0].text,
    confidence: 0.8
  };
};

const getTemplateSuggestions = (sentiment) => {
  const templates = RESPONSE_TEMPLATES[sentiment.toLowerCase()] || RESPONSE_TEMPLATES.neutral;
  
  return templates.slice(0, 2).map(template => ({
    type: 'template',
    text: template,
    confidence: 0.7
  }));
};

const replyToComment = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { commentId, replyText, template } = JSON.parse(event.body);

    // Marquer le commentaire comme répondu
    await dynamodb.update(
      COMMENTS_MANAGEMENT_TABLE,
      { commentId },
      'SET replied = :replied, responseTemplate = :template, repliedAt = :repliedAt',
      {
        ':replied': true,
        ':template': template || 'custom',
        ':repliedAt': new Date().toISOString()
      }
    );

    // En production, publier la réponse sur la plateforme sociale
    console.log(`Reply posted: ${replyText}`);

    return success({
      commentId,
      replied: true,
      replyText
    });

  } catch (err) {
    console.error('Reply to comment error:', err);
    return error('Erreur lors de la publication de la réponse', 500);
  }
};

const getCommentsStats = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;

    const allComments = await dynamodb.scan(
      COMMENTS_MANAGEMENT_TABLE,
      'userId = :userId',
      { ':userId': userId }
    );

    const stats = {
      total: allComments.length,
      positive: allComments.filter(c => c.sentiment === 'POSITIVE').length,
      neutral: allComments.filter(c => c.sentiment === 'NEUTRAL').length,
      negative: allComments.filter(c => c.sentiment === 'NEGATIVE').length,
      replied: allComments.filter(c => c.replied).length,
      escalated: allComments.filter(c => c.escalated).length,
      highPriority: allComments.filter(c => c.priority === 'high').length
    };

    stats.replyRate = stats.total > 0 ? Math.round((stats.replied / stats.total) * 100) : 0;
    stats.positiveRate = stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0;

    return success(stats);

  } catch (err) {
    console.error('Get comments stats error:', err);
    return error('Erreur lors de la récupération des statistiques', 500);
  }
};

module.exports = {
  fetchComments,
  getComments,
  generateReply,
  replyToComment,
  getCommentsStats,
  handler: async (event) => {
    // Gérer les événements programmés
    if (event.source === 'aws.events') {
      return await fetchComments(event);
    }

    const { httpMethod, path } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    try {
      if (path === '/comments' && httpMethod === 'GET') {
        return await getComments(event);
      }
      
      if (path === '/comments/stats' && httpMethod === 'GET') {
        return await getCommentsStats(event);
      }
      
      if (path === '/comments/generate-reply' && httpMethod === 'POST') {
        return await generateReply(event);
      }
      
      if (path === '/comments/reply' && httpMethod === 'POST') {
        return await replyToComment(event);
      }

      return error('Route non trouvée', 404);
    } catch (err) {
      console.error('Comments handler error:', err);
      return error('Erreur interne du serveur', 500);
    }
  }
};