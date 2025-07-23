import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  DollarSign, 
  Building, 
  User, 
  BarChart3,
  Lightbulb,
  Download,
  Share2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ScoreGauge } from '@/components/rive/ScoreGauge';
import { YECSScoreResult, LoanRecommendation } from '@/lib/ollamaClient';
import { useToast } from '@/hooks/use-toast';

interface DetailedYECSResultsProps {
  result: YECSScoreResult;
  userData: any;
  onStartOver: () => void;
  onViewDashboard: () => void;
}

export default function DetailedYECSResults({ 
  result, 
  userData, 
  onStartOver, 
  onViewDashboard 
}: DetailedYECSResultsProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [selectedLoan, setSelectedLoan] = useState<LoanRecommendation | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore(prev => {
          if (prev < result.score) {
            return Math.min(prev + 5, result.score);
          }
          clearInterval(interval);
          return result.score;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, [result.score]);

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 750) return 'Excellent - Prime for business loans';
    if (score >= 700) return 'Very Good - Great financing options';
    if (score >= 650) return 'Good - Competitive rates available';
    if (score >= 600) return 'Fair - Moderate financing options';
    return 'Poor - Consider improving profile';
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Your detailed YECS report has been saved to your downloads.",
    });
  };

  const handleShareScore = () => {
    navigator.clipboard.writeText(`I just got my YECS Score: ${result.score}! Check out your entrepreneurial credit score at [Your App URL]`);
    toast({
      title: "Score Shared",
      description: "Score details copied to clipboard!",
    });
  };

  const FactorCard = ({ title, score, description, icon: Icon }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-card to-card/50 p-4 rounded-lg border"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <span className="font-medium">{title}</span>
        </div>
        <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
          {score}/100
        </Badge>
      </div>
      <Progress value={score} className="mb-2" />
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );

  const LoanCard = ({ loan, isSelected, onClick }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-lg' 
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">{loan.bank}</h4>
        <Badge variant={
          loan.eligibility === 'high' ? 'default' : 
          loan.eligibility === 'medium' ? 'secondary' : 'destructive'
        }>
          {loan.eligibility} eligibility
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Interest Rate</span>
          <p className="font-bold text-lg text-primary">{loan.interestRate}%</p>
        </div>
        <div>
          <span className="text-muted-foreground">Max Amount</span>
          <p className="font-bold">${loan.maxLoanAmount.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Monthly Payment</span>
          <p className="font-medium">${loan.monthlyPayment.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Terms</span>
          <p className="font-medium text-xs">{loan.terms}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Your YECS Score Results</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive Entrepreneurial Credit Analysis
          </p>
        </motion.div>

        {/* Score Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="shadow-xl bg-gradient-to-br from-card to-primary/5">
            <CardContent className="pt-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <ScoreGauge 
                    score={animatedScore} 
                    maxScore={850} 
                    riskLevel={result.riskLevel}
                    animated={true}
                    size="lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      <span className={getScoreColor(result.score)}>
                        {animatedScore}
                      </span>
                      <span className="text-muted-foreground">/850</span>
                    </h2>
                    <p className="text-lg font-medium mb-1">
                      Credit Grade: <Badge className="ml-2">{result.creditGrade}</Badge>
                    </p>
                    <p className="text-muted-foreground">{getScoreDescription(result.score)}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {result.riskLevel === 'low' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {result.riskLevel === 'medium' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                    {result.riskLevel === 'high' && <AlertCircle className="w-5 h-5 text-red-600" />}
                    <span className="font-medium capitalize">{result.riskLevel} Risk Level</span>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={handleDownloadReport} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    <Button onClick={handleShareScore} variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Score
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="factors">Score Factors</TabsTrigger>
            <TabsTrigger value="loans">Loan Options</TabsTrigger>
            <TabsTrigger value="recommendations">Improve Score</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI-Powered Analysis
                  </CardTitle>
                  <CardDescription>
                    Comprehensive assessment of your entrepreneurial credit profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {result.analysis}
                    </p>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Strengths</h4>
                      <p className="text-sm text-muted-foreground">
                        {result.score >= 700 ? 'Strong financial profile' : 'Potential for growth'}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Market Position</h4>
                      <p className="text-sm text-muted-foreground">
                        {result.riskLevel === 'low' ? 'Top tier borrower' : 'Room for improvement'}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                      <Lightbulb className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Potential</h4>
                      <p className="text-sm text-muted-foreground">
                        High entrepreneurial capacity
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="factors" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-4"
            >
              <FactorCard
                title="Income Stability"
                score={Math.round(result.factors.income)}
                description="Based on your annual income and employment history"
                icon={DollarSign}
              />
              <FactorCard
                title="Age Factor"
                score={Math.round(result.factors.age)}
                description="Optimal entrepreneurial age range consideration"
                icon={User}
              />
              <FactorCard
                title="Employment Length"
                score={Math.round(result.factors.employmentLength)}
                description="Work experience and stability indicator"
                icon={Building}
              />
              <FactorCard
                title="Home Ownership"
                score={Math.round(result.factors.homeOwnership)}
                description="Property ownership and financial responsibility"
                icon={Building}
              />
              <FactorCard
                title="Credit History"
                score={Math.round(result.factors.creditHistory)}
                description="Length and quality of credit management"
                icon={BarChart3}
              />
              <FactorCard
                title="Debt-to-Income"
                score={Math.round(result.factors.debtToIncome)}
                description="Loan amount relative to income capacity"
                icon={TrendingDown}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="loans" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Loan Recommendations</CardTitle>
                  <CardDescription>
                    Based on your YECS score and profile, here are your best financing options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {result.loanRecommendations.map((loan, index) => (
                      <LoanCard
                        key={index}
                        loan={loan}
                        isSelected={selectedLoan === loan}
                        onClick={() => setSelectedLoan(loan)}
                      />
                    ))}
                  </div>
                  
                  {selectedLoan && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-4 bg-primary/5 rounded-lg border"
                    >
                      <h4 className="font-semibold mb-3">Selected Loan Details</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Bank:</span>
                          <p className="font-medium">{selectedLoan.bank}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Interest Rate:</span>
                          <p className="font-medium">{selectedLoan.interestRate}% APR</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Loan Terms:</span>
                          <p className="font-medium">{selectedLoan.terms}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Eligibility:</span>
                          <p className="font-medium capitalize">{selectedLoan.eligibility}</p>
                        </div>
                      </div>
                      <Button className="mt-4 w-full">
                        Apply for This Loan
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Score Improvement Recommendations
                  </CardTitle>
                  <CardDescription>
                    Actionable steps to boost your YECS score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Increase Income Stability",
                        description: "Consider additional income streams or business ventures",
                        impact: "High",
                        timeframe: "6-12 months"
                      },
                      {
                        title: "Build Business Experience",
                        description: "Start small projects or side businesses to demonstrate entrepreneurial skills",
                        impact: "Medium",
                        timeframe: "3-6 months"
                      },
                      {
                        title: "Improve Credit History",
                        description: "Maintain consistent payment history and reduce credit utilization",
                        impact: "High",
                        timeframe: "3-12 months"
                      },
                      {
                        title: "Optimize Debt-to-Income Ratio",
                        description: "Pay down existing debts or increase income before applying",
                        impact: "Medium",
                        timeframe: "2-6 months"
                      }
                    ].map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <Badge variant={rec.impact === 'High' ? 'default' : 'secondary'}>
                            {rec.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Timeframe: {rec.timeframe}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            onClick={onViewDashboard}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            View Full Dashboard
          </Button>
          <Button onClick={onStartOver} variant="outline" size="lg">
            <RefreshCw className="w-5 h-5 mr-2" />
            Start New Assessment
          </Button>
        </motion.div>
      </div>
    </div>
  );
}