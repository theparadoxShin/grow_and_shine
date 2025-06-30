const AWS = require('aws-sdk');
const { success, error } = require('../utils/response');
const dynamodb = require('../utils/dynamodb');

const POSTS_TABLE = process.env.POSTS_TABLE;
const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE;

// Mock Google Veo3 API configuration
const VEO3_API_ENDPOINT = 'https://api.google.com/veo3/v1/generate';
const VEO3_API_KEY = process.env.VEO3_API_KEY;

// Mock OpenAI Sora API configuration  
const SORA_API_ENDPOINT = 'https://api.openai.com/v1/video/generations';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Video generation styles and configurations
const VIDEO_STYLES = {
  cinematic: {
    description: 'Professional film-like quality with cinematic lighting and composition',
    parameters: {
      style: 'cinematic',
      quality: 'high',
      lighting: 'professional',
      composition: 'rule_of_thirds'
    }
  },
  animated: {
    description: 'Motion graphics and smooth animations',
    parameters: {
      style: 'animated',
      animation_type: 'motion_graphics',
      smoothness: 'high'
    }
  },
  documentary: {
    description: 'Realistic and informative documentary style',
    parameters: {
      style: 'documentary',
      realism: 'high',
      tone: 'informative'
    }
  },
  commercial: {
    description: 'Marketing-focused presentation style',
    parameters: {
      style: 'commercial',
      energy: 'high',
      focus: 'product'
    }
  },
  social: {
    description: 'Optimized for social media platforms',
    parameters: {
      style: 'social_media',
      format: 'vertical',
      engagement: 'high'
    }
  }
};

const generateVideoWithVeo3 = async (prompt, style, duration, platform) => {
  try {
    console.log(`Generating video with Google Veo3: ${prompt}`);
    
    const styleConfig = VIDEO_STYLES[style] || VIDEO_STYLES.cinematic;
    
    // Mock API call to Google Veo3
    const requestBody = {
      prompt: prompt,
      duration: parseInt(duration),
      style: styleConfig.parameters,
      platform: platform,
      resolution: platform === 'instagram' ? '1080x1920' : '1920x1080',
      fps: 30,
      format: 'mp4'
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful response
    const mockResponse = {
      video_id: `veo3_${Date.now()}`,
      status: 'completed',
      video_url: `https://storage.googleapis.com/veo3-videos/${requestBody.video_id}.mp4`,
      thumbnail_url: `https://storage.googleapis.com/veo3-videos/${requestBody.video_id}_thumb.jpg`,
      duration: parseInt(duration),
      resolution: requestBody.resolution,
      file_size: Math.floor(Math.random() * 50 + 10), // 10-60 MB
      created_at: new Date().toISOString()
    };

    return {
      success: true,
      provider: 'google_veo3',
      data: mockResponse
    };

  } catch (err) {
    console.error('Google Veo3 API error:', err);
    throw new Error(`Veo3 generation failed: ${err.message}`);
  }
};

const generateVideoWithSora = async (prompt, style, duration, platform) => {
  try {
    console.log(`Generating video with OpenAI Sora: ${prompt}`);
    
    const styleConfig = VIDEO_STYLES[style] || VIDEO_STYLES.cinematic;
    
    // Mock API call to OpenAI Sora
    const requestBody = {
      model: 'sora-1.0',
      prompt: `${prompt}. Style: ${styleConfig.description}`,
      duration: parseInt(duration),
      resolution: platform === 'instagram' ? '1080x1920' : '1920x1080',
      quality: 'high'
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock successful response
    const mockResponse = {
      video_id: `sora_${Date.now()}`,
      status: 'completed',
      video_url: `https://cdn.openai.com/sora-videos/${requestBody.video_id}.mp4`,
      thumbnail_url: `https://cdn.openai.com/sora-videos/${requestBody.video_id}_thumb.jpg`,
      duration: parseInt(duration),
      resolution: requestBody.resolution,
      file_size: Math.floor(Math.random() * 80 + 20), // 20-100 MB
      created_at: new Date().toISOString()
    };

    return {
      success: true,
      provider: 'openai_sora',
      data: mockResponse
    };

  } catch (err) {
    console.error('OpenAI Sora API error:', err);
    throw new Error(`Sora generation failed: ${err.message}`);
  }
};

const generateVideo = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { 
      prompt, 
      platform, 
      documentId, 
      videoStyle = 'cinematic', 
      duration = '30',
      provider = 'veo3' // 'veo3' or 'sora'
    } = JSON.parse(event.body);

    if (!prompt || !platform) {
      return error('Prompt and platform are required', 400);
    }

    // Validate duration
    const validDurations = ['15', '30', '60', '120'];
    if (!validDurations.includes(duration)) {
      return error('Invalid duration. Must be 15, 30, 60, or 120 seconds', 400);
    }

    // Validate video style
    if (!VIDEO_STYLES[videoStyle]) {
      return error('Invalid video style', 400);
    }

    let contextText = '';
    let documentData = null;

    // Get document context if specified
    if (documentId) {
      documentData = await dynamodb.get(DOCUMENTS_TABLE, { docId: documentId });
      if (documentData && documentData.userId === userId) {
        contextText = documentData.extractedText?.substring(0, 2000) || '';
      }
    }

    // Enhance prompt with context and platform optimization
    const enhancedPrompt = buildVideoPrompt(prompt, platform, contextText, videoStyle);

    let videoResult;

    // Choose video generation provider
    if (provider === 'sora' && OPENAI_API_KEY) {
      videoResult = await generateVideoWithSora(enhancedPrompt, videoStyle, duration, platform);
    } else {
      // Default to Veo3 or fallback
      videoResult = await generateVideoWithVeo3(enhancedPrompt, videoStyle, duration, platform);
    }

    if (!videoResult.success) {
      throw new Error('Video generation failed');
    }

    // Generate accompanying text content
    const textContent = generateVideoDescription(prompt, platform, videoStyle, duration);

    // Save the generated content
    const postId = require('uuid').v4();
    const post = {
      postId,
      userId,
      title: prompt.substring(0, 100),
      prompt,
      content: textContent,
      videoUrl: videoResult.data.video_url,
      thumbnailUrl: videoResult.data.thumbnail_url,
      platform,
      mode: 'video',
      videoStyle,
      videoDuration: parseInt(duration),
      videoProvider: videoResult.provider,
      videoId: videoResult.data.video_id,
      documentId: documentId || null,
      wordCount: textContent.split(/\s+/).length,
      characterCount: textContent.length,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    await dynamodb.put(POSTS_TABLE, post);

    return success({
      post,
      video: videoResult.data,
      provider: videoResult.provider,
      message: `Video generated successfully with ${videoResult.provider}`
    });

  } catch (err) {
    console.error('Video generation error:', err);
    return error(`Video generation failed: ${err.message}`, 500);
  }
};

const buildVideoPrompt = (basePrompt, platform, contextText, style) => {
  const platformOptimizations = {
    linkedin: 'Professional business setting, corporate environment',
    facebook: 'Engaging and relatable, community-focused',
    twitter: 'Dynamic and attention-grabbing, fast-paced',
    instagram: 'Visually stunning, lifestyle-oriented, vertical format preferred'
  };

  const styleDescriptions = {
    cinematic: 'with cinematic lighting, professional camera movements, and film-like quality',
    animated: 'with smooth animations, motion graphics, and dynamic transitions',
    documentary: 'with realistic footage, natural lighting, and informative presentation',
    commercial: 'with high energy, product focus, and marketing appeal',
    social: 'optimized for social media with engaging visuals and quick cuts'
  };

  let enhancedPrompt = `Create a video about: ${basePrompt}`;
  
  if (platformOptimizations[platform]) {
    enhancedPrompt += `. Platform style: ${platformOptimizations[platform]}`;
  }
  
  if (styleDescriptions[style]) {
    enhancedPrompt += `. Visual style: ${styleDescriptions[style]}`;
  }
  
  if (contextText) {
    enhancedPrompt += `. Context: ${contextText.substring(0, 500)}`;
  }

  return enhancedPrompt;
};

const generateVideoDescription = (prompt, platform, style, duration) => {
  const platformEmojis = {
    linkedin: '💼',
    facebook: '📘',
    twitter: '🐦',
    instagram: '📸'
  };

  const emoji = platformEmojis[platform] || '🎬';

  return `${emoji} ${prompt}

🎬 This AI-generated video showcases the power of modern technology in content creation.

✨ Video highlights:
• Professional ${style} style
• ${duration} seconds of engaging content
• Optimized for ${platform.charAt(0).toUpperCase() + platform.slice(1)}
• Generated with cutting-edge AI

Perfect for capturing your audience's attention and driving engagement!

#AIVideo #ContentCreation #${platform.charAt(0).toUpperCase() + platform.slice(1)} #Innovation #VideoMarketing`;
};

const getVideoStatus = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;
    const { videoId } = event.pathParameters;

    // In production, this would check the actual video generation status
    // For now, return mock status
    return success({
      videoId,
      status: 'completed',
      progress: 100,
      estimatedTimeRemaining: 0
    });

  } catch (err) {
    console.error('Get video status error:', err);
    return error('Error retrieving video status', 500);
  }
};

module.exports = {
  generateVideo,
  getVideoStatus,
  handler: async (event) => {
    const { httpMethod, path } = event;

    if (httpMethod === 'OPTIONS') {
      return success({});
    }

    try {
      if (path === '/video/generate' && httpMethod === 'POST') {
        return await generateVideo(event);
      }
      
      if (path.includes('/video/status/') && httpMethod === 'GET') {
        return await getVideoStatus(event);
      }

      return error('Route not found', 404);
    } catch (err) {
      console.error('Video handler error:', err);
      return error('Internal server error', 500);
    }
  }
};