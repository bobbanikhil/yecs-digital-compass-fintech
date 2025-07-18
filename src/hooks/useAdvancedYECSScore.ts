import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Enhanced scoring interface with advanced factors
interface AdvancedScoreData {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  creditGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  factors: {
    // Core Financial Factors
    financial: {
      score: number;
      income_stability: number;
      cash_flow_health: number;
      savings_rate: number;
      debt_to_income: number;
      emergency_fund: number;
    };
    
    // Enhanced Credit Assessment
    credit: {
      score: number;
      payment_history: number;
      utilization_rate: number;
      account_age: number;
      credit_mix: number;
      recent_inquiries: number;
    };
    
    // Digital Identity & Verification
    identity: {
      score: number;
      document_verification: number;
      biometric_validation: number;
      social_media_presence: number;
      digital_footprint: number;
      fraud_detection: number;
    };
    
    // Comprehensive Business Assessment
    business: {
      score: number;
      business_plan_quality: number;
      market_analysis: number;
      competitive_advantage: number;
      team_strength: number;
      financial_projections: number;
      industry_experience: number;
      execution_track_record: number;
    };
    
    // Social & Professional Network
    social: {
      score: number;
      professional_network: number;
      industry_connections: number;
      mentor_relationships: number;
      customer_testimonials: number;
      social_media_engagement: number;
    };
    
    // Alternative Data Sources
    behavioral: {
      score: number;
      transaction_patterns: number;
      spending_habits: number;
      financial_discipline: number;
      investment_behavior: number;
      gig_economy_activity: number;
    };
    
    // Entrepreneurial Indicators
    entrepreneurial: {
      score: number;
      innovation_index: number;
      market_validation: number;
      customer_acquisition: number;
      revenue_growth: number;
      adaptability_score: number;
      leadership_potential: number;
    };
    
    // Educational & Skills
    education: {
      score: number;
      formal_education: number;
      certifications: number;
      skills_assessment: number;
      continuous_learning: number;
      industry_knowledge: number;
    };
  };
  
  // Industry-specific adjustments
  industryContext: {
    industry: string;
    market_conditions: number;
    sector_growth: number;
    competition_level: number;
    regulatory_environment: number;
  };
  
  // Predictive Metrics
  predictions: {
    success_probability: number;
    default_risk: number;
    growth_potential: number;
    funding_readiness: number;
    market_fit_score: number;
  };
  
  // Historical Data
  trends: {
    score_change_30d: number;
    score_change_90d: number;
    improvement_velocity: number;
    consistency_score: number;
  };
  
  lastUpdated: string;
  nextUpdate: string;
}

interface UseAdvancedYECSScoreReturn {
  score: AdvancedScoreData | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  updateScore: (newScore: Partial<AdvancedScoreData>) => void;
  refreshScore: () => void;
  getFactorInsights: (factor: string) => string[];
  getImprovementSuggestions: () => string[];
}

