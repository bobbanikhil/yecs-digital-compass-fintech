import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, TrendingUp, Shield, DollarSign, Users, Activity, 
  Settings, HelpCircle, Brain, Target, Zap, BarChart3, Sparkles,
  RefreshCw, Download, Share2, Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScoreGauge } from '@/components/rive/ScoreGauge';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { AdvancedFactorCard } from '@/components/factors/AdvancedFactorCard';
import { useAdvancedYECSScore } from '@/hooks/useAdvancedYECSScore';
import { RealTimeAnalytics } from '@/components/analytics/RealTimeAnalytics';
import { SmartNotifications } from '@/components/notifications/SmartNotifications';
import { MarketIntelligence } from '@/components/insights/MarketIntelligence';

const PredictiveMetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  description, 
  trend 
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  description: string;
  trend: number;
}) => (
  <Card className="glass-card hover-lift">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <Badge variant={trend > 0 ? "default" : "secondary"}>
          {trend > 0 ? "+" : ""}{trend}%
        </Badge>
      </div>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <div className="text-2xl font-bold text-primary mb-1">
        {(value * 100).toFixed(0)}%
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <Progress value={value * 100} className="mt-2 h-1" />
    </CardContent>
  </Card>
);

export const AdvancedYECSDashboard = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { 
    score, 
    isLoading, 
    error, 
    refreshScore,
    getFactorInsights,
    getImprovementSuggestions
  } = useAdvancedYECSScore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Analyzing your entrepreneurial profile...</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Processing alternative data sources</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center glass-card">
          <CardContent>
            <p className="text-lg text-destructive mb-4">Error loading dashboard</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshScore} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Advanced Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  YECS Advanced
                </h1>
                <p className="text-sm text-muted-foreground">
                  Next-Gen Entrepreneur Credit Intelligence
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Industry: {score?.industryContext.industry}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Grade: {score?.creditGrade}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={refreshScore}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={() => setIsPerformanceOpen(!isPerformanceOpen)}
                variant="glass"
                size="sm"
                className="gap-2"
              >
                <Activity className="w-4 h-4" />
                Analytics
              </Button>
              <Button
                onClick={() => setIsAIOpen(!isAIOpen)}
                variant="hero"
                className="gap-2"
              >
                <Brain className="w-4 h-4" />
                AI Advisor
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Enhanced Score Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score Gauge */}
              <div className="lg:col-span-1 text-center">
                <ScoreGauge
                  score={score?.score || 774}
                  riskLevel={score?.riskLevel || 'medium'}
                  animated={true}
                />
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date(score?.lastUpdated || Date.now()).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Next update: {new Date(score?.nextUpdate || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Advanced Metrics */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-success/20 to-success/10">
                    <div className="text-2xl font-bold text-success">
                      {score?.trends.score_change_30d || 23}
                    </div>
                    <div className="text-xs text-muted-foreground">30d Change</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-warning/20 to-warning/10">
                    <div className="text-2xl font-bold text-warning">
                      {score?.trends.score_change_90d || 45}
                    </div>
                    <div className="text-xs text-muted-foreground">90d Change</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <div className="text-2xl font-bold text-primary">
                      {score?.creditGrade || 'A-'}
                    </div>
                    <div className="text-xs text-muted-foreground">Credit Grade</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
                    <div className="text-2xl font-bold text-accent-foreground">
                      {Math.round((score?.trends.improvement_velocity || 0.85) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Velocity</div>
                  </div>
                </div>

                {/* Trend Analysis */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Consistency Score</span>
                    <span className="text-sm text-success">
                      {Math.round((score?.trends.consistency_score || 0.92) * 100)}%
                    </span>
                  </div>
                  <Progress value={(score?.trends.consistency_score || 0.92) * 100} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Predictive Analytics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Predictive Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <PredictiveMetricCard
              title="Success Probability"
              value={score?.predictions.success_probability || 0.78}
              icon={TrendingUp}
              color="bg-success text-success-foreground"
              description="Likelihood of business success"
              trend={8}
            />
            <PredictiveMetricCard
              title="Default Risk"
              value={1 - (score?.predictions.default_risk || 0.12)}
              icon={Shield}
              color="bg-warning text-warning-foreground"
              description="Credit default probability"
              trend={-3}
            />
            <PredictiveMetricCard
              title="Growth Potential"
              value={score?.predictions.growth_potential || 0.85}
              icon={BarChart3}
              color="bg-primary text-primary-foreground"
              description="Expected growth trajectory"
              trend={12}
            />
            <PredictiveMetricCard
              title="Funding Readiness"
              value={score?.predictions.funding_readiness || 0.72}
              icon={DollarSign}
              color="bg-accent text-accent-foreground"
              description="Investment readiness level"
              trend={5}
            />
            <PredictiveMetricCard
              title="Market Fit"
              value={score?.predictions.market_fit_score || 0.80}
              icon={Target}
              color="bg-secondary text-secondary-foreground"
              description="Product-market fit score"
              trend={15}
            />
          </div>
        </motion.section>

        {/* Enhanced Factor Breakdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Advanced Credit Factors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Factors */}
            <AdvancedFactorCard
              title="Financial Health"
              score={score?.factors.financial.score || 85}
              icon={DollarSign}
              color="bg-success text-success-foreground"
              description="Comprehensive financial stability assessment"
              trend="up"
              weight={0.25}
              industryBenchmark={78}
              details={[
                { name: "Income Stability", value: score?.factors.financial.income_stability || 88, description: "Consistency of income streams", impact: "high", trend: "up" },
                { name: "Cash Flow Health", value: score?.factors.financial.cash_flow_health || 82, description: "Cash flow management", impact: "high", trend: "stable" },
                { name: "Savings Rate", value: score?.factors.financial.savings_rate || 90, description: "Percentage of income saved", impact: "medium", trend: "up" },
                { name: "Debt-to-Income", value: score?.factors.financial.debt_to_income || 75, description: "Debt management efficiency", impact: "high", trend: "stable" }
              ]}
              recommendations={getFactorInsights("financial")}
              lastUpdated={score?.lastUpdated || new Date().toISOString()}
              nextUpdate={score?.nextUpdate || new Date().toISOString()}
            />

            <AdvancedFactorCard
              title="Business Assessment"
              score={score?.factors.business.score || 74}
              icon={Activity}
              color="bg-primary text-primary-foreground"
              description="Comprehensive business viability analysis"
              trend="up"
              weight={0.30}
              industryBenchmark={69}
              details={[
                { name: "Business Plan Quality", value: score?.factors.business.business_plan_quality || 78, description: "Comprehensive business strategy", impact: "high", trend: "up" },
                { name: "Market Analysis", value: score?.factors.business.market_analysis || 72, description: "Market opportunity assessment", impact: "high", trend: "stable" },
                { name: "Team Strength", value: score?.factors.business.team_strength || 68, description: "Team capabilities and experience", impact: "medium", trend: "up" },
                { name: "Execution Track Record", value: score?.factors.business.execution_track_record || 80, description: "Past execution success", impact: "high", trend: "up" }
              ]}
              recommendations={getFactorInsights("business")}
              lastUpdated={score?.lastUpdated || new Date().toISOString()}
              nextUpdate={score?.nextUpdate || new Date().toISOString()}
            />

            <AdvancedFactorCard
              title="Entrepreneurial Indicators"
              score={score?.factors.entrepreneurial.score || 79}
              icon={Brain}
              color="bg-accent text-accent-foreground"
              description="Entrepreneurial capability assessment"
              trend="up"
              weight={0.25}
              industryBenchmark={71}
              details={[
                { name: "Innovation Index", value: score?.factors.entrepreneurial.innovation_index || 82, description: "Innovation and creativity", impact: "high", trend: "up" },
                { name: "Market Validation", value: score?.factors.entrepreneurial.market_validation || 76, description: "Market demand validation", impact: "high", trend: "stable" },
                { name: "Leadership Potential", value: score?.factors.entrepreneurial.leadership_potential || 77, description: "Leadership capabilities", impact: "medium", trend: "up" },
                { name: "Adaptability Score", value: score?.factors.entrepreneurial.adaptability_score || 85, description: "Ability to adapt to change", impact: "high", trend: "up" }
              ]}
              recommendations={getFactorInsights("entrepreneurial")}
              lastUpdated={score?.lastUpdated || new Date().toISOString()}
              nextUpdate={score?.nextUpdate || new Date().toISOString()}
            />

            <AdvancedFactorCard
              title="Behavioral Finance"
              score={score?.factors.behavioral.score || 82}
              icon={Users}
              color="bg-secondary text-secondary-foreground"
              description="Financial behavior and patterns analysis"
              trend="stable"
              weight={0.20}
              industryBenchmark={75}
              details={[
                { name: "Transaction Patterns", value: score?.factors.behavioral.transaction_patterns || 85, description: "Spending pattern analysis", impact: "medium", trend: "stable" },
                { name: "Financial Discipline", value: score?.factors.behavioral.financial_discipline || 88, description: "Financial self-control", impact: "high", trend: "up" },
                { name: "Investment Behavior", value: score?.factors.behavioral.investment_behavior || 75, description: "Investment decision patterns", impact: "medium", trend: "stable" },
                { name: "Gig Economy Activity", value: score?.factors.behavioral.gig_economy_activity || 80, description: "Alternative income sources", impact: "low", trend: "up" }
              ]}
              recommendations={getFactorInsights("behavioral")}
              lastUpdated={score?.lastUpdated || new Date().toISOString()}
              nextUpdate={score?.nextUpdate || new Date().toISOString()}
            />
          </div>
        </motion.section>

        {/* AI-Powered Recommendations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI-Powered Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getImprovementSuggestions().map((suggestion, index) => (
              <Card key={index} className="glass-card hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">{suggestion}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        Take Action
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Industry Context */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-6">Industry Context & Benchmarks</h2>
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary mb-1">
                    {score?.industryContext.market_conditions || 75}
                  </div>
                  <div className="text-sm text-muted-foreground">Market Conditions</div>
                  <Progress value={score?.industryContext.market_conditions || 75} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-success mb-1">
                    {score?.industryContext.sector_growth || 85}
                  </div>
                  <div className="text-sm text-muted-foreground">Sector Growth</div>
                  <Progress value={score?.industryContext.sector_growth || 85} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-warning mb-1">
                    {score?.industryContext.competition_level || 70}
                  </div>
                  <div className="text-sm text-muted-foreground">Competition Level</div>
                  <Progress value={score?.industryContext.competition_level || 70} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-accent-foreground mb-1">
                    {score?.industryContext.regulatory_environment || 80}
                  </div>
                  <div className="text-sm text-muted-foreground">Regulatory Environment</div>
                  <Progress value={score?.industryContext.regulatory_environment || 80} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      {/* Enhanced AI Assistant */}
      <AIAssistant 
        isOpen={isAIOpen} 
        onToggle={() => setIsAIOpen(!isAIOpen)}
      />

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