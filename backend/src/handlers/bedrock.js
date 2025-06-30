const AWS = require('aws-sdk');
const { success, error } = require('../utils/response');
const dynamodb = require('../utils/dynamodb');

const bedrock = new AWS.BedrockRuntime({
  region: process.env.BEDROCK_REGION || 'us-east-1'
});

const POSTS_TABLE = process.env.POSTS_TABLE;
const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE;

// Configuration des modèles Bedrock
const MODELS = {
  CLAUDE_SONNET: 'anthropic.claude-3-sonnet-20240229-v1:0',
  CLAUDE_HAIKU: 'anthropic.claude-3-haiku-20240307-v1:0',
  LLAMA2: 'meta.llama2-70b-chat-v1',
  TITAN: 'amazon.titan-text-express-v1'
};

// Configuration par plateforme
const PLATFORM_CONFIGS = {
  linkedin: {
    maxTokens: 1000,
    tone: 'professionnel et informatif',
    format: 'Article LinkedIn avec structure claire, bullet points et hashtags professionnels',
    maxLength: 3000
  },
  facebook: {
    maxTokens: 800,
    tone: 'engageant et accessible',
    format: 'Post Facebook conversationnel avec émojis et call-to-action',
    maxLength: 63206
  },
  twitter: {
    maxTokens: 200,
    tone: 'concis et percutant',
    format: 'Tweet court et impactant avec hashtags pertinents',
    maxLength: 280
  },
  instagram: {
    maxTokens: 600,
    tone: 'inspirant et visuel',
    format: 'Caption Instagram engageante avec émojis et hashtags lifestyle',
    maxLength: 2200
  }
};

const generateContent = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { prompt, platform, documentId, mode = 'text', style = 'professional' } = JSON.parse(event.body);

    if (!prompt || !platform) {
      return error('Prompt et plateforme requis', 400);
    }

    const config = PLATFORM_CONFIGS[platform];
    if (!config) {
      return error('Plateforme non supportée', 400);
    }

    let contextText = '';
    let documentData = null;

    // Récupérer le contexte du document si spécifié
    if (documentId) {
      documentData = await dynamodb.get(DOCUMENTS_TABLE, { docId: documentId });
      if (documentData && documentData.userId === userId) {
        contextText = documentData.extractedText?.substring(0, 4000) || '';
      }
    }

    // Générer le contenu selon le mode
    let generatedContent;
    let imageUrl = null;

    switch (mode) {
      case 'text':
        generatedContent = await generateTextContent(prompt, platform, contextText, config, style);
        break;
      case 'text-image':
        generatedContent = await generateTextContent(prompt, platform, contextText, config, style);
        imageUrl = await generateImageContent(prompt, platform, style);
        break;
      case 'image':
        generatedContent = await generateImageOnlyContent(prompt, platform, style);
        imageUrl = await generateImageContent(prompt, platform, style);
        break;
      default:
        return error('Mode de génération non supporté', 400);
    }

    // Sauvegarder le contenu généré
    const postId = require('uuid').v4();
    const post = {
      postId,
      userId,
      title: prompt.substring(0, 100),
      prompt,
      content: generatedContent,
      imageUrl,
      platform,
      mode,
      style,
      documentId: documentId || null,
      wordCount: generatedContent.split(/\s+/).length,
      characterCount: generatedContent.length,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    await dynamodb.put(POSTS_TABLE, post);

    return success({
      post,
      model: 'claude-3-sonnet',
      mode,
      hasImage: !!imageUrl
    });

  } catch (err) {
    console.error('Bedrock content generation error:', err);
    
    // Fallback vers Llama 2 si Claude indisponible
    if (err.code === 'ThrottlingException' || err.code === 'ModelNotReadyException') {
      try {
        return await generateWithFallback(event);
      } catch (fallbackError) {
        console.error('Fallback generation failed:', fallbackError);
        return error('Service temporairement indisponible', 503);
      }
    }
    
    return error('Erreur lors de la génération du contenu', 500);
  }
};

