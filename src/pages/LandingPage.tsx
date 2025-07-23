import React, { useState } from 'react';
import { ParticleBackground } from '@/components/three/ParticleBackground';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import UserRegistration, { UserData } from '@/components/registration/UserRegistration';
import ScoreCalculation from '@/components/loading/ScoreCalculation';
import DetailedYECSResults from '@/components/results/DetailedYECSResults';
import { ollamaClient, YECSScoreResult } from '@/lib/ollamaClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';

export default function LandingPage() {
  const [currentView, setCurrentView] = useState<'landing' | 'registration' | 'calculating' | 'results'>('landing');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [scoreResult, setScoreResult] = useState<YECSScoreResult | null>(null);
  const { toast } = useToast();

  const handleRegistrationComplete = async (data: UserData) => {
    setUserData(data);
    setCurrentView('calculating');
    
    try {
      const result = await ollamaClient.analyzeYECSScore(data);
      setScoreResult(result);
      setTimeout(() => setCurrentView('results'), 13000);
    } catch (error) {
      console.error('Error calculating score:', error);
      toast({
        title: "Calculation Error",
        description: "There was an issue calculating your score. Please try again.",
        variant: "destructive"
      });
      setCurrentView('registration');
    }
  };

  const handleStartOver = () => {
    setCurrentView('landing');
    setUserData(null);
    setScoreResult(null);
  };

  const handleViewDashboard = () => {
    window.location.href = '/dashboard';
  };

  const startRegistration = () => {
    setCurrentView('registration');
  };

  if (currentView === 'registration') {
    return <UserRegistration onComplete={handleRegistrationComplete} />;
  }

  if (currentView === 'calculating') {
    return <ScoreCalculation onComplete={() => setCurrentView('results')} />;
  }

  if (currentView === 'results' && scoreResult && userData) {
    return (
      <DetailedYECSResults
        result={scoreResult}
        userData={userData}
        onStartOver={handleStartOver}
        onViewDashboard={handleViewDashboard}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <ParticleBackground />
      
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
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={startRegistration}
            >
              Get Score
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <HeroSection onGetStarted={startRegistration} />
        <FeaturesSection />
        
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
                Join thousands of young entrepreneurs who've already discovered their true credit potential with AI-powered YECS scoring
              </p>
              
              <Button 
                size="lg" 
                className="gradient-primary hover-lift glow-primary px-8 py-4 text-lg"
                onClick={startRegistration}
              >
                Get Your YECS Score Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4">
                Free assessment • Ollama AI-powered • Instant loan recommendations
              </p>
            </div>
          </div>
        </section>
      </main>

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
                AI-powered credit scoring for young entrepreneurs. Built for MKE TECH FUSE.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-muted-foreground">
                <a href="#features" className="block hover:text-foreground transition-colors">Features</a>
                <a href="#" className="block hover:text-foreground transition-colors">AI Scoring</a>
                <a href="#" className="block hover:text-foreground transition-colors">API</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">About</a>
                <a href="#" className="block hover:text-foreground transition-colors">MKE TECH FUSE</a>
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