export const useAdvancedYECSScore = (userId?: string): UseAdvancedYECSScoreReturn => {
  const [score, setScore] = useState<AdvancedScoreData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Advanced scoring algorithm
  const calculateAdvancedScore = useCallback((factors: any) => {
    // Weighted scoring based on entrepreneurial focus
    const weights = {
      financial: 0.25,
      credit: 0.15,
      identity: 0.10,
      business: 0.30,
      social: 0.10,
      behavioral: 0.05,
      entrepreneurial: 0.25,
      education: 0.15,
    };

    // Calculate weighted score
    const weightedScore = Object.entries(weights).reduce((total, [key, weight]) => {
      const factorScore = factors[key]?.score || 0;
      return total + (factorScore * weight);
    }, 0);

    // Apply industry adjustments
    const industryMultiplier = 1 + (factors.industryContext?.market_conditions || 0) * 0.1;
    const finalScore = Math.min(Math.max(weightedScore * industryMultiplier, 300), 850);

    return Math.round(finalScore);
  }, []);

  // Risk level calculation
  const calculateRiskLevel = useCallback((score: number): 'low' | 'medium' | 'high' => {
    if (score >= 750) return 'low';
    if (score >= 650) return 'medium';
    return 'high';
  }, []);

  // Credit grade calculation
  const calculateCreditGrade = useCallback((score: number): string => {
    if (score >= 800) return 'A+';
    if (score >= 780) return 'A';
    if (score >= 750) return 'A-';
    if (score >= 720) return 'B+';
    if (score >= 690) return 'B';
    if (score >= 660) return 'B-';
    if (score >= 630) return 'C+';
    if (score >= 600) return 'C';
    if (score >= 570) return 'C-';
    if (score >= 500) return 'D';
    return 'F';
  }, []);

  // Get factor-specific insights
  const getFactorInsights = useCallback((factor: string): string[] => {
    if (!score) return [];
    
    const insights: { [key: string]: string[] } = {
      financial: [
        'Maintain consistent income streams',
        'Improve cash flow management',
        'Build emergency fund reserves',
        'Optimize debt-to-income ratio'
      ],
      business: [
        'Strengthen business plan documentation',
        'Conduct thorough market analysis',
        'Build experienced advisory team',
        'Demonstrate market traction'
      ],
      entrepreneurial: [
        'Showcase innovation and creativity',
        'Validate market demand',
        'Build customer acquisition channels',
        'Demonstrate leadership capabilities'
      ],
      behavioral: [
        'Maintain consistent spending patterns',
        'Show financial discipline',
        'Diversify income sources',
        'Build investment portfolio'
      ]
    };

    return insights[factor] || [];
  }, [score]);

  // Get improvement suggestions
  const getImprovementSuggestions = useCallback((): string[] => {
    if (!score) return [];

    const suggestions: string[] = [];
    
    // Analyze each factor and provide targeted suggestions
    Object.entries(score.factors).forEach(([key, factor]) => {
      if (factor.score < 70) {
        suggestions.push(`Focus on improving ${key} score by 10+ points`);
      }
    });

    // Add predictive suggestions
    if (score.predictions.success_probability < 0.7) {
      suggestions.push('Strengthen business fundamentals to improve success probability');
    }

    if (score.predictions.funding_readiness < 0.6) {
      suggestions.push('Prepare comprehensive funding documentation');
    }

    return suggestions;
  }, [score]);

  // Socket connection and real-time updates
  useEffect(() => {
    if (!userId) return;

    const newSocket = io(process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      setIsLoading(false);
      newSocket.emit('subscribe_advanced_score', { userId });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setIsLoading(false);
    });

    newSocket.on('connect_error', (err) => {
      setError(`Connection error: ${err.message}`);
      setIsConnected(false);
      setIsLoading(false);
    });

    newSocket.on('advanced_score_updated', (data: AdvancedScoreData) => {
      setScore(data);
      setError(null);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [userId]);

  // Mock advanced data for development
  useEffect(() => {
    if (!userId && !socket) {
      setTimeout(() => {
        const mockFactors = {
          financial: {
            score: 85,
            income_stability: 88,
            cash_flow_health: 82,
            savings_rate: 90,
            debt_to_income: 75,
            emergency_fund: 85
          },
          credit: {
            score: 78,
            payment_history: 85,
            utilization_rate: 72,
            account_age: 80,
            credit_mix: 75,
            recent_inquiries: 70
          },
          identity: {
            score: 92,
            document_verification: 95,
            biometric_validation: 90,
            social_media_presence: 88,
            digital_footprint: 92,
            fraud_detection: 98
          },
          business: {
            score: 74,
            business_plan_quality: 78,
            market_analysis: 72,
            competitive_advantage: 75,
            team_strength: 68,
            financial_projections: 76,
            industry_experience: 70,
            execution_track_record: 80
          },
          social: {
            score: 71,
            professional_network: 75,
            industry_connections: 68,
            mentor_relationships: 72,
            customer_testimonials: 70,
            social_media_engagement: 73
          },
          behavioral: {
            score: 82,
            transaction_patterns: 85,
            spending_habits: 78,
            financial_discipline: 88,
            investment_behavior: 75,
            gig_economy_activity: 80
          },
          entrepreneurial: {
            score: 79,
            innovation_index: 82,
            market_validation: 76,
            customer_acquisition: 78,
            revenue_growth: 80,
            adaptability_score: 85,
            leadership_potential: 77
          },
          education: {
            score: 86,
            formal_education: 88,
            certifications: 85,
            skills_assessment: 84,
            continuous_learning: 90,
            industry_knowledge: 82
          }
        };

        const calculatedScore = calculateAdvancedScore(mockFactors);
        
        setScore({
          score: calculatedScore,
          riskLevel: calculateRiskLevel(calculatedScore),
          creditGrade: calculateCreditGrade(calculatedScore) as any,
          factors: mockFactors,
          industryContext: {
            industry: 'Technology',
            market_conditions: 75,
            sector_growth: 85,
            competition_level: 70,
            regulatory_environment: 80
          },
          predictions: {
            success_probability: 0.78,
            default_risk: 0.12,
            growth_potential: 0.85,
            funding_readiness: 0.72,
            market_fit_score: 0.80
          },
          trends: {
            score_change_30d: 23,
            score_change_90d: 45,
            improvement_velocity: 0.85,
            consistency_score: 0.92
          },
          lastUpdated: new Date().toISOString(),
          nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [userId, socket, calculateAdvancedScore, calculateRiskLevel, calculateCreditGrade]);

  // Optimistic update function
  const updateScore = useCallback((newScore: Partial<AdvancedScoreData>) => {
    if (!socket || !userId) return;

    setScore(prev => prev ? { ...prev, ...newScore } : null);
    socket.emit('update_advanced_score', { userId, ...newScore });
  }, [socket, userId]);

  // Refresh score manually
  const refreshScore = useCallback(() => {
    if (!socket || !userId) return;
    
    setIsLoading(true);
    socket.emit('refresh_advanced_score', { userId });
  }, [socket, userId]);

  return {
    score,
    isConnected,
    isLoading,
    error,
    updateScore,
    refreshScore,
    getFactorInsights,
    getImprovementSuggestions
  };
};