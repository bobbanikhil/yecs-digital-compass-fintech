import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  Globe,
  AlertCircle,
  CheckCircle,
  Target,
  Sparkles,
  Code,
  DollarSign
} from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze 50+ data points to provide the most accurate credit assessment for young entrepreneurs.",
      benefits: ["Real-time processing", "Bias-free scoring", "Continuous learning"],
      gradient: "gradient-primary"
    },
    {
      icon: Shield,
      title: "Alternative Data Sources",
      description: "Beyond traditional credit history - we evaluate your digital footprint, education, business potential, and entrepreneurial activities.",
      benefits: ["GitHub activity", "Online certifications", "Social media presence"],
      gradient: "gradient-success"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get your credit score in minutes, not weeks. Our real-time assessment system provides immediate feedback and recommendations.",
      benefits: ["60-second assessment", "Immediate score", "Instant recommendations"],
      gradient: "gradient-warning"
    },
    {
      icon: TrendingUp,
      title: "Predictive Modeling",
      description: "Our AI doesn't just score your current state - it predicts your future success potential based on entrepreneurial indicators.",
      benefits: ["Success probability", "Growth trajectory", "Risk assessment"],
      gradient: "gradient-danger"
    },
    {
      icon: Users,
      title: "Peer Benchmarking",
      description: "Compare your score against other young entrepreneurs in your industry, location, and business stage for contextual insights.",
      benefits: ["Industry comparison", "Location-based insights", "Stage benchmarks"],
      gradient: "gradient-primary"
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Our platform works worldwide, helping young entrepreneurs from any country access fair and unbiased credit assessment.",
      benefits: ["Multi-language support", "Global standards", "Local adaptation"],
      gradient: "gradient-success"
    }
  ];

  const stats = [
    { number: "50+", label: "Data Points Analyzed", icon: Brain },
    { number: "95%", label: "Accuracy Rate", icon: Target },
    { number: "10K+", label: "Entrepreneurs Scored", icon: Users },
    { number: "<60s", label: "Average Assessment Time", icon: Zap }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 glass-button">
            <Sparkles className="w-4 h-4 mr-2" />
            Revolutionary Technology
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Next-Generation</span>
            <br />
            Credit Assessment
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powered by cutting-edge AI and alternative data sources, YECS provides the most comprehensive 
            and fair credit scoring system designed specifically for young entrepreneurs.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card border-primary/20 text-center hover-lift">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-primary/20 hover-lift group">
              <CardHeader>
                <div className={`w-12 h-12 rounded-full ${feature.gradient} flex items-center justify-center mb-4 group-hover:glow-primary transition-all duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">Built with Enterprise-Grade Technology</h3>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { name: "Machine Learning", icon: Brain, description: "TensorFlow & PyTorch" },
              { name: "Blockchain Security", icon: Shield, description: "Immutable scoring" },
              { name: "Real-time Processing", icon: Zap, description: "Edge computing" },
              { name: "API Integration", icon: Code, description: "RESTful & GraphQL" },
              { name: "Financial Standards", icon: DollarSign, description: "SOC 2 compliant" }
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center mx-auto mb-3 hover-lift">
                  <tech.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">{tech.name}</h4>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};