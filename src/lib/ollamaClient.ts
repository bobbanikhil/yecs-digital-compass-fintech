import axios from 'axios';

export interface OllamaResponse {
  response: string;
  done: boolean;
  context?: number[];
}

export interface YECSScoreResult {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  creditGrade: string;
  loanRecommendations: LoanRecommendation[];
  analysis: string;
  factors: ScoreFactors;
}

export interface LoanRecommendation {
  bank: string;
  interestRate: number;
  maxLoanAmount: number;
  eligibility: 'high' | 'medium' | 'low';
  terms: string;
  monthlyPayment: number;
}

export interface ScoreFactors {
  income: number;
  age: number;
  employmentLength: number;
  homeOwnership: number;
  creditHistory: number;
  debtToIncome: number;
}

class OllamaClient {
  private baseURL = 'http://localhost:11434';
  private model = 'llama3.2:latest';

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}/api/generate`, {
        model: this.model,
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 1000
        }
      });

      return response.data.response;
    } catch (error) {
      console.error('Ollama API error:', error);
      throw new Error('Failed to connect to Ollama. Please ensure Ollama is running locally.');
    }
  }

  async analyzeYECSScore(userData: any): Promise<YECSScoreResult> {
    const prompt = `
As an AI financial analyst specializing in entrepreneurial credit scoring, analyze this user's data and provide a comprehensive YECS (Your Entrepreneurial Credit Score) assessment.

User Data:
- Age: ${userData.age}
- Annual Income: $${userData.income}
- Employment Length: ${userData.employmentLength} years
- Home Ownership: ${userData.homeOwnership}
- Business Experience: ${userData.businessExperience}
- Credit History: ${userData.creditHistory} years
- Loan Purpose: ${userData.loanIntent}
- Requested Amount: $${userData.loanAmount}
- Education Level: ${userData.education}
- Industry: ${userData.industry}
- Business Stage: ${userData.businessStage}

Based on the provided dataset patterns and financial analysis, calculate:
1. YECS Score (300-850 scale)
2. Risk Level (low/medium/high)
3. Credit Grade (A-F)
4. Loan recommendations with specific banks and rates
5. Detailed analysis of entrepreneurial potential

