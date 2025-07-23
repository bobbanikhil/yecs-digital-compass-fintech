import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, DollarSign, Building, User, GraduationCap, Code, Heart, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  // Personal Info
  name: string;
  age: number;
  education: string;
  location: string;
  
  // Financial Data
  monthlyIncome: number;
  savingsRate: number;
  existingCredit: boolean;
  bankingHistory: number;
  
  // Business Profile
  businessStage: string;
  industry: string;
  businessPlan: string;
  fundingNeeded: number;
  revenueProjection: number;
  
  // Digital Footprint
  githubActivity: boolean;
  socialMediaBusiness: boolean;
  onlineCourses: string[];
  freelanceExperience: boolean;
  
  // Goals & Vision
  businessGoals: string;
  timelineToLaunch: string;
  riskTolerance: number;
}

export const SmartOnboarding = ({ onComplete }: { onComplete: (data: OnboardingData, score: number) => void }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    age: 25,
    education: '',
    location: '',
    monthlyIncome: 0,
    savingsRate: 10,
    existingCredit: false,
    bankingHistory: 2,
    businessStage: '',
    industry: '',
    businessPlan: '',
    fundingNeeded: 0,
    revenueProjection: 0,
    githubActivity: false,
    socialMediaBusiness: false,
    onlineCourses: [],
    freelanceExperience: false,
    businessGoals: '',
    timelineToLaunch: '',
    riskTolerance: 5,
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      calculateScore();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const calculateScore = () => {
    // AI-powered scoring algorithm
    let score = 300; // Base score
    
    // Education Factor (0-150 points)
    const educationPoints = {
      'high_school': 50,
      'bachelors': 100,
      'masters': 130,
      'phd': 150,
      'bootcamp': 90,
      'self_taught': 70
    };
    score += educationPoints[data.education as keyof typeof educationPoints] || 0;

    // Financial Health (0-200 points)
    if (data.monthlyIncome > 0) {
      score += Math.min(data.monthlyIncome / 1000 * 10, 100); // Income factor
      score += data.savingsRate * 2; // Savings rate
      if (data.existingCredit) score += 30;
      score += data.bankingHistory * 10;
    }

    // Business Readiness (0-150 points)
    const businessStagePoints = {
      'idea': 30,
      'prototype': 60,
      'mvp': 90,
      'revenue': 120,
      'scaling': 150
    };
    score += businessStagePoints[data.businessStage as keyof typeof businessStagePoints] || 0;
    
    if (data.businessPlan.length > 100) score += 40;
    if (data.fundingNeeded > 0 && data.revenueProjection > data.fundingNeeded) score += 30;

    // Digital Presence (0-100 points)
    if (data.githubActivity) score += 30;
    if (data.socialMediaBusiness) score += 20;
    if (data.freelanceExperience) score += 25;
    score += data.onlineCourses.length * 5;

    // Risk Assessment (0-100 points)
    score += (10 - Math.abs(data.riskTolerance - 7)) * 10; // Optimal risk tolerance around 7

    // Age factor (young entrepreneurs bonus)
    if (data.age <= 30) score += 50;
    else if (data.age <= 35) score += 30;

    // Cap the score between 300-850 (credit score range)
    const finalScore = Math.min(Math.max(score, 300), 850);
    
    toast({
      title: "Score Calculated!",
      description: `Your YECS Score: ${finalScore}`,
    });

    onComplete(data, finalScore);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Personal Information</h3>
              <p className="text-muted-foreground">Let's start with the basics</p>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  value={data.name}
                  onChange={(e) => updateData('name', e.target.value)}
                  placeholder="John Doe"
                  className="glass-card"
                />
              </div>
              
              <div>
                <Label htmlFor="age">Age: {data.age}</Label>
                <Slider
                  value={[data.age]}
                  onValueChange={([value]) => updateData('age', value)}
                  max={65}
                  min={18}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="education">Education Level</Label>
                <Select value={data.education} onValueChange={(value) => updateData('education', value)}>
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="bootcamp">Coding Bootcamp</SelectItem>
                    <SelectItem value="self_taught">Self-Taught</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  value={data.location}
                  onChange={(e) => updateData('location', e.target.value)}
                  placeholder="Milwaukee, WI"
                  className="glass-card"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Financial Profile</h3>
              <p className="text-muted-foreground">Your current financial situation</p>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="income">Monthly Income ($)</Label>
                <Input 
                  id="income"
                  type="number"
                  value={data.monthlyIncome}
                  onChange={(e) => updateData('monthlyIncome', Number(e.target.value))}
                  placeholder="5000"
                  className="glass-card"
                />
              </div>
              
              <div>
                <Label htmlFor="savings">Savings Rate: {data.savingsRate}%</Label>
                <Slider
                  value={[data.savingsRate]}
                  onValueChange={([value]) => updateData('savingsRate', value)}
                  max={50}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="credit"
                  checked={data.existingCredit}
                  onCheckedChange={(checked) => updateData('existingCredit', checked)}
                />
                <Label htmlFor="credit">I have existing credit history</Label>
              </div>
              
              <div>
                <Label htmlFor="banking">Banking History: {data.bankingHistory} years</Label>
                <Slider
                  value={[data.bankingHistory]}
                  onValueChange={([value]) => updateData('bankingHistory', value)}
                  max={20}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-12 h-12 text-warning mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Business Profile</h3>
              <p className="text-muted-foreground">Tell us about your entrepreneurial journey</p>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="stage">Business Stage</Label>
                <Select value={data.businessStage} onValueChange={(value) => updateData('businessStage', value)}>
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Select business stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Just an Idea</SelectItem>
                    <SelectItem value="prototype">Building Prototype</SelectItem>
                    <SelectItem value="mvp">MVP Ready</SelectItem>
                    <SelectItem value="revenue">Generating Revenue</SelectItem>
                    <SelectItem value="scaling">Scaling Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry"
                  value={data.industry}
                  onChange={(e) => updateData('industry', e.target.value)}
                  placeholder="e.g., Fintech, E-commerce, SaaS"
                  className="glass-card"
                />
              </div>
              
              <div>
                <Label htmlFor="plan">Business Plan Summary</Label>
                <Textarea 
                  id="plan"
                  value={data.businessPlan}
                  onChange={(e) => updateData('businessPlan', e.target.value)}
                  placeholder="Describe your business idea, target market, and value proposition..."
                  className="glass-card min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="funding">Funding Needed ($)</Label>
                  <Input 
                    id="funding"
                    type="number"
                    value={data.fundingNeeded}
                    onChange={(e) => updateData('fundingNeeded', Number(e.target.value))}
                    placeholder="50000"
                    className="glass-card"
                  />
                </div>
                
                <div>
                  <Label htmlFor="revenue">12-Month Revenue Goal ($)</Label>
                  <Input 
                    id="revenue"
                    type="number"
                    value={data.revenueProjection}
                    onChange={(e) => updateData('revenueProjection', Number(e.target.value))}
                    placeholder="100000"
                    className="glass-card"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Code className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Digital Footprint</h3>
              <p className="text-muted-foreground">Your online presence and skills</p>
            </div>
            
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="github"
                  checked={data.githubActivity}
                  onCheckedChange={(checked) => updateData('githubActivity', checked)}
                />
                <Label htmlFor="github">Active GitHub profile</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="social"
                  checked={data.socialMediaBusiness}
                  onCheckedChange={(checked) => updateData('socialMediaBusiness', checked)}
                />
                <Label htmlFor="social">Business social media presence</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="freelance"
                  checked={data.freelanceExperience}
                  onCheckedChange={(checked) => updateData('freelanceExperience', checked)}
                />
                <Label htmlFor="freelance">Freelance/gig work experience</Label>
              </div>
              
              <div>
                <Label>Online Courses & Certifications</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Coursera', 'Udemy', 'edX', 'LinkedIn Learning', 'Codecademy', 'FreeCodeCamp'].map((course) => (
                    <div key={course} className="flex items-center space-x-2">
                      <Checkbox 
                        id={course}
                        checked={data.onlineCourses.includes(course)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateData('onlineCourses', [...data.onlineCourses, course]);
                          } else {
                            updateData('onlineCourses', data.onlineCourses.filter(c => c !== course));
                          }
                        }}
                      />
                      <Label htmlFor={course} className="text-sm">{course}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-danger mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Goals & Vision</h3>
              <p className="text-muted-foreground">Your entrepreneurial ambitions</p>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="goals">Business Goals</Label>
                <Textarea 
                  id="goals"
                  value={data.businessGoals}
                  onChange={(e) => updateData('businessGoals', e.target.value)}
                  placeholder="What do you want to achieve with your business?"
                  className="glass-card min-h-[80px]"
                />
              </div>
              
              <div>
                <Label htmlFor="timeline">Timeline to Launch</Label>
                <Select value={data.timelineToLaunch} onValueChange={(value) => updateData('timelineToLaunch', value)}>
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3_months">Within 3 months</SelectItem>
                    <SelectItem value="6_months">3-6 months</SelectItem>
                    <SelectItem value="1_year">6-12 months</SelectItem>
                    <SelectItem value="2_years">1-2 years</SelectItem>
                    <SelectItem value="long_term">Long-term planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="risk">Risk Tolerance: {data.riskTolerance}/10</Label>
                <Slider
                  value={[data.riskTolerance]}
                  onValueChange={([value]) => updateData('riskTolerance', value)}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="onboarding" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 glass-button">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Assessment
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gradient">
              Get Your YECS Score
            </h2>
            <p className="text-xl text-muted-foreground">
              Complete our smart assessment to receive your personalized credit score
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Form Card */}
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">
                Step {step}: {
                  step === 1 ? 'Personal Info' :
                  step === 2 ? 'Financial Profile' :
                  step === 3 ? 'Business Profile' :
                  step === 4 ? 'Digital Footprint' :
                  'Goals & Vision'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={step === 1}
                  className="glass-button"
                >
                  Previous
                </Button>
                
                <Button 
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !data.name) ||
                    (step === 3 && !data.businessStage) ||
                    (step === 5 && !data.timelineToLaunch)
                  }
                  className="gradient-primary hover-lift"
                >
                  {step === totalSteps ? 'Calculate Score' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};