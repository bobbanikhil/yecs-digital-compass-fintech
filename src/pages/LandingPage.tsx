import { useState } from 'react';
import { ParticleBackground } from '@/components/three/ParticleBackground';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { SmartOnboarding } from '@/components/onboarding/SmartOnboarding';
import { ScoreResults } from '@/components/results/ScoreResults';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';

export default function LandingPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userScore, setUserScore] = useState(0);

  const handleOnboardingComplete = (data: any, score: number) => {
    setUserData(data);
    setUserScore(score);
    setShowOnboarding(false);
    setShowResults(true);
  };

  const handleStartOver = () => {
    setShowResults(false);
    setShowOnboarding(false);
    setUserData(null);
    setUserScore(0);
  };

  const scrollToOnboarding = () => {
    setShowOnboarding(true);
    setTimeout(() => {
      document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-primary/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-xl font-bold text-gradient">YECS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#onboarding" className="text-muted-foreground hover:text-foreground transition-colors">
              Get Score
            </a>
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => window.open('/dashboard', '_blank')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Onboarding Section */}
        {showOnboarding && (
          <SmartOnboarding onComplete={handleOnboardingComplete} />
        )}
        
        {/* Results Section */}
        {showResults && userData && (
          <ScoreResults 
            score={userScore} 
            userData={userData} 
            onStartOver={handleStartOver}
          />
        )}
        
        {/* CTA Section */}
        {!showOnboarding && !showResults && (
          <section className="py-20 relative">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-6 px-4 py-2 glass-button">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  MKE TECH FUSE Workshop
                </Badge>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Disrupt Finance?
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8">
                  Join thousands of young entrepreneurs who've already discovered their true credit potential
                </p>
                
                <Button 
                  size="lg" 
                  className="gradient-primary hover-lift glow-primary px-8 py-4 text-lg"
                  onClick={scrollToOnboarding}
                >
                  Get Your YECS Score Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Free assessment • No credit check required • Instant results
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Y</span>
                </div>
                <span className="text-xl font-bold text-gradient">YECS</span>
              </div>
              <p className="text-muted-foreground">
                Revolutionizing credit scoring for young entrepreneurs worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-muted-foreground">
                <a href="#features" className="block hover:text-foreground transition-colors">Features</a>
                <a href="#" className="block hover:text-foreground transition-colors">Pricing</a>
                <a href="#" className="block hover:text-foreground transition-colors">API</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">About</a>
                <a href="#" className="block hover:text-foreground transition-colors">Blog</a>
                <a href="#" className="block hover:text-foreground transition-colors">Careers</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2024 YECS. Built for MKE TECH FUSE Workshop.
            </p>
            <div className="flex gap-6 text-muted-foreground mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}