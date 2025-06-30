const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const dynamodb = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

const eventBridge = new AWS.EventBridge();
const POSTS_TABLE = process.env.POSTS_TABLE;

const schedule = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { postId, scheduledDate, scheduledTime, timezone = 'Europe/Paris' } = JSON.parse(event.body);

    if (!postId || !scheduledDate || !scheduledTime) {
      return error('PostId, date et heure requis', 400);
    }

    // Récupérer le post
    const post = await dynamodb.get(POSTS_TABLE, { postId });
    
    if (!post || post.userId !== userId) {
      return error('Post non trouvé', 404);
    }

    // Construire la date/heure de publication
    const scheduledDateTime = moment.tz(`${scheduledDate} ${scheduledTime}`, timezone);
    
    if (scheduledDateTime.isBefore(moment())) {
      return error('La date de publication doit être dans le futur', 400);
    }

    // Mettre à jour le post
    const updatedPost = await dynamodb.update(
      POSTS_TABLE,
      { postId },
      'SET #status = :status, scheduledAt = :scheduledAt, timezone = :timezone',
      {
        ':status': 'scheduled',
        ':scheduledAt': scheduledDateTime.toISOString(),
        ':timezone': timezone
      },
      {
        '#status': 'status'
      }
    );

    // Créer un événement EventBridge pour déclencher la publication
    const eventParams = {
      Entries: [
        {
          Source: 'synthai.scheduler',
          DetailType: 'Scheduled Post',
          Detail: JSON.stringify({
            postId,
            userId,
            platform: post.platform,
            scheduledAt: scheduledDateTime.toISOString()
          }),
          Time: scheduledDateTime.toDate()
        }
      ]
    };

    await eventBridge.putEvents(eventParams).promise();

    return success({
      post: updatedPost,
      message: `Publication programmée pour le ${scheduledDateTime.format('DD/MM/YYYY à HH:mm')}`
    });

  } catch (err) {
    console.error('Schedule post error:', err);
    return error('Erreur lors de la programmation', 500);
  }
};

const publish = async (event) => {
  try {
    let postId, userId;

    // Gérer les deux types d'événements : HTTP et EventBridge
    if (event.httpMethod) {
      // Appel HTTP direct
      userId = event.requestContext.authorizer.userId;
      const body = JSON.parse(event.body);
      postId = body.postId;
    } else {
      // Événement EventBridge programmé
      const detail = event.detail;
      postId = detail.postId;
      userId = detail.userId;
    }

    if (!postId) {
      return error('PostId requis', 400);
    }

    // Récupérer le post
    const post = await dynamodb.get(POSTS_TABLE, { postId });
    
    if (!post || post.userId !== userId) {
      return error('Post non trouvé', 404);
    }

    // Simuler la publication sur le réseau social
    const publishResult = await publishToSocialPlatform(post);

    // Mettre à jour le statut du post
    const updatedPost = await dynamodb.update(
      POSTS_TABLE,
      { postId },
      'SET #status = :status, publishedAt = :publishedAt, socialPostId = :socialPostId',
      {
        ':status': 'published',
        ':publishedAt': new Date().toISOString(),
        ':socialPostId': publishResult.socialPostId
      },
      {
        '#status': 'status'
      }
    );

    const response = {
      post: updatedPost,
      publishResult,
      message: `Contenu publié avec succès sur ${post.platform}`
    };

    // Retourner différemment selon le type d'événement
    if (event.httpMethod) {
      return success(response);
    } else {
      console.log('Post published via EventBridge:', response);
      return { statusCode: 200, body: JSON.stringify(response) };
    }

  } catch (err) {
    console.error('Publish post error:', err);
    
    if (event.httpMethod) {
      return error('Erreur lors de la publication', 500);
    } else {
      throw err;
    }
  }
};

// Simulation de publication sur les réseaux sociaux
const publishToSocialPlatform = async (post) => {
  // En production, cela ferait des appels aux APIs des réseaux sociaux
  console.log(`Publishing to ${post.platform}:`, post.content.substring(0, 100));

  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simuler une réponse d'API
  const mockResponse = {
    socialPostId: `${post.platform}_${uuidv4()}`,
    url: `https://${post.platform}.com/post/${uuidv4()}`,
    publishedAt: new Date().toISOString(),
    platform: post.platform
  };

  // Simuler parfois des erreurs (5% de chance)
  if (Math.random() < 0.05) {
    throw new Error(`Erreur de publication sur ${post.platform}: Rate limit exceeded`);
  }

  return mockResponse;
};

module.exports = {
  schedule,
  publish,
  publishToSocialPlatform,
  handler: async (event) => {
    // Gérer les événements EventBridge
    if (event.source === 'synthai.scheduler') {
      return await publish(event);
    }

    const { httpMethod, path } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    try {
      if (path === '/content/schedule' && httpMethod === 'POST') {
        return await schedule(event);
      }
      
      if (path === '/content/publish' && httpMethod === 'POST') {
        return await publish(event);
      }

      return error('Route non trouvée', 404);
    } catch (err) {
      console.error('Publish handler error:', err);
      return error('Erreur interne du serveur', 500);
    }
  }
};