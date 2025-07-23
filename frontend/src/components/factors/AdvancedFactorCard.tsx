import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FactorDetail {
  name: string;
  value: number;
  description: string;
  impact: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
}

interface AdvancedFactorCardProps {
  title: string;
  score: number;
  icon: any;
  color: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  details: FactorDetail[];
  recommendations: string[];
  weight: number;
  industryBenchmark?: number;
  lastUpdated: string;
  nextUpdate: string;
}

export const AdvancedFactorCard = ({
  title,
  score,
  icon: Icon,
  color,
  description,
  trend,
  details,
  recommendations,
  weight,
  industryBenchmark,
  lastUpdated,
  nextUpdate
}: AdvancedFactorCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-danger" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-danger text-danger-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-success text-success-foreground';
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="glass-card hover-lift transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${color} relative`}>
                  <Icon className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {title}
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">{description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Weight: {(weight * 100).toFixed(0)}%
                    </Badge>
                    {industryBenchmark && (
                      <Badge variant="secondary" className="text-xs">
                        Benchmark: {industryBenchmark}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </span>
                  {getTrendIcon(trend)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {industryBenchmark && (
                    <span className={score > industryBenchmark ? 'text-success' : 'text-warning'}>
                      {score > industryBenchmark ? '+' : ''}{score - industryBenchmark} vs benchmark
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Score Progress Bar */}
            <div className="mb-4">
              <Progress value={score} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>100</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-lg font-semibold text-primary">
                  {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                  {Math.abs(Math.floor(Math.random() * 10) + 1)}
                </div>
                <div className="text-xs text-muted-foreground">30d Change</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-lg font-semibold text-primary">
                  {Math.floor(Math.random() * 5) + 1}d
                </div>
                <div className="text-xs text-muted-foreground">Next Update</div>
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center gap-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Show Details'}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>

            {/* Expanded Content */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4"
              >
                {/* Factor Details */}
                <div>
                  <h4 className="font-semibold mb-3">Factor Breakdown</h4>
                  <div className="space-y-3">
                    {details.map((detail, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{detail.name}</span>
                          <Badge className={`text-xs ${getImpactColor(detail.impact)}`}>
                            {detail.impact}
                          </Badge>
                          {getTrendIcon(detail.trend)}
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold ${getScoreColor(detail.value)}`}>
                            {detail.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold mb-3">Improvement Recommendations</h4>
                  <div className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-primary/10">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Report
                  </Button>
                  <Button size="sm" className="flex-1">
                    Improve Score
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};