const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
const dynamodb = require('../utils/dynamodb');
const { success, error } = require('../utils/response');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const POSTS_TABLE = process.env.POSTS_TABLE;
const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE;

const PLATFORM_CONFIGS = {
  linkedin: {
    name: 'LinkedIn',
    maxLength: 3000,
    tone: 'professionnel et informatif',
    format: 'Article avec bullet points et hashtags professionnels'
  },
  facebook: {
    name: 'Facebook',
    maxLength: 63206,
    tone: 'engageant et accessible',
    format: 'Post conversationnel avec émojis et call-to-action'
  },
  twitter: {
    name: 'Twitter',
    maxLength: 280,
    tone: 'concis et percutant',
    format: 'Tweet court avec hashtags pertinents'
  },
  instagram: {
    name: 'Instagram',
    maxLength: 2200,
    tone: 'inspirant et visuel',
    format: 'Caption engageante avec émojis et hashtags lifestyle'
  }
};

const generate = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { prompt, platform, documentId } = JSON.parse(event.body);

    if (!prompt || !platform) {
      return error('Prompt et plateforme requis', 400);
    }

    if (!PLATFORM_CONFIGS[platform]) {
      return error('Plateforme non supportée', 400);
    }

    const config = PLATFORM_CONFIGS[platform];
    let contextText = '';

    // Si un document est sélectionné, récupérer son contenu
    if (documentId) {
      const document = await dynamodb.get(DOCUMENTS_TABLE, { docId: documentId });
      if (document && document.userId === userId) {
        contextText = document.extractedText?.substring(0, 4000) || ''; // Limiter le contexte
      }
    }

    // Construire le prompt pour OpenAI
    const systemPrompt = `Tu es un expert en marketing de contenu spécialisé dans ${config.name}. 
    Crée du contenu ${config.tone} au format ${config.format}.
    Limite: ${config.maxLength} caractères maximum.
    ${contextText ? 'Utilise le contexte fourni pour enrichir le contenu.' : ''}`;

    const userPrompt = `${prompt}${contextText ? `\n\nContexte du document:\n${contextText}` : ''}`;

    // Appel à OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const generatedContent = completion.choices[0].message.content;

    // Sauvegarder le contenu généré
    const postId = uuidv4();
    const post = {
      postId,
      userId,
      title: prompt.substring(0, 100),
      prompt,
      content: generatedContent,
      platform,
      documentId: documentId || null,
      wordCount: generatedContent.split(/\s+/).length,
      characterCount: generatedContent.length,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    await dynamodb.put(POSTS_TABLE, post);

    return success({
      post,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens
      }
    });

  } catch (err) {
    console.error('Content generation error:', err);
    
    if (err.code === 'insufficient_quota') {
      return error('Quota OpenAI dépassé', 429);
    }
    
    return error('Erreur lors de la génération du contenu', 500);
  }
};

// Fonction de fallback avec templates prédéfinis
const generateWithTemplate = (prompt, platform) => {
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

  return templates[platform] || templates.linkedin;
};

module.exports = {
  generate,
  generateWithTemplate,
  handler: async (event) => {
    const { httpMethod } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    if (httpMethod === 'POST') {
      return await generate(event);
    }

    return error('Méthode non autorisée', 405);
  }
};