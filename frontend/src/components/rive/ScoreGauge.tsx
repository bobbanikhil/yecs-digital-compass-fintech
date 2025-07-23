import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  riskLevel: 'low' | 'medium' | 'high';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreGauge = ({ 
  score, 
  maxScore = 850, 
  riskLevel, 
  animated = true,
  size = 'lg'
}: ScoreGaugeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();

  // Get color based on risk level
  const getScoreColor = () => {
    switch (riskLevel) {
      case 'low': return 'var(--gradient-success)';
      case 'medium': return 'var(--gradient-warning)';
      case 'high': return 'var(--gradient-danger)';
      default: return 'var(--gradient-primary)';
    }
  };

  // Get glow based on risk level
  const getScoreGlow = () => {
    switch (riskLevel) {
      case 'low': return 'var(--glow-success)';
      case 'medium': return 'var(--glow-warning)';
      case 'high': return 'var(--glow-danger)';
      default: return 'var(--glow-primary)';
    }
  };

  // Calculate percentage
  const percentage = Math.min((score / maxScore) * 100, 100);
  
  // Size variants
  const sizeMap = {
    sm: { width: 120, height: 120, strokeWidth: 8 },
    md: { width: 200, height: 200, strokeWidth: 12 },
    lg: { width: 300, height: 300, strokeWidth: 16 }
  };

  const dimensions = sizeMap[size];
  const radius = (dimensions.width - dimensions.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Animation variants
  const circleVariants = {
    hidden: { 
      strokeDashoffset: circumference,
      opacity: 0
    },
    visible: {
      strokeDashoffset: strokeDashoffset,
      opacity: 1,
      transition: {
        strokeDashoffset: { 
          duration: 2,
          ease: [0.25, 0.46, 0.45, 0.94]
        },
        opacity: { duration: 0.5 }
      }
    }
  };

  const textVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        delay: 1.5,
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  useEffect(() => {
    if (animated) {
      controls.start("visible");
    }
  }, [animated, controls]);

  return (
    <div className="relative flex flex-col items-center">
      <div 
        className="relative"
        style={{
          width: dimensions.width,
          height: dimensions.height
        }}
      >
        {/* Background glow */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-20"
          style={{
            background: getScoreColor(),
            boxShadow: getScoreGlow()
          }}
        />
        
        {/* SVG Gauge */}
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="transform -rotate-90 relative z-10"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={dimensions.strokeWidth}
            opacity={0.3}
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={radius}
            fill="none"
            stroke={`url(#scoreGradient-${riskLevel})`}
            strokeWidth={dimensions.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            variants={circleVariants}
            initial="hidden"
            animate={controls}
            style={{
              filter: `drop-shadow(0 0 10px ${getScoreColor()})`
            }}
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id={`scoreGradient-${riskLevel}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={riskLevel === 'low' ? '#10b981' : riskLevel === 'medium' ? '#f59e0b' : '#ef4444'} />
              <stop offset="100%" stopColor={riskLevel === 'low' ? '#34d399' : riskLevel === 'medium' ? '#fbbf24' : '#f87171'} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Score text */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          variants={textVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient">
            {score}
          </div>
          <div className="text-sm md:text-base lg:text-lg text-muted-foreground uppercase tracking-wide">
            Credit Score
          </div>
          <div className={`text-xs md:text-sm lg:text-base font-medium mt-1 ${
            riskLevel === 'low' ? 'text-success' : 
            riskLevel === 'medium' ? 'text-warning' : 
            'text-danger'
          }`}>
            {riskLevel.toUpperCase()} RISK
          </div>
        </motion.div>
      </div>
      
      {/* Score range indicator */}
      <div className="mt-4 w-full max-w-xs">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>300</span>
          <span>850</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: getScoreColor(),
              width: `${percentage}%`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};