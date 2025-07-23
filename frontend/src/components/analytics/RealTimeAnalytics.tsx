import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Activity, Users, DollarSign, 
  Target, AlertTriangle, CheckCircle, Clock, Zap
} from 'lucide-react';

interface AnalyticsData {
  scoreHistory: Array<{ date: string; score: number; risk: string }>;
  factorTrends: Array<{ factor: string; current: number; previous: number; trend: string }>;
  industryComparison: Array<{ metric: string; user: number; industry: number; top10: number }>;
  predictiveMetrics: Array<{ metric: string; value: number; confidence: number; trend: string }>;
  riskFactors: Array<{ factor: string; impact: number; probability: number; severity: string }>;
}

const mockAnalyticsData: AnalyticsData = {
  scoreHistory: [
    { date: '2024-01', score: 720, risk: 'medium' },
    { date: '2024-02', score: 735, risk: 'medium' },
    { date: '2024-03', score: 742, risk: 'medium' },
    { date: '2024-04', score: 758, risk: 'low' },
    { date: '2024-05', score: 774, risk: 'low' },
    { date: '2024-06', score: 782, risk: 'low' },
  ],
  factorTrends: [
    { factor: 'Financial', current: 85, previous: 82, trend: 'up' },
    { factor: 'Business', current: 74, previous: 68, trend: 'up' },
    { factor: 'Social', current: 71, previous: 73, trend: 'down' },
    { factor: 'Behavioral', current: 82, previous: 80, trend: 'up' },
    { factor: 'Education', current: 86, previous: 84, trend: 'up' },
  ],
  industryComparison: [
    { metric: 'Credit Score', user: 774, industry: 720, top10: 800 },
    { metric: 'Business Plan', user: 78, industry: 65, top10: 85 },
    { metric: 'Market Analysis', user: 72, industry: 68, top10: 82 },
    { metric: 'Financial Health', user: 85, industry: 75, top10: 90 },
  ],
  predictiveMetrics: [
    { metric: 'Success Probability', value: 78, confidence: 85, trend: 'up' },
    { metric: 'Funding Readiness', value: 72, confidence: 80, trend: 'up' },
    { metric: 'Market Fit', value: 80, confidence: 75, trend: 'stable' },
    { metric: 'Growth Potential', value: 85, confidence: 90, trend: 'up' },
  ],
  riskFactors: [
    { factor: 'Market Competition', impact: 65, probability: 70, severity: 'medium' },
    { factor: 'Regulatory Changes', impact: 45, probability: 40, severity: 'low' },
    { factor: 'Economic Downturn', impact: 80, probability: 30, severity: 'high' },
    { factor: 'Technology Disruption', impact: 60, probability: 60, severity: 'medium' },
  ]
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export const RealTimeAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        scoreHistory: prev.scoreHistory.map(item => ({
          ...item,
          score: item.score + Math.random() * 4 - 2
        }))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ title, value, trend, icon: Icon, color }: {
    title: string;
    value: number;
    trend: string;
    icon: any;
    color: string;
  }) => (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{value}</div>
            <div className={`text-xs flex items-center gap-1 ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted-foreground'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
               trend === 'down' ? <TrendingDown className="w-3 h-3" /> : 
               <Activity className="w-3 h-3" />}
              {trend}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Advanced insights and predictive analytics for your credit profile
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Live Data
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsLoading(true)}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Current Score"
          value={774}
          trend="up"
          icon={TrendingUp}
          color="bg-primary text-primary-foreground"
        />
        <MetricCard
          title="Risk Level"
          value={25}
          trend="down"
          icon={Target}
          color="bg-success text-success-foreground"
        />
        <MetricCard
          title="Improvement Rate"
          value={92}
          trend="up"
          icon={Zap}
          color="bg-warning text-warning-foreground"
        />
        <MetricCard
          title="Market Position"
          value={78}
          trend="stable"
          icon={Users}
          color="bg-accent text-accent-foreground"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Score History Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Score Evolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Factor Performance */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Factor Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.factorTrends.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{factor.factor}</span>
                      <Badge variant={factor.trend === 'up' ? 'default' : 'secondary'}>
                        {factor.trend === 'up' ? '↗' : factor.trend === 'down' ? '↘' : '→'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={factor.current} className="w-20 h-2" />
                      <span className="text-sm font-semibold">{factor.current}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Factor Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.factorTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="factor" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="current" fill="#8884d8" />
                  <Bar dataKey="previous" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Industry Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.industryComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="user" fill="#8884d8" name="You" />
                  <Bar dataKey="industry" fill="#82ca9d" name="Industry Avg" />
                  <Bar dataKey="top10" fill="#ffc658" name="Top 10%" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.predictiveMetrics.map((metric, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{metric.metric}</h3>
                    <Badge variant="outline">{metric.confidence}% confident</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Value</span>
                      <span className="font-bold">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.riskFactors.map((risk, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{risk.factor}</h4>
                      <Badge variant={
                        risk.severity === 'high' ? 'destructive' : 
                        risk.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {risk.severity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Impact</div>
                        <Progress value={risk.impact} className="h-2" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Probability</div>
                        <Progress value={risk.probability} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};