import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Globe, Users, DollarSign, 
  BarChart3, Target, Zap, AlertTriangle, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface MarketData {
  industryTrends: {
    sector: string;
    growth: number;
    trend: 'up' | 'down' | 'stable';
    forecast: string;
    opportunities: string[];
    risks: string[];
  };
  competitorAnalysis: {
    position: number;
    totalCompetitors: number;
    strengths: string[];
    weaknesses: string[];
    marketShare: number;
  };
  fundingLandscape: {
    totalFunding: number;
    avgDealSize: number;
    activeInvestors: number;
    hotSectors: string[];
    fundingTrends: Array<{ quarter: string; amount: number }>;
  };
  economicIndicators: {
    gdpGrowth: number;
    inflationRate: number;
    interestRates: number;
    unemployment: number;
    consumerConfidence: number;
  };
}

const mockMarketData: MarketData = {
  industryTrends: {
    sector: 'Technology',
    growth: 15.2,
    trend: 'up',
    forecast: 'Strong growth expected through 2025',
    opportunities: [
      'AI/ML integration increasing demand',
      'Remote work solutions expanding',
      'Cybersecurity needs growing',
      'Green tech initiatives rising'
    ],
    risks: [
      'Regulatory uncertainty in AI',
      'Increased competition from big tech',
      'Economic slowdown concerns',
      'Talent acquisition challenges'
    ]
  },
  competitorAnalysis: {
    position: 78,
    totalCompetitors: 1250,
    strengths: [
      'Strong technical team',
      'Innovative product features',
      'Good customer retention',
      'Agile development process'
    ],
    weaknesses: [
      'Limited marketing budget',
      'Smaller customer base',
      'Fewer strategic partnerships',
      'Less brand recognition'
    ],
    marketShare: 2.3
  },
  fundingLandscape: {
    totalFunding: 2.4,
    avgDealSize: 1.8,
    activeInvestors: 340,
    hotSectors: ['AI/ML', 'Fintech', 'Healthcare', 'Climate Tech'],
    fundingTrends: [
      { quarter: 'Q1 2024', amount: 2.1 },
      { quarter: 'Q2 2024', amount: 2.4 },
      { quarter: 'Q3 2024', amount: 2.2 },
      { quarter: 'Q4 2024', amount: 2.4 }
    ]
  },
  economicIndicators: {
    gdpGrowth: 2.1,
    inflationRate: 3.2,
    interestRates: 5.25,
    unemployment: 3.8,
    consumerConfidence: 68
  }
};

export const MarketIntelligence = () => {
  const [data] = useState<MarketData>(mockMarketData);
  const [activeTab, setActiveTab] = useState('trends');

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    trend, 
    icon: Icon, 
    color 
  }: {
    title: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    icon: any;
    color: string;
  }) => (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1">
            {trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4 text-destructive" />}
            {trend === 'stable' && <BarChart3 className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <div className="text-2xl font-bold text-primary">
          {value}{unit}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Market Intelligence
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time market insights and competitive analysis
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Live Data
        </Badge>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Industry Growth"
          value={data.industryTrends.growth}
          unit="%"
          trend={data.industryTrends.trend}
          icon={TrendingUp}
          color="bg-success text-success-foreground"
        />
        <MetricCard
          title="Market Position"
          value={data.competitorAnalysis.position}
          unit=""
          trend="up"
          icon={Target}
          color="bg-primary text-primary-foreground"
        />
        <MetricCard
          title="Funding Available"
          value={data.fundingLandscape.totalFunding}
          unit="B"
          trend="up"
          icon={DollarSign}
          color="bg-warning text-warning-foreground"
        />
        <MetricCard
          title="Active Investors"
          value={data.fundingLandscape.activeInvestors}
          unit=""
          trend="stable"
          icon={Users}
          color="bg-accent text-accent-foreground"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Industry Trends</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="economic">Economic</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sector Overview */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Sector Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {data.industryTrends.growth}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {data.industryTrends.sector} Growth Rate
                    </div>
                  </div>
                  <Progress value={data.industryTrends.growth} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    {data.industryTrends.forecast}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.industryTrends.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risks */}
            <Card className="glass-card md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Market Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.industryTrends.risks.map((risk, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{risk}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competition" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market Position */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Market Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">
                    #{data.competitorAnalysis.position}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    out of {data.competitorAnalysis.totalCompetitors} competitors
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Market Share</span>
                      <span className="font-semibold">{data.competitorAnalysis.marketShare}%</span>
                    </div>
                    <Progress value={data.competitorAnalysis.marketShare} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SWOT Analysis */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>SWOT Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-success">Strengths</h4>
                    <div className="space-y-1">
                      {data.competitorAnalysis.strengths.slice(0, 2).map((strength, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-warning">Weaknesses</h4>
                    <div className="space-y-1">
                      {data.competitorAnalysis.weaknesses.slice(0, 2).map((weakness, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {weakness}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    ${data.fundingLandscape.totalFunding}B
                  </div>
                  <div className="text-sm text-muted-foreground">Total Available</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-success">
                    ${data.fundingLandscape.avgDealSize}M
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Deal Size</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <Users className="w-8 h-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold text-warning">
                    {data.fundingLandscape.activeInvestors}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Investors</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Hot Sectors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.fundingLandscape.hotSectors.map((sector, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {sector}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">GDP Growth</span>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="text-xl font-bold text-primary">
                  {data.economicIndicators.gdpGrowth}%
                </div>
                <Progress value={data.economicIndicators.gdpGrowth * 10} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Inflation Rate</span>
                  <TrendingUp className="w-4 h-4 text-warning" />
                </div>
                <div className="text-xl font-bold text-warning">
                  {data.economicIndicators.inflationRate}%
                </div>
                <Progress value={data.economicIndicators.inflationRate * 10} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Interest Rates</span>
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-xl font-bold text-primary">
                  {data.economicIndicators.interestRates}%
                </div>
                <Progress value={data.economicIndicators.interestRates * 10} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Unemployment</span>
                  <TrendingDown className="w-4 h-4 text-success" />
                </div>
                <div className="text-xl font-bold text-success">
                  {data.economicIndicators.unemployment}%
                </div>
                <Progress value={data.economicIndicators.unemployment * 10} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Consumer Confidence</span>
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xl font-bold text-primary">
                  {data.economicIndicators.consumerConfidence}
                </div>
                <Progress value={data.economicIndicators.consumerConfidence} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};