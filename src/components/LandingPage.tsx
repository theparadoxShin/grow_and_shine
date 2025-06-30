import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  Clock, 
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  BarChart3,
  MessageSquare,
  Calendar,
  Rocket,
  Award,
  Heart,
  Menu,
  X,
  FileText,
  Upload,
  Wand2,
  RotateCcw,
  Smile,
  TrendingDown,
  Eye,
  Play
} from 'lucide-react';
import boltImg from '../assets/images/bolt.png';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../utils/i18n';
import { useApp } from '../contexts/AppContext';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const { state } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { t } = useTranslation(state.language);
  

  const features = [
    {
      icon: FileText,
      title: "Your Documents = Your Voice",
      description: "Upload your business docs and watch our AI learn YOUR unique voice, tone, and expertise",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Wand2,
      title: "Smart Content Generation",
      description: "Generate authentic content that sounds like YOU wrote it - because our AI actually learned from your materials",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Multi-Platform Mastery",
      description: "One click → Perfect content for LinkedIn, Twitter, Instagram, Facebook with platform-specific optimization",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Real-Time Sentiment Analysis",
      description: "Monitor what people really think about your content with advanced AI sentiment tracking",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Calendar,
      title: "AI-Powered Scheduling",
      description: "Our AI finds the perfect times to post for maximum engagement based on your audience behavior",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Your business documents and social accounts are protected with bank-level encryption",
      gradient: "from-gray-500 to-slate-500"
    }
  ];

  const differentiators = [
    {
      icon: Upload,
      title: "Document-Powered AI",
      description: "First platform that learns from YOUR business documents",
      highlight: "UNIQUE"
    },
    {
      icon: Brain,
      title: "True Personalization",
      description: "Not generic AI - content that matches your exact brand voice",
      highlight: "EXCLUSIVE"
    },
    {
      icon: Zap,
      title: "Startup-Focused",
      description: "Built specifically for founders who need marketing without the expertise",
      highlight: "SPECIALIZED"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      company: "TechFlow Startup",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
      content: "Finally! An AI that actually understands our technical product. It learned from our documentation and now creates content that sounds like our team wrote it.",
      rating: 5,
      metric: "300% engagement increase"
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      company: "GrowthLab",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      content: "We went from confused about social media to confident marketers in 2 weeks. The AI learned our brand voice perfectly from our existing materials.",
      rating: 5,
      metric: "10 hours saved weekly"
    },
    {
      name: "Emma Thompson",
      role: "Co-Founder",
      company: "InnovateCorp",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      content: "Other tools create generic content. Grow&Shine creates content that's unmistakably OURS. The document upload feature is a game-changer.",
      rating: 5,
      metric: "5x content quality"
    }
  ];

  const pricingPlans = [
    {
      name: "Startup",
      price: "49",
      originalPrice: "99",
      period: "/month",
      description: "Perfect for early-stage startups",
      posts: "3 posts per network/week",
      features: [
        "Upload up to 10 business documents",
        "3 posts per social network per week",
        "3 connected social networks",
        "Basic sentiment analysis",
        "Document-trained AI voice",
        "Email support",
        "7-day content scheduling"
      ],
      popular: false,
      color: "blue",
      badge: "Early Bird"
    },
    {
      name: "Growth",
      price: "149",
      originalPrice: "299",
      period: "/month",
      description: "For scaling startups & SMEs",
      posts: "7 posts per network/week",
      features: [
        "Unlimited document uploads",
        "7 posts per social network per week",
        "All major social networks",
        "Advanced sentiment analysis + alerts",
        "Custom AI brand voice training",
        "Priority support + strategy calls",
        "30-day content scheduling",
        "Team collaboration tools",
        "Competitor sentiment tracking"
      ],
      popular: true,
      color: "purple",
      badge: "Most Popular"
    },
    {
      name: "Enterprise",
      price: "399",
      originalPrice: "799",
      period: "/month",
      description: "For established companies",
      posts: "Unlimited posts",
      features: [
        "Enterprise document processing",
        "Unlimited posts & networks",
        "Custom AI model training",
        "Advanced analytics dashboard",
        "White-label options",
        "24/7 dedicated support",
        "API access & integrations",
        "Custom workflows",
        "Advanced security compliance",
        "Dedicated account manager"
      ],
      popular: false,
      color: "emerald",
      badge: "Full Power"
    }
  ];

  const stats = [
    { value: "500+", label: "Startups using us", icon: Rocket },
    { value: "50K+", label: "Documents processed", icon: FileText },
    { value: "400%", label: "Avg. engagement boost", icon: TrendingUp },
    { value: "15min", label: "Setup time", icon: Clock }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Upload Your Documents",
      description: "Share your business docs, product guides, and materials",
      icon: Upload,
      color: "blue"
    },
    {
      step: "2", 
      title: "AI Learns Your Voice",
      description: "Our AI analyzes and learns your unique tone and expertise",
      icon: Brain,
      color: "purple"
    },
    {
      step: "3",
      title: "Generate Authentic Content",
      description: "Create content that sounds like you wrote it personally",
      icon: Wand2,
      color: "green"
    },
    {
      step: "4",
      title: "Publish & Analyze",
      description: "Schedule posts and track sentiment across all platforms",
      icon: BarChart3,
      color: "orange"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll animation
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100/50 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Grow&Shine</h1>
                <p className="text-xs text-gray-500">AI Marketing for Startups</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">How it Works</button>
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Pricing</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Success Stories</button>
              <LanguageSelector />
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
              >
                Start Free Trial
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <LanguageSelector />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top duration-200">
              <nav className="flex flex-col gap-4">
                <button onClick={() => scrollToSection('how-it-works')} className="text-left text-gray-600 hover:text-gray-900 transition-colors duration-200">How it Works</button>
                <button onClick={() => scrollToSection('features')} className="text-left text-gray-600 hover:text-gray-900 transition-colors duration-200">Features</button>
                <button onClick={() => scrollToSection('pricing')} className="text-left text-gray-600 hover:text-gray-900 transition-colors duration-200">Pricing</button>
                <button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 w-fit"
                >
                  Start Free Trial
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Problem Statement */}
            <div className="inline-flex items-center gap-2 bg-red-100/80 backdrop-blur-sm text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom duration-500">
              <TrendingDown className="w-4 h-4" />
              Struggling with generic AI content that doesn't sound like YOU?
            </div>

                        {/* Image droite - Badge bolt.new */}
      <div className="flex justify-center lg:justify-end absolute">
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:scale-105 transition-transform duration-300"
        >
          <img 
            src={boltImg}
            alt="Powered by bolt.new" 
            className="w-20 h-20 md:w-20 md:h-20 drop-shadow-lg"
          />
        </a>
      </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              Turn Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Business Documents</span><br />
              Into Marketing <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Magic</span>
            </h1>


            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-400">
              The first AI marketing platform that learns from <strong>YOUR business documents</strong> to create content that sounds authentically like your brand. No more generic AI - just content that's unmistakably <em>yours</em>.
            </p>

            {/* Unique Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
              {differentiators.map((diff, index) => {
                const Icon = diff.icon;
                return (
                  <div key={index} className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full font-bold">
                        {diff.highlight}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{diff.title}</h3>
                    <p className="text-sm text-gray-600">{diff.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in slide-in-from-bottom duration-700 delay-600">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                Start Free Trial - No Credit Card
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-gray-50 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch 2-Min Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-800">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="w-6 h-6 text-blue-600 mr-2" />
                      <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{stat.value}</div>
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            
          </div>
        </div>
      </section>
      

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From Confused to Confident in 4 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlike other platforms that give you generic content, we learn from YOUR materials to create content that's authentically yours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index} 
                  className="relative group animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Connection Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0" />
                  )}
                  
                  <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                      <div className="relative">
                        <Icon className="w-8 h-8 text-white" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                          {step.step}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-center">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom duration-700 delay-800">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
            >
              Start Your Transformation
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.whyChoose}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for founders who know their product inside-out but need help with marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="group p-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:border-blue-200 hover:shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Real Startups
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how founders like you transformed their marketing with document-powered AI.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Featured Testimonial */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-12 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl font-medium text-gray-900 mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <TrendingUp className="w-4 h-4" />
                  {testimonials[currentTestimonial].metric}
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                  <div className="text-blue-600 font-medium">{testimonials[currentTestimonial].company}</div>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="inline-flex items-center gap-2 bg-green-100/80 backdrop-blur-sm text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Rocket className="w-4 h-4" />
              Launch Special - 50% OFF First 6 Months
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pricing That Makes Sense for Startups
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No hidden fees. No surprise charges. Cancel anytime. 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-white/90 backdrop-blur-sm rounded-3xl border-2 p-8 transition-all duration-500 hover:shadow-2xl animate-in fade-in slide-in-from-bottom ${
                  plan.popular 
                    ? 'border-purple-500 shadow-2xl scale-105 hover:scale-110' 
                    : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold animate-pulse">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl text-gray-400 line-through">{plan.originalPrice}€</span>
                    <span className="text-5xl font-bold text-gray-900">{plan.price}€</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium mb-4">Save 50% for 6 months</p>
                  <p className="text-sm text-gray-500">{plan.posts}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom duration-700 delay-600">
            <p className="text-gray-600 mb-4">All plans include 14-day free trial • No credit card required</p>
            <p className="text-sm text-gray-500">
              Need custom enterprise features? 
              <button className="text-blue-600 hover:text-blue-700 ml-1 underline">Contact our team</button>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl font-bold mb-6 animate-in fade-in slide-in-from-bottom duration-700">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Join 500+ startups who stopped struggling with generic AI and started creating authentic content that converts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-400">
            <button
              onClick={onGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              Start Free Trial - No Credit Card
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white/30 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Grow&Shine</h3>
                  <p className="text-sm text-gray-400">AI Marketing for Startups</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The first AI marketing platform that learns from your business documents to create authentic content that converts. Built specifically for startups and SMEs.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">Features</button></li>
                <li><button className="hover:text-white transition-colors">Pricing</button></li>
                <li><button className="hover:text-white transition-colors">API</button></li>
                <li><button className="hover:text-white transition-colors">Integrations</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">Help Center</button></li>
                <li><button className="hover:text-white transition-colors">Documentation</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Status</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 Grow&Shine. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <button className="hover:text-white transition-colors">Privacy Policy</button>
                <button className="hover:text-white transition-colors">Terms of Service</button>
                <button className="hover:text-white transition-colors">Cookies</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}