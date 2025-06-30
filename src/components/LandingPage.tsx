import React, { useState } from 'react';
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
  X
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "IA Générative Avancée",
      description: "Créez du contenu unique et engageant grâce à notre intelligence artificielle de pointe"
    },
    {
      icon: Target,
      title: "Optimisation Multi-Plateformes",
      description: "Contenu adapté automatiquement aux spécificités de chaque réseau social"
    },
    {
      icon: BarChart3,
      title: "Analyse des Sentiments",
      description: "Surveillez l'engagement et les réactions de votre audience en temps réel"
    },
    {
      icon: Calendar,
      title: "Planification Intelligente",
      description: "Programmez vos publications aux moments optimaux pour maximiser l'impact"
    },
    {
      icon: Shield,
      title: "Sécurité Garantie",
      description: "Vos données et comptes sociaux sont protégés par un chiffrement de niveau entreprise"
    },
    {
      icon: Rocket,
      title: "Croissance Accélérée",
      description: "Augmentez votre engagement de 300% en moyenne avec notre stratégie IA"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Directrice Marketing",
      company: "TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
      content: "SynthAI-Strategist a révolutionné notre stratégie de contenu. Nous avons triplé notre engagement en 3 mois !",
      rating: 5
    },
    {
      name: "Thomas Martin",
      role: "Fondateur",
      company: "StartupLab",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      content: "L'IA comprend parfaitement notre ton et notre audience. C'est comme avoir un expert marketing 24/7.",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "Community Manager",
      company: "BrandForce",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      content: "Fini les heures passées à créer du contenu. Je me concentre maintenant sur la stratégie !",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "29",
      period: "mois",
      description: "Parfait pour les entrepreneurs et petites entreprises",
      posts: "3 posts par réseau/semaine",
      features: [
        "3 posts par réseau social par semaine",
        "2 réseaux sociaux connectés",
        "Analyse des sentiments basique",
        "Templates de contenu",
        "Support par email",
        "Planification jusqu'à 7 jours"
      ],
      popular: false,
      color: "blue"
    },
    {
      name: "Professional",
      price: "79",
      period: "mois",
      description: "Idéal pour les équipes marketing en croissance",
      posts: "5 posts par réseau/semaine",
      features: [
        "5 posts par réseau social par semaine",
        "5 réseaux sociaux connectés",
        "Analyse avancée des sentiments",
        "Templates premium + personnalisés",
        "Support prioritaire",
        "Planification jusqu'à 30 jours",
        "Rapports détaillés",
        "Collaboration en équipe"
      ],
      popular: true,
      color: "purple"
    },
    {
      name: "Enterprise",
      price: "199",
      period: "mois",
      description: "Pour les grandes entreprises et agences",
      posts: "10 posts par réseau/semaine",
      features: [
        "10 posts par réseau social par semaine",
        "Réseaux sociaux illimités",
        "IA personnalisée pour votre marque",
        "Templates sur-mesure",
        "Support dédié 24/7",
        "Planification illimitée",
        "Analytics avancés",
        "API et intégrations",
        "Formation personnalisée",
        "Gestionnaire de compte dédié"
      ],
      popular: false,
      color: "emerald"
    }
  ];

  const stats = [
    { value: "10K+", label: "Entreprises actives" },
    { value: "2M+", label: "Posts générés" },
    { value: "300%", label: "Engagement moyen" },
    { value: "99.9%", label: "Uptime garanti" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">SynthAI-Strategist</h1>
                <p className="text-xs text-gray-500">Intelligence Artificielle</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Tarifs</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Témoignages</a>
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                Se connecter
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Fonctionnalités</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Tarifs</a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Témoignages</a>
                <button
                  onClick={onGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all w-fit"
                >
                  Se connecter
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Révolutionnez votre stratégie de contenu
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              L'IA qui transforme vos
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> idées</span>
              <br />
              en contenu viral
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Créez, planifiez et publiez du contenu engageant sur tous vos réseaux sociaux 
              grâce à notre intelligence artificielle de nouvelle génération.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all">
                Voir la démo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir SynthAI-Strategist ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre plateforme combine intelligence artificielle avancée et expertise marketing 
              pour maximiser votre impact sur les réseaux sociaux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group p-8 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Notre Vision</h2>
            <p className="text-xl leading-relaxed mb-8 opacity-90">
              Nous croyons que chaque entreprise mérite d'avoir une voix puissante sur les réseaux sociaux. 
              Notre mission est de démocratiser l'accès à un marketing de contenu de qualité professionnelle 
              grâce à l'intelligence artificielle.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Accessibilité</h3>
                <p className="opacity-80">Rendre l'IA accessible à tous, des startups aux grandes entreprises</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Excellence</h3>
                <p className="opacity-80">Fournir des outils de qualité professionnelle avec une expérience utilisateur exceptionnelle</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Impact</h3>
                <p className="opacity-80">Aider nos clients à créer des connexions authentiques avec leur audience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choisissez votre plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des tarifs transparents adaptés à vos besoins. Commencez gratuitement, 
              évoluez selon votre croissance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-2xl border-2 p-8 ${
                  plan.popular 
                    ? 'border-purple-500 shadow-xl scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                } transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Le plus populaire
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}€</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{plan.posts}</p>
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
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.popular ? 'Commencer maintenant' : 'Choisir ce plan'}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Toutes les formules incluent un essai gratuit de 14 jours</p>
            <p className="text-sm text-gray-500">
              Besoin d'une solution sur-mesure ? 
              <a href="#contact" className="text-blue-600 hover:text-blue-700 ml-1">Contactez-nous</a>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rejoignez des milliers d'entreprises qui font confiance à SynthAI-Strategist 
              pour leur stratégie de contenu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} • {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à révolutionner votre stratégie de contenu ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'entreprises qui utilisent déjà SynthAI-Strategist 
            pour créer du contenu engageant et développer leur audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white/30 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-xl transition-all">
              Planifier une démo
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
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">SynthAI-Strategist</h3>
                  <p className="text-sm text-gray-400">Intelligence Artificielle</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                La plateforme d'intelligence artificielle qui transforme votre stratégie de contenu 
                et maximise votre impact sur les réseaux sociaux.
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
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Statut</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 SynthAI-Strategist. Tous droits réservés.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
                <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}