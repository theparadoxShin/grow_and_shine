// Configuration des plateformes sociales
const SOCIAL_PLATFORMS = {
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok'
};

// Limites de caractères par plateforme
const PLATFORM_LIMITS = {
  [SOCIAL_PLATFORMS.FACEBOOK]: 63206,
  [SOCIAL_PLATFORMS.LINKEDIN]: 3000,
  [SOCIAL_PLATFORMS.TWITTER]: 280,
  [SOCIAL_PLATFORMS.INSTAGRAM]: 2200,
  [SOCIAL_PLATFORMS.YOUTUBE]: 5000,
  [SOCIAL_PLATFORMS.TIKTOK]: 2200
};

// Types de contenu supportés
const CONTENT_TYPES = {
  POST: 'post',
  ARTICLE: 'article',
  STORY: 'story',
  VIDEO: 'video'
};

// Statuts des posts
const POST_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  FAILED: 'failed'
};

// Statuts des documents
const DOCUMENT_STATUS = {
  PROCESSING: 'processing',
  READY: 'ready',
  ERROR: 'error'
};

// Types de sentiment
const SENTIMENT_TYPES = {
  POSITIVE: 'POSITIVE',
  NEUTRAL: 'NEUTRAL',
  NEGATIVE: 'NEGATIVE'
};

// Plans d'abonnement
const SUBSCRIPTION_PLANS = {
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise'
};

// Limites par plan
const PLAN_LIMITS = {
  [SUBSCRIPTION_PLANS.STARTER]: {
    postsPerWeek: 3,
    socialAccounts: 2,
    documentsPerMonth: 10,
    aiRequestsPerMonth: 100
  },
  [SUBSCRIPTION_PLANS.PROFESSIONAL]: {
    postsPerWeek: 5,
    socialAccounts: 5,
    documentsPerMonth: 50,
    aiRequestsPerMonth: 500
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    postsPerWeek: 10,
    socialAccounts: -1, // illimité
    documentsPerMonth: -1, // illimité
    aiRequestsPerMonth: -1 // illimité
  }
};

module.exports = {
  SOCIAL_PLATFORMS,
  PLATFORM_LIMITS,
  CONTENT_TYPES,
  POST_STATUS,
  DOCUMENT_STATUS,
  SENTIMENT_TYPES,
  SUBSCRIPTION_PLANS,
  PLAN_LIMITS
};