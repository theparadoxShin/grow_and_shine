const AWS = require('aws-sdk');
const dynamodb = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

const comprehend = new AWS.Comprehend();
const COMMENTS_TABLE = process.env.COMMENTS_TABLE;
const SOCIAL_ACCOUNTS_TABLE = process.env.SOCIAL_ACCOUNTS_TABLE;

const analyze = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;

    // Récupérer les comptes sociaux de l'utilisateur
    const accounts = await dynamodb.query(
      SOCIAL_ACCOUNTS_TABLE,
      'userId = :userId',
      { ':userId': userId }
    );

    const sentimentData = [];

    for (const account of accounts) {
      // Récupérer les commentaires pour cette plateforme
      const comments = await dynamodb.scan(
        COMMENTS_TABLE,
        'platform = :platform AND userId = :userId',
        { 
          ':platform': account.platform,
          ':userId': userId 
        }
      );

      if (comments.length === 0) {
        continue;
      }

      // Calculer les statistiques de sentiment
      const sentimentCounts = {
        POSITIVE: 0,
        NEUTRAL: 0,
        NEGATIVE: 0
      };

      comments.forEach(comment => {
        sentimentCounts[comment.sentiment]++;
      });

      const total = comments.length;
      const positive = Math.round((sentimentCounts.POSITIVE / total) * 100);
      const neutral = Math.round((sentimentCounts.NEUTRAL / total) * 100);
      const negative = Math.round((sentimentCounts.NEGATIVE / total) * 100);

      // Déterminer la tendance (simulée)
      const previousPositive = positive - Math.floor(Math.random() * 10) + 5;
      let trend = 'stable';
      if (positive > previousPositive + 2) trend = 'up';
      else if (positive < previousPositive - 2) trend = 'down';

      sentimentData.push({
        platform: account.platform,
        positive,
        neutral,
        negative,
        total,
        trend
      });
    }

    return success(sentimentData);

  } catch (err) {
    console.error('Sentiment analysis error:', err);
    return error('Erreur lors de l\'analyse des sentiments', 500);
  }
};

// Fonction pour analyser le sentiment avec AWS Comprehend
const analyzeSentimentWithComprehend = async (texts) => {
  try {
    if (texts.length === 0) return [];

    // Analyser par batch (max 25 textes par appel)
    const results = [];
    const batchSize = 25;

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      const params = {
        TextList: batch,
        LanguageCode: 'fr' // Français
      };

      const response = await comprehend.batchDetectSentiment(params).promise();
      results.push(...response.ResultList);
    }

    return results;

  } catch (error) {
    console.error('Comprehend analysis error:', error);
    throw error;
  }
};

module.exports = {
  analyze,
  analyzeSentimentWithComprehend,
  handler: async (event) => {
    const { httpMethod } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    if (httpMethod === 'GET') {
      return await analyze(event);
    }

    return error('Méthode non autorisée', 405);
  }
};