import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Building, 
  User,
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface ScoreCalculationProps {
  onComplete: () => void;
}

const calculationSteps = [
  {
    icon: User,
    title: 'Processing Personal Data',
    description: 'Analyzing demographic and personal factors',
    duration: 2000
  },
  {
    icon: DollarSign,
    title: 'Evaluating Financial Profile',
    description: 'Assessing income, employment, and financial stability',
    duration: 2500
  },
  {
    icon: Building,
    title: 'Business Analysis',
    description: 'Examining business experience and industry factors',
    duration: 2000
  },
  {
    icon: Brain,
    title: 'AI Risk Assessment',
    description: 'Running machine learning algorithms on credit dataset',
    duration: 3000
  },
  {
    icon: Calculator,
    title: 'Score Calculation',
    description: 'Computing final YECS score and recommendations',
    duration: 2000
  },
  {
    icon: TrendingUp,
    title: 'Generating Insights',
    description: 'Creating personalized loan recommendations',
    duration: 1500
  }
];

export default function ScoreCalculation({ onComplete }: ScoreCalculationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const totalDuration = calculationSteps.reduce((sum, step) => sum + step.duration, 0);
    let accumulatedTime = 0;
    
    const timers: NodeJS.Timeout[] = [];

    calculationSteps.forEach((step, index) => {
      accumulatedTime += step.duration;
      
      const stepTimer = setTimeout(() => {
        setCurrentStep(index);
        setProgress((accumulatedTime / totalDuration) * 100);
      }, accumulatedTime - step.duration);
      
      const completeTimer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
        
        if (index === calculationSteps.length - 1) {
          setTimeout(onComplete, 500);
        }
      }, accumulatedTime);
      
      timers.push(stepTimer, completeTimer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-white mb-6"
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-2">
            Calculating Your YECS Score
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Our AI is analyzing your data using advanced machine learning algorithms
          </p>
          
          <div className="mb-8">
            <Progress value={progress} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </p>
          </div>
        </motion.div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <div className="space-y-6">
              {calculationSteps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = completedSteps.includes(index);
                const isFuture = currentStep < index;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0.3, x: -20 }}
                    animate={{ 
                      opacity: isActive ? 1 : isCompleted ? 0.8 : 0.3,
                      x: 0,
                      scale: isActive ? 1.02 : 1
                    }}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20' 
                        : isCompleted
                        ? 'bg-green-50 dark:bg-green-950/20'
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                        ? 'bg-gradient-to-br from-primary to-secondary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <AnimatePresence mode="wait">
                        {isCompleted ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <CheckCircle className="w-6 h-6" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            animate={isActive ? { rotate: [0, 360] } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <step.icon className="w-6 h-6" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isActive ? 'text-primary' : isCompleted ? 'text-green-600' : ''
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Badge variant="secondary">Processing...</Badge>
                      </motion.div>
                    )}
                    
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Badge className="bg-green-500 hover:bg-green-600">Complete</Badge>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStep >= 3 ? 1 : 0 }}
              className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">AI Processing</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Analyzing patterns from 32,417 credit records using advanced machine learning to predict your entrepreneurial creditworthiness and loan approval probability.
              </p>
            </motion.div>
          </CardContent>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 80 ? 1 : 0 }}
          className="text-center mt-6"
        >
          <p className="text-muted-foreground">
            Almost done! Preparing your personalized score and recommendations...
          </p>
        </motion.div>
      </div>
    </div>
  );
}