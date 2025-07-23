import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp, Shield, DollarSign, Users, Activity, Settings, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreGauge } from '@/components/rive/ScoreGauge';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { useRealTimeScore } from '@/hooks/useRealTimeScore';

const FactorCard = ({ 
  title, 
  score, 
  icon: Icon, 
  color, 
  description, 
  trend 
}: {
  title: string;
  score: number;
  icon: any;
  color: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="glass-card p-6 hover-lift"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}>
        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {score}
      </Badge>
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    <div className="w-full bg-muted rounded-full h-2">
      <motion.div
        className={`h-2 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  </motion.div>
);

export const YECSDashboard = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { score, isLoading, error } = useRealTimeScore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading your credit profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-lg text-destructive mb-4">Error loading dashboard</p>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">YECS Dashboard</h1>
              <p className="text-sm text-muted-foreground">Young Entrepreneur Credit Score</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsPerformanceOpen(!isPerformanceOpen)}
                variant="glass"
                size="sm"
              >
                <Activity className="w-4 h-4 mr-2" />
                Performance
              </Button>
              <Button
                onClick={() => setIsAIOpen(!isAIOpen)}
                variant="hero"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Score Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="glass-card p-8 text-center">
            <ScoreGauge
              score={score?.score || 742}
              riskLevel={score?.riskLevel || 'medium'}
              animated={true}
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">85%</div>
                <div className="text-sm text-muted-foreground">Above Average</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">+23</div>
                <div className="text-sm text-muted-foreground">Points This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">A-</div>
                <div className="text-sm text-muted-foreground">Credit Grade</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Factor Breakdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-6">Credit Factors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FactorCard
              title="Financial Health"
              score={score?.factors?.financial || 85}
              icon={DollarSign}
              color="bg-success text-success-foreground"
              description="Income stability, cash flow, and savings patterns"
              trend="up"
            />
            <FactorCard
              title="Credit History"
              score={score?.factors?.credit || 78}
              icon={TrendingUp}
              color="bg-warning text-warning-foreground"
              description="Payment history, credit utilization, and account age"
              trend="stable"
            />
            <FactorCard
              title="Identity Verification"
              score={score?.factors?.identity || 92}
              icon={Shield}
              color="bg-success text-success-foreground"
              description="Identity validation, document verification, and fraud detection"
              trend="up"
            />
            <FactorCard
              title="Business Profile"
              score={score?.factors?.business || 65}
              icon={Activity}
              color="bg-danger text-danger-foreground"
              description="Business plan quality, market analysis, and growth potential"
              trend="down"
            />
            <FactorCard
              title="Social Verification"
              score={score?.factors?.social || 71}
              icon={Users}
              color="bg-warning text-warning-foreground"
              description="Professional network, online presence, and reputation"
              trend="stable"
            />
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          <div className="glass-card p-6">
            <div className="space-y-4">
              {[
                { action: 'Credit report updated', time: '2 hours ago', impact: '+5 points' },
                { action: 'Bank account verified', time: '1 day ago', impact: '+12 points' },
                { action: 'Business plan analyzed', time: '3 days ago', impact: '+8 points' },
                { action: 'Identity documents verified', time: '1 week ago', impact: '+15 points' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-success">
                    {activity.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Recommendations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-6">Personalized Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Improve Business Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Your business factor score is below average. Consider updating your business plan and market analysis.
                </p>
                <Button className="w-full">Update Business Plan</Button>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Optimize Credit Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Reduce your credit utilization below 30% to improve your credit history score.
                </p>
                <Button className="w-full">View Credit Cards</Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </main>

      {/* AI Assistant */}
      <AIAssistant isOpen={isAIOpen} onToggle={() => setIsAIOpen(!isAIOpen)} />

      {/* Floating Actions */}
      <FloatingActions
        onAIToggle={() => setIsAIOpen(!isAIOpen)}
        onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)}
        onHelpToggle={() => setIsHelpOpen(!isHelpOpen)}
      />

      {/* Performance Monitor */}
      <PerformanceMonitor
        isVisible={isPerformanceOpen}
        position="top-right"
        compact={false}
      />
    </div>
  );
};