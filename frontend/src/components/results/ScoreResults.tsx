import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  AlertCircle, 
  CheckCircle, 
  Target,
  Brain,
  Sparkles,
  Download,
  Share2
} from 'lucide-react';

interface ScoreResultsProps {
  score: number;
  userData: any;
  onStartOver: () => void;
}

export const ScoreResults = ({ score, userData, onStartOver }: ScoreResultsProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore(prev => {
          if (prev >= score) {
            clearInterval(interval);
            return score;
          }
          return prev + Math.ceil((score - prev) / 10);
        });
      }, 50);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreLevel = (score: number) => {
    if (score >= 800) return { level: 'Excellent', color: 'success', description: 'Outstanding creditworthiness' };
    if (score >= 740) return { level: 'Very Good', color: 'primary', description: 'Strong credit profile' };
    if (score >= 670) return { level: 'Good', color: 'warning', description: 'Satisfactory credit standing' };
    if (score >= 580) return { level: 'Fair', color: 'warning', description: 'Some credit challenges' };
    return { level: 'Poor', color: 'danger', description: 'Significant credit improvements needed' };
  };

  const scoreInfo = getScoreLevel(score);
  const scorePercentage = ((score - 300) / (850 - 300)) * 100;

  const recommendations = [
    {
      icon: TrendingUp,
      title: "Strengthen Business Plan",
      description: "Develop a comprehensive business plan with market analysis",
      impact: "+25-40 points",
      priority: "High"
    },
    {
      icon: Target,
      title: "Build Digital Presence",
      description: "Create GitHub profile and showcase your projects",
      impact: "+15-30 points",
      priority: "Medium"
    },
    {
      icon: CheckCircle,
      title: "Establish Banking History",
      description: "Open business checking account and maintain good standing",
      impact: "+10-20 points",
      priority: "High"
    },
    {
      icon: Brain,
      title: "Complete Online Certifications",
      description: "Gain industry-relevant skills and certifications",
      impact: "+5-15 points",
      priority: "Low"
    }
  ];

  const factorBreakdown = [
    { name: 'Education & Skills', score: 85, weight: '20%' },
    { name: 'Financial Health', score: 72, weight: '25%' },
    { name: 'Business Readiness', score: 68, weight: '30%' },
    { name: 'Digital Footprint', score: 78, weight: '15%' },
    { name: 'Risk Assessment', score: 82, weight: '10%' }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 glass-button border-primary/30">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Analysis Complete
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Your YECS Score</h2>
            <p className="text-xl text-muted-foreground">
              Powered by advanced machine learning algorithms
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Score Display */}
            <div className="lg:col-span-1">
              <Card className="glass-card border-primary/20 text-center">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Credit Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-6">
                    <div className="text-6xl font-bold text-gradient mb-2">
                      {animatedScore}
                    </div>
                    <Badge className={`bg-${scoreInfo.color} text-${scoreInfo.color}-foreground`}>
                      {scoreInfo.level}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <Progress value={scorePercentage} className="h-3" />
                    <p className="text-muted-foreground">{scoreInfo.description}</p>
                    
                    <div className="flex justify-between text-sm">
                      <span>300</span>
                      <span>850</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button variant="outline" className="glass-button">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" className="glass-button">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Score
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Factor Breakdown */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-primary" />
                    Factor Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {factorBreakdown.map((factor, index) => (
                      <div key={factor.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{factor.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{factor.weight}</span>
                            <span className="font-bold">{factor.score}/100</span>
                          </div>
                        </div>
                        <Progress value={factor.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="glass-card border-primary/20 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-success" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover-lift">
                        <rec.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <Badge variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'default' : 'secondary'}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <span className="text-sm font-medium text-success">Potential Impact: {rec.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gradient-primary hover-lift px-8"
                onClick={() => window.open('/dashboard', '_blank')}
              >
                View Full Dashboard
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="glass-button px-8"
                onClick={onStartOver}
              >
                Start New Assessment
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Track your progress and get real-time updates as you improve your score
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};