const generateTextContent = async (prompt, platform, contextText, config, style) => {
  const systemPrompt = `Tu es un expert en marketing de contenu spécialisé dans ${platform}. 
Crée du contenu ${config.tone} au format ${config.format}.
Style demandé: ${style}
Limite: ${config.maxLength} caractères maximum.
${contextText ? 'Utilise le contexte fourni pour enrichir le contenu.' : ''}

Règles importantes:
- Respecte strictement la limite de caractères
- Adapte le ton à la plateforme
- Inclus des hashtags pertinents
- Optimise pour l'engagement`;

  const userPrompt = `${prompt}${contextText ? `\n\nContexte du document:\n${contextText}` : ''}`;

  const params = {
    modelId: MODELS.CLAUDE_SONNET,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: config.maxTokens,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `Human: ${systemPrompt}\n\n${userPrompt}\n\nAssistant:`
        }
      ]
    })
  };

  const response = await bedrock.invokeModel(params).promise();
  const responseBody = JSON.parse(response.body.toString());
  
  return responseBody.content[0].text;
};

const generateImageContent = async (prompt, platform, style) => {
  // Simulation de génération d'image (en production, utiliser DALL-E ou Midjourney)
  const imagePrompts = {
    professional: 'Clean, modern, professional business style',
    creative: 'Artistic, colorful, creative and inspiring',
    minimal: 'Minimalist, clean, simple design',
    bold: 'Bold, dynamic, eye-catching design'
  };

  // Retourner une URL d'image Unsplash pour la démo
  const imageCategories = {
    linkedin: 'business',
    facebook: 'people',
    twitter: 'technology',
    instagram: 'lifestyle'
  };

  const category = imageCategories[platform] || 'business';
  return `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop&crop=center&auto=format&q=80`;
};

const generateImageOnlyContent = async (prompt, platform, style) => {
  // Pour le mode image seule, générer un texte minimal
  const config = PLATFORM_CONFIGS[platform];
  
  const params = {
    modelId: MODELS.CLAUDE_HAIKU, // Utiliser Haiku pour les tâches simples
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 100,
      temperature: 0.8,
      messages: [
        {
          role: "user",
          content: `Human: Génère une courte description ou caption pour une image sur ${platform} basée sur: ${prompt}. Style: ${style}. Maximum 50 mots.\n\nAssistant:`
        }
      ]
    })
  };

  const response = await bedrock.invokeModel(params).promise();
  const responseBody = JSON.parse(response.body.toString());
  
  return responseBody.content[0].text;
};

const generateWithFallback = async (event) => {
  console.log('Using Llama 2 fallback model');
  
  const { prompt, platform } = JSON.parse(event.body);
  const config = PLATFORM_CONFIGS[platform];

  const params = {
    modelId: MODELS.LLAMA2,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      prompt: `Create a ${platform} post about: ${prompt}. Keep it under ${config.maxLength} characters.`,
      max_gen_len: config.maxTokens,
      temperature: 0.7,
      top_p: 0.9
    })
  };

  const response = await bedrock.invokeModel(params).promise();
  const responseBody = JSON.parse(response.body.toString());
  
  return success({
    content: responseBody.generation,
    model: 'llama2-fallback',
    fallback: true
  });
};

// Streaming pour UX temps réel
const generateContentStream = async (event) => {
  try {
    const { prompt, platform } = JSON.parse(event.body);
    const config = PLATFORM_CONFIGS[platform];

    const params = {
      modelId: MODELS.CLAUDE_SONNET,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: config.maxTokens,
        temperature: 0.7,
        stream: true,
        messages: [
          {
            role: "user",
            content: `Human: Génère un post ${platform} sur: ${prompt}\n\nAssistant:`
          }
        ]
      })
    };

    // En production, implémenter WebSocket pour streaming
    const response = await bedrock.invokeModelWithResponseStream(params).promise();
    
    return success({
      streamId: 'stream_' + Date.now(),
      message: 'Streaming started'
    });

  } catch (err) {
    console.error('Streaming error:', err);
    return error('Erreur lors du streaming', 500);
  }
};

module.exports = {
  generateContent,
  generateContentStream,
  handler: async (event) => {
    const { httpMethod, path } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    try {
      if (path === '/content/generate' && httpMethod === 'POST') {
        return await generateContent(event);
      }
      
      if (path === '/content/generate-stream' && httpMethod === 'POST') {
        return await generateContentStream(event);
      }

      return error('Route non trouvée', 404);
    } catch (err) {
      console.error('Bedrock handler error:', err);
      return error('Erreur interne du serveur', 500);
    }
  }
};