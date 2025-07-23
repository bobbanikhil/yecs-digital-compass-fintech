import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, User, Briefcase, DollarSign, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface UserData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  
  // Financial Information
  income: number;
  employmentLength: number;
  homeOwnership: 'RENT' | 'OWN' | 'MORTGAGE' | 'OTHER';
  creditHistory: number;
  
  // Business Information
  businessExperience: number;
  industry: string;
  businessStage: 'idea' | 'startup' | 'growth' | 'established';
  loanIntent: 'PERSONAL' | 'EDUCATION' | 'MEDICAL' | 'VENTURE' | 'HOMEIMPROVEMENT' | 'DEBTCONSOLIDATION';
  loanAmount: number;
  
  // Education & Background
  education: 'high_school' | 'associates' | 'bachelors' | 'masters' | 'phd';
  businessPlan: string;
}

interface UserRegistrationProps {
  onComplete: (userData: UserData) => void;
}

const steps = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Basic personal details' },
  { id: 2, title: 'Financial Profile', icon: DollarSign, description: 'Income and financial status' },
  { id: 3, title: 'Business Details', icon: Briefcase, description: 'Business experience and goals' },
  { id: 4, title: 'Loan Information', icon: Building, description: 'Loan requirements and purpose' },
];

export default function UserRegistration({ onComplete }: UserRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: 25,
    income: 50000,
    employmentLength: 2,
    homeOwnership: 'RENT',
    creditHistory: 3,
    businessExperience: 0,
    industry: '',
    businessStage: 'idea',
    loanIntent: 'VENTURE',
    loanAmount: 25000,
    education: 'bachelors',
    businessPlan: ''
  });

  const { toast } = useToast();

  const updateField = (field: keyof UserData, value: any) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!userData.firstName || !userData.lastName || !userData.email) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required personal information fields.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2:
        if (!userData.income || userData.income < 10000) {
          toast({
            title: "Invalid Income",
            description: "Please enter a valid annual income.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3:
        if (!userData.industry) {
          toast({
            title: "Missing Industry",
            description: "Please select your industry.",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      onComplete(userData);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="John"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Doe"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john.doe@example.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={userData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="age">Age: {userData.age}</Label>
              <Slider
                value={[userData.age]}
                onValueChange={(value) => updateField('age', value[0])}
                min={18}
                max={80}
                step={1}
                className="mt-2"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="income">Annual Income: ${userData.income.toLocaleString()}</Label>
              <Slider
                value={[userData.income]}
                onValueChange={(value) => updateField('income', value[0])}
                min={10000}
                max={500000}
                step={5000}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="employmentLength">Employment Length: {userData.employmentLength} years</Label>
              <Slider
                value={[userData.employmentLength]}
                onValueChange={(value) => updateField('employmentLength', value[0])}
                min={0}
                max={20}
                step={0.5}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="homeOwnership">Home Ownership</Label>
              <Select value={userData.homeOwnership} onValueChange={(value) => updateField('homeOwnership', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select home ownership status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RENT">Rent</SelectItem>
                  <SelectItem value="OWN">Own</SelectItem>
                  <SelectItem value="MORTGAGE">Mortgage</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="creditHistory">Credit History: {userData.creditHistory} years</Label>
              <Slider
                value={[userData.creditHistory]}
                onValueChange={(value) => updateField('creditHistory', value[0])}
                min={0}
                max={20}
                step={0.5}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="education">Education Level</Label>
              <Select value={userData.education} onValueChange={(value) => updateField('education', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="associates">Associate's Degree</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select value={userData.industry} onValueChange={(value) => updateField('industry', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="food_service">Food Service</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="businessExperience">Business Experience: {userData.businessExperience} years</Label>
              <Slider
                value={[userData.businessExperience]}
                onValueChange={(value) => updateField('businessExperience', value[0])}
                min={0}
                max={20}
                step={0.5}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="businessStage">Business Stage</Label>
              <Select value={userData.businessStage} onValueChange={(value) => updateField('businessStage', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select business stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea Stage</SelectItem>
                  <SelectItem value="startup">Startup (0-2 years)</SelectItem>
                  <SelectItem value="growth">Growth Stage (2-5 years)</SelectItem>
                  <SelectItem value="established">Established (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="businessPlan">Business Plan/Description</Label>
              <Textarea
                id="businessPlan"
                value={userData.businessPlan}
                onChange={(e) => updateField('businessPlan', e.target.value)}
                placeholder="Describe your business idea or current business..."
                className="mt-1 min-h-[100px]"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="loanIntent">Loan Purpose</Label>
              <Select value={userData.loanIntent} onValueChange={(value) => updateField('loanIntent', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select loan purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VENTURE">Business Venture</SelectItem>
                  <SelectItem value="PERSONAL">Personal</SelectItem>
                  <SelectItem value="EDUCATION">Education</SelectItem>
                  <SelectItem value="MEDICAL">Medical</SelectItem>
                  <SelectItem value="HOMEIMPROVEMENT">Home Improvement</SelectItem>
                  <SelectItem value="DEBTCONSOLIDATION">Debt Consolidation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="loanAmount">Loan Amount: ${userData.loanAmount.toLocaleString()}</Label>
              <Slider
                value={[userData.loanAmount]}
                onValueChange={(value) => updateField('loanAmount', value[0])}
                min={1000}
                max={500000}
                step={1000}
                className="mt-2"
              />
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Application Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Age:</span>
                  <p className="font-medium">{userData.age} years</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Income:</span>
                  <p className="font-medium">${userData.income.toLocaleString()}/year</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Industry:</span>
                  <p className="font-medium capitalize">{userData.industry.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Loan Amount:</span>
                  <p className="font-medium">${userData.loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Purpose:</span>
                  <p className="font-medium capitalize">{userData.loanIntent.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center mb-4">
            YECS Registration
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Complete your profile to get your personalized entrepreneurial credit score
          </p>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2 mb-4" />
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      currentStep >= step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <steps[currentStep - 1].icon className="w-6 h-6" />
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="flex items-center gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Get My YECS Score
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}