Please respond in JSON format with the following structure:
{
  "score": number,
  "riskLevel": "low|medium|high",
  "creditGrade": "A|B|C|D|E|F",
  "analysis": "detailed analysis string",
  "factors": {
    "income": score_out_of_100,
    "age": score_out_of_100,
    "employmentLength": score_out_of_100,
    "homeOwnership": score_out_of_100,
    "creditHistory": score_out_of_100,
    "debtToIncome": score_out_of_100
  },
  "loanRecommendations": [
    {
      "bank": "bank_name",
      "interestRate": rate_percentage,
      "maxLoanAmount": amount,
      "eligibility": "high|medium|low",
      "terms": "loan_terms",
      "monthlyPayment": payment_amount
    }
  ]
}
`;

    try {
      const response = await this.generateResponse(prompt);
      
      // Parse JSON response from Ollama
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Ollama');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      // Ensure the response has the correct structure
      return {
        score: result.score || this.calculateFallbackScore(userData),
        riskLevel: result.riskLevel || this.calculateRiskLevel(result.score || 650),
        creditGrade: result.creditGrade || this.calculateGrade(result.score || 650),
        analysis: result.analysis || "Comprehensive analysis based on entrepreneurial factors.",
        factors: result.factors || this.calculateFactors(userData),
        loanRecommendations: result.loanRecommendations || this.generateFallbackRecommendations(userData)
      };
    } catch (error) {
      console.error('Error parsing Ollama response:', error);
      // Fallback to rule-based scoring
      return this.generateFallbackScore(userData);
    }
  }

  private calculateFallbackScore(userData: any): number {
    let score = 300;
    
    // Income factor (30% weight)
    const incomeScore = Math.min(100, (userData.income / 150000) * 100);
    score += incomeScore * 1.65;
    
    // Age factor (15% weight)
    const ageScore = userData.age >= 25 && userData.age <= 45 ? 100 : 70;
    score += ageScore * 0.825;
    
    // Employment length (20% weight)
    const empScore = Math.min(100, (userData.employmentLength / 10) * 100);
    score += empScore * 1.1;
    
    // Home ownership (10% weight)
    const homeScore = userData.homeOwnership === 'OWN' ? 100 : userData.homeOwnership === 'MORTGAGE' ? 80 : 50;
    score += homeScore * 0.55;
    
    // Credit history (15% weight)
    const creditScore = Math.min(100, (userData.creditHistory / 10) * 100);
    score += creditScore * 0.825;
    
    // Business factors (10% weight)
    const businessScore = userData.businessExperience > 2 ? 90 : userData.businessExperience > 0 ? 70 : 40;
    score += businessScore * 0.55;
    
    return Math.round(Math.min(850, Math.max(300, score)));
  }

  private calculateRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 750) return 'low';
    if (score >= 650) return 'medium';
    return 'high';
  }

  private calculateGrade(score: number): string {
    if (score >= 800) return 'A';
    if (score >= 750) return 'B';
    if (score >= 700) return 'C';
    if (score >= 650) return 'D';
    if (score >= 600) return 'E';
    return 'F';
  }

  private calculateFactors(userData: any): ScoreFactors {
    return {
      income: Math.min(100, (userData.income / 150000) * 100),
      age: userData.age >= 25 && userData.age <= 45 ? 100 : 70,
      employmentLength: Math.min(100, (userData.employmentLength / 10) * 100),
      homeOwnership: userData.homeOwnership === 'OWN' ? 100 : userData.homeOwnership === 'MORTGAGE' ? 80 : 50,
      creditHistory: Math.min(100, (userData.creditHistory / 10) * 100),
      debtToIncome: Math.max(0, 100 - (userData.loanAmount / userData.income) * 100)
    };
  }

  private generateFallbackRecommendations(userData: any): LoanRecommendation[] {
    const score = this.calculateFallbackScore(userData);
    const recommendations: LoanRecommendation[] = [];

    if (score >= 750) {
      recommendations.push(
        {
          bank: "Chase Business",
          interestRate: 6.5,
          maxLoanAmount: userData.loanAmount * 1.5,
          eligibility: 'high',
          terms: "5-7 years, flexible repayment",
          monthlyPayment: Math.round((userData.loanAmount * 1.065) / 60)
        },
        {
          bank: "Wells Fargo",
          interestRate: 7.2,
          maxLoanAmount: userData.loanAmount * 1.3,
          eligibility: 'high',
          terms: "3-5 years, competitive rates",
          monthlyPayment: Math.round((userData.loanAmount * 1.072) / 48)
        }
      );
    } else if (score >= 650) {
      recommendations.push(
        {
          bank: "Bank of America",
          interestRate: 9.5,
          maxLoanAmount: userData.loanAmount,
          eligibility: 'medium',
          terms: "3-5 years, standard terms",
          monthlyPayment: Math.round((userData.loanAmount * 1.095) / 48)
        },
        {
          bank: "Regional Credit Union",
          interestRate: 8.8,
          maxLoanAmount: userData.loanAmount * 0.9,
          eligibility: 'medium',
          terms: "2-4 years, member benefits",
          monthlyPayment: Math.round((userData.loanAmount * 1.088) / 36)
        }
      );
    } else {
      recommendations.push(
        {
          bank: "Alternative Lender",
          interestRate: 12.5,
          maxLoanAmount: userData.loanAmount * 0.7,
          eligibility: 'low',
          terms: "1-3 years, higher rates",
          monthlyPayment: Math.round((userData.loanAmount * 1.125) / 24)
        }
      );
    }

    return recommendations;
  }

  private generateFallbackScore(userData: any): YECSScoreResult {
    const score = this.calculateFallbackScore(userData);
    
    return {
      score,
      riskLevel: this.calculateRiskLevel(score),
      creditGrade: this.calculateGrade(score),
      analysis: `Based on comprehensive analysis of your entrepreneurial profile, your YECS score is ${score}. This score considers your income stability, business experience, credit history, and entrepreneurial potential. ${score >= 700 ? 'You qualify for premium business financing options.' : score >= 600 ? 'You have good prospects for business financing with moderate terms.' : 'Consider improving your credit profile and business plan before applying for loans.'}`,
      factors: this.calculateFactors(userData),
      loanRecommendations: this.generateFallbackRecommendations(userData)
    };
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export const ollamaClient = new OllamaClient();