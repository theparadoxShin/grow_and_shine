import React, { useState } from 'react';
import { Sparkles, FileText, Wand2, Copy, Download, RefreshCw, Calendar, Send, Clock, Type, FileImage, Camera, Zap, Video, Play } from 'lucide-react';
import { useApp, GeneratedContent } from '../contexts/AppContext';

export default function ContentGenerator() {
  const { state, dispatch } = useApp();
  const [prompt, setPrompt] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [mode, setMode] = useState<'text' | 'text-image' | 'image' | 'video'>('text');
  const [style, setStyle] = useState('professional');
  const [videoStyle, setVideoStyle] = useState('cinematic');
  const [videoDuration, setVideoDuration] = useState('15');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<GeneratedContent | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const availableDocuments = state.documents.filter(doc => doc.status === 'ready');
  const connectedPlatforms = state.socialAccounts.filter(acc => acc.connected);

  const platforms = [
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: '💼', 
      color: 'from-blue-600 to-blue-700',
      maxLength: 3000,
      description: 'Professional content and B2B',
      supportsVideo: true
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: '📘', 
      color: 'from-blue-500 to-blue-600',
      maxLength: 63206,
      description: 'Engaging posts for community',
      supportsVideo: true
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: '🐦', 
      color: 'from-sky-400 to-sky-500',
      maxLength: 280,
      description: 'Short and impactful messages',
      supportsVideo: true
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: '📸', 
      color: 'from-pink-500 to-purple-600',
      maxLength: 2200,
      description: 'Visual and lifestyle content',
      supportsVideo: true
    }
  ];

  const modes = [
    {
      id: 'text',
      name: 'Text Only',
      icon: Type,
      description: 'Optimized textual content',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'text-image',
      name: 'Text + Image',
      icon: FileImage,
      description: 'Text with illustrative image',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'image',
      name: 'Image Scene',
      icon: Camera,
      description: 'Image with minimal caption',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'video',
      name: 'AI Video',
      icon: Video,
      description: 'AI-generated video content',
      color: 'from-red-500 to-red-600'
    }
  ];

  const styles = [
    { id: 'professional', name: 'Professional', description: 'Formal and expert tone' },
    { id: 'creative', name: 'Creative', description: 'Innovative and original approach' },
    { id: 'friendly', name: 'Friendly', description: 'Warm and accessible tone' },
    { id: 'bold', name: 'Bold', description: 'Strong and impactful message' }
  ];

  const videoStyles = [
    { id: 'cinematic', name: 'Cinematic', description: 'Professional film-like quality' },
    { id: 'animated', name: 'Animated', description: 'Motion graphics and animations' },
    { id: 'documentary', name: 'Documentary', description: 'Realistic and informative style' },
    { id: 'commercial', name: 'Commercial', description: 'Marketing-focused presentation' },
    { id: 'social', name: 'Social Media', description: 'Optimized for social platforms' }
  ];

  const videoDurations = [
    { id: '15', name: '15 seconds', description: 'Perfect for stories and quick content' },
    { id: '30', name: '30 seconds', description: 'Ideal for social media posts' },
    { id: '60', name: '1 minute', description: 'Detailed explanations and demos' },
    { id: '120', name: '2 minutes', description: 'In-depth content and tutorials' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    // Simulate longer generation time for video content
    const generationTime = mode === 'video' ? 8000 + Math.random() * 5000 : 3000 + Math.random() * 2000;

    setTimeout(() => {
      const mockContent = generateMockContent(prompt, selectedPlatform, mode, style);
      const mockImageUrl = mode !== 'text' ? generateMockImageUrl(selectedPlatform, style) : null;
      const mockVideoUrl = mode === 'video' ? generateMockVideoUrl(selectedPlatform, videoStyle) : null;
      
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        title: prompt,
        prompt: prompt,
        content: mockContent,
        imageUrl: mockImageUrl,
        videoUrl: mockVideoUrl,
        platform: selectedPlatform,
        mode,
        style,
        videoStyle: mode === 'video' ? videoStyle : undefined,
        videoDuration: mode === 'video' ? parseInt(videoDuration) : undefined,
        createdAt: new Date().toISOString(),
        wordCount: mockContent.split(' ').length,
        scheduled: false,
        published: false
      };

      dispatch({ type: 'ADD_GENERATED_CONTENT', payload: newContent });
      
      const aiModel = mode === 'video' ? 'Google Veo3' : 'Claude 3 Sonnet';
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { 
          message: `${mode === 'video' ? 'Video' : 'Content'} generated for ${platforms.find(p => p.id === selectedPlatform)?.name} with ${aiModel}!`, 
          type: 'success' 
        } 
      });
      
      setLastGenerated(newContent);
      setIsGenerating(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }, generationTime);
  };

  const generateMockContent = (prompt: string, platform: string, mode: string, style: string): string => {
    const styleModifiers = {
      professional: 'with a professional and expert tone',
      creative: 'with a creative and innovative approach',
      friendly: 'with a friendly and accessible tone',
      bold: 'with a bold and impactful message'
    };

    if (mode === 'video') {
      return `🎬 ${prompt} ${styleModifiers[style as keyof typeof styleModifiers]}

This AI-generated video showcases the power of modern technology in content creation. 

✨ Video highlights:
• Professional ${videoStyle} style
• ${videoDuration} seconds of engaging content
• Optimized for ${platforms.find(p => p.id === platform)?.name}
• Generated with Google Veo3 AI

Perfect for capturing your audience's attention and driving engagement!

#AIVideo #ContentCreation #${platform.charAt(0).toUpperCase() + platform.slice(1)} #Innovation`;
    }

    const modeContent = {
      text: {
        linkedin: `🚀 ${prompt} ${styleModifiers[style as keyof typeof styleModifiers]}

Artificial intelligence is revolutionizing how we work and create content. With Amazon Bedrock and Claude 3 Sonnet, we're entering a new era of personalization.

💡 Key takeaways:
• Intelligent automation of creative processes
• 300% improvement in team productivity
• Large-scale personalization with your own data
• Measurable ROI from the first months of use

Companies adopting generative AI gain a significant competitive advantage.

What do you think? Share your experience in the comments! 👇

#AI #Innovation #Marketing #DigitalTransformation #AmazonBedrock #Claude3`,

        facebook: `🎯 ${prompt} ${styleModifiers[style as keyof typeof styleModifiers]}

Did you know that generative AI can transform your content strategy?

✨ Here's what we discovered with Amazon Bedrock:
- 60% time savings on creation
- More consistent and personalized content
- 300% improved customer engagement
- Real-time sentiment analysis

The future of digital marketing is through artificial intelligence! 

👉 What do you think about this evolution? Tell us everything in the comments!

#Marketing #AI #Innovation #AmazonBedrock`,

        twitter: `🚀 ${prompt}

Generative AI with Amazon Bedrock is a game changer:
✅ +60% productivity
✅ Ultra-personalized content
✅ Positive ROI from day 30

The future of #marketing is here! 

#AI #Innovation #DigitalMarketing #AmazonBedrock #Claude3`,

        instagram: `✨ ${prompt} ✨

Artificial intelligence transforms our creativity! 🎨

🔥 What excites us with Amazon Bedrock:
• Automated and personalized creation
• Real-time sentiment analysis  
• Instantly measurable results

Innovation doesn't wait! 💫

#AI #Innovation #Creativity #Marketing #Future #Tech #Digital #Inspiration #AmazonBedrock`
      },
      'text-image': {
        linkedin: `🚀 ${prompt} ${styleModifiers[style as keyof typeof styleModifiers]}

[Image: Modern illustration showing AI in action]

Artificial intelligence is revolutionizing how we create content. This image perfectly illustrates the harmony between human creativity and AI power.

💡 Discover how Amazon Bedrock transforms your strategy:
• Personalized content generation
• Predictive trend analysis
• Automatic platform optimization

#AI #Innovation #Marketing #AmazonBedrock`,

        facebook: `🎯 ${prompt}

[Image: Inspiring scene of team using AI]

This image captures the essence of digital transformation! 

✨ With Amazon Bedrock, we create content that truly resonates with your audience.

What inspires you most about this AI revolution? 💭

#Marketing #AI #Innovation`,

        twitter: `🚀 ${prompt}

[Image: AI data visualization]

Generative AI in action! 
✅ Personalized content
✅ Optimized engagement
✅ Measurable ROI

#AI #AmazonBedrock`,

        instagram: `✨ ${prompt} ✨

[Image: Aesthetic tech/AI scene]

When art meets artificial intelligence! 🎨✨

This image perfectly represents our vision: creating authentic content with the power of AI.

#AI #Art #Innovation #Tech #Creativity #AmazonBedrock`
      },
      image: {
        linkedin: `Innovation AI • Digital Transformation`,
        facebook: `The future of digital marketing 🚀`,
        twitter: `Generative AI in action ⚡`,
        instagram: `Creativity × Artificial Intelligence ✨`
      }
    };

    return modeContent[mode as keyof typeof modeContent][platform as keyof typeof modeContent.text] || modeContent.text.linkedin;
  };

  const generateMockImageUrl = (platform: string, style: string): string => {
    const imageCategories = {
      professional: 'business',
      creative: 'art',
      friendly: 'people',
      bold: 'technology'
    };

    const category = imageCategories[style as keyof typeof imageCategories] || 'business';
    return `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop&crop=center&auto=format&q=80`;
  };

  const generateMockVideoUrl = (platform: string, style: string): string => {
    // In production, this would return the actual video URL from Google Veo3 or OpenAI Sora
    return `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { message: 'Content copied to clipboard', type: 'success' } 
    });
  };

  const handleSchedulePost = () => {
    if (!scheduledDate || !scheduledTime) {
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { message: 'Please select date and time', type: 'error' } 
      });
      return;
    }

    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { message: `Post scheduled for ${scheduledDate} at ${scheduledTime}`, type: 'success' } 
    });
  };

  const handlePublishNow = () => {
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { message: `Content published on ${platforms.find(p => p.id === selectedPlatform)?.name}!`, type: 'success' } 
    });
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);
  const selectedModeData = modes.find(m => m.id === mode);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Creation Studio</h1>
        <p className="text-gray-600">Create personalized content with Amazon Bedrock, Claude 3 Sonnet & Google Veo3</p>
      </div>

      {/* Generation Mode */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Generation Mode
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((modeOption) => {
            const Icon = modeOption.icon;
            return (
              <button
                key={modeOption.id}
                onClick={() => setMode(modeOption.id as any)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all text-left
                  ${mode === modeOption.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${modeOption.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-gray-900">{modeOption.name}</h3>
                <p className="text-sm text-gray-600">{modeOption.description}</p>
                {modeOption.id === 'video' && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      <Play className="w-3 h-3" />
                      Google Veo3
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Platform Selection */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => {
            const isConnected = connectedPlatforms.some(acc => acc.platform === platform.id);
            const supportsCurrentMode = mode !== 'video' || platform.supportsVideo;
            return (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                disabled={!isConnected || !supportsCurrentMode}
                className={`
                  relative p-4 rounded-xl border-2 transition-all text-left
                  ${selectedPlatform === platform.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : isConnected && supportsCurrentMode
                      ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-xl flex items-center justify-center text-white text-xl mb-3`}>
                  {platform.icon}
                </div>
                <h3 className="font-medium text-gray-900">{platform.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{platform.description}</p>
                <p className="text-xs text-gray-500">Max: {platform.maxLength} characters</p>
                {mode === 'video' && platform.supportsVideo && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <Video className="w-3 h-3" />
                      Video Ready
                    </span>
                  </div>
                )}
                {!isConnected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-xl">
                    <span className="text-sm font-medium text-gray-500">Not connected</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
            
            {/* Style */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
              >
                {styles.map((styleOption) => (
                  <option key={styleOption.id} value={styleOption.id}>
                    {styleOption.name} - {styleOption.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Video-specific options */}
            {mode === 'video' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Style
                  </label>
                  <select
                    value={videoStyle}
                    onChange={(e) => setVideoStyle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                  >
                    {videoStyles.map((style) => (
                      <option key={style.id} value={style.id}>
                        {style.name} - {style.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Duration
                  </label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                  >
                    {videoDurations.map((duration) => (
                      <option key={duration.id} value={duration.id}>
                        {duration.name} - {duration.description}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Document source */}
            {availableDocuments.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Document (optional)
                </label>
                <select
                  value={selectedDocument}
                  onChange={(e) => setSelectedDocument(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                >
                  <option value="">No document selected</option>
                  {availableDocuments.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} {doc.confidence && `(${doc.confidence}% confidence)`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Prompt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic or Instruction
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Ex: Create a ${selectedModeData?.name.toLowerCase()} for ${selectedPlatformData?.name} about digital marketing trends...`}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 resize-none"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mode: {selectedModeData?.name} • Style: {styles.find(s => s.id === style)?.name}</span>
                <span>Max: {selectedPlatformData?.maxLength} characters</span>
              </div>
            </div>

            {/* Generation Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || !connectedPlatforms.some(acc => acc.platform === selectedPlatform)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'video' ? 'Generating with Google Veo3...' : 'Generating with Claude 3...'}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {mode === 'video' ? 'Generate with Veo3 AI' : 'Generate with Bedrock AI'}
                </>
              )}
            </button>
            
            {isGenerating && (
              <div className="mt-3 text-center">
                <div className="text-sm text-gray-600">
                  {mode === 'video' 
                    ? `🎬 Google Veo3 • ${videoStyle} style • ${videoDuration}s duration`
                    : `🤖 Amazon Bedrock • Claude 3 Sonnet • Mode ${selectedModeData?.name}`
                  }
                </div>
                {mode === 'video' && (
                  <div className="text-xs text-gray-500 mt-1">
                    Video generation may take 30-60 seconds
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        <div className="space-y-6">
          {lastGenerated ? (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${selectedPlatformData?.color} rounded-lg flex items-center justify-center text-white`}>
                      {selectedPlatformData?.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedPlatformData?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {lastGenerated.content.length} characters • {lastGenerated.wordCount} words
                        {lastGenerated.mode === 'video' && ` • ${lastGenerated.videoDuration}s video`}
                        {lastGenerated.mode !== 'text' && lastGenerated.mode !== 'video' && ' • With image'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(lastGenerated.content)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Publishing Actions */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-50 focus:border-blue-500"
                    />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-50 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handlePublishNow}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Publish Now
                    </button>
                    <button
                      onClick={handleSchedulePost}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Video Preview */}
                {lastGenerated.videoUrl && (
                  <div className="mb-4">
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                      <video
                        className="w-full h-48 object-cover"
                        controls
                        poster="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop&crop=center&auto=format&q=80"
                      >
                        <source src={lastGenerated.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {lastGenerated.videoDuration}s • {lastGenerated.videoStyle}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {lastGenerated.imageUrl && !lastGenerated.videoUrl && (
                  <div className="mb-4">
                    <img
                      src={lastGenerated.imageUrl}
                      alt="Generated content"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {lastGenerated.content}
                  </pre>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {lastGenerated.mode === 'video' ? (
                      <>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded">Google Veo3</span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{lastGenerated.videoStyle}</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{lastGenerated.videoDuration}s</span>
                      </>
                    ) : (
                      <>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Claude 3 Sonnet</span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{lastGenerated.mode}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{lastGenerated.style}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 text-center border border-blue-100">
              <div className={`w-16 h-16 bg-gradient-to-r ${selectedModeData?.color} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                {selectedModeData?.icon && <selectedModeData.icon className="w-8 h-8" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to create</h3>
              <p className="text-gray-600">
                Generate {selectedModeData?.name.toLowerCase()} content optimized for {selectedPlatformData?.name}
              </p>
              <div className="mt-4 text-sm text-blue-600 font-medium">
                {mode === 'video' 
                  ? '🎬 Powered by Google Veo3 AI Video Generation'
                  : '🤖 Powered by Amazon Bedrock & Claude 3 Sonnet'
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Content by Platform */}
      {state.generatedContent.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent content by platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.generatedContent.slice(0, 6).map((content) => {
              const platformData = platforms.find(p => p.id === content.platform);
              const modeData = modes.find(m => m.id === content.mode);
              return (
                <div key={content.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${platformData?.color || 'from-gray-400 to-gray-500'} rounded-lg flex items-center justify-center text-white text-sm`}>
                      {platformData?.icon || '📱'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{platformData?.name || 'Platform'}</span>
                    {content.scheduled && (
                      <Clock className="w-4 h-4 text-blue-500" title="Scheduled" />
                    )}
                    {content.videoUrl && (
                      <Video className="w-4 h-4 text-red-500" title="Video content" />
                    )}
                    {content.imageUrl && !content.videoUrl && (
                      <FileImage className="w-4 h-4 text-purple-500" title="With image" />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{content.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {content.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-1">
                      <span className="bg-gray-100 px-2 py-1 rounded">{content.mode}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{content.style}</span>
                      {content.mode === 'video' && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded">{content.videoDuration}s</span>
                      )}
                    </div>
                    <span>{new Date(content.createdAt).toLocaleDateString('en-US')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}