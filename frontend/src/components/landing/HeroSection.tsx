import { ArrowRight, Shield, TrendingUp, Zap, Brain, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 gradient-primary rounded-full opacity-20 animate-float" />
      <div className="absolute bottom-20 right-20 w-24 h-24 gradient-success rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-10 w-16 h-16 gradient-warning rounded-full opacity-25 animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge */}
          <Badge className="mb-6 px-6 py-2 glass-button border-primary/30 text-primary-glow animate-scale-in">
            <Zap className="w-4 h-4 mr-2" />
            MKE TECH FUSE Workshop Project
          </Badge>
          
          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-slide-up">
            <span className="text-gradient">YECS</span>
            <br />
            <span className="text-foreground">Credit Revolution</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            AI-powered credit scoring for young entrepreneurs. Get an unbiased score in minutes, 
            not months. Disrupt traditional finance with real-time predictive analytics.
          </p>
          
          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="glass-card p-6 hover-lift animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Brain className="w-10 h-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">Machine learning algorithms analyze 50+ data points</p>
            </div>
            
            <div className="glass-card p-6 hover-lift animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <Shield className="w-10 h-10 text-success mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Unbiased</h3>
              <p className="text-muted-foreground">Fair scoring without traditional credit barriers</p>
            </div>
            
            <div className="glass-card p-6 hover-lift animate-scale-in" style={{ animationDelay: '0.8s' }}>
              <TrendingUp className="w-10 h-10 text-warning mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Real-Time</h3>
              <p className="text-muted-foreground">Instant scoring and continuous improvement tracking</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '1s' }}>
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg gradient-primary hover-lift glow-primary"
              onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Your Score Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg glass-button"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Globe className="mr-2 w-5 h-5" />
              Learn More
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-muted-foreground animate-slide-up" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>95% Accuracy Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};