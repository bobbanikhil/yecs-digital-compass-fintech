import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Database, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  networkLatency: number;
  cacheHitRate: number;
  apiResponseTime: number;
  renderTime: number;
  bundleSize: number;
  userInteractionLatency: number;
}

interface PerformanceMonitorProps {
  isVisible: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  compact?: boolean;
}

export const PerformanceMonitor = ({ 
  isVisible, 
  position = 'top-right',
  compact = false 
}: PerformanceMonitorProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    networkLatency: 0,
    cacheHitRate: 0,
    apiResponseTime: 0,
    renderTime: 0,
    bundleSize: 0,
    userInteractionLatency: 0
  });
  const [isHealthy, setIsHealthy] = useState(true);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  // FPS monitoring
  useEffect(() => {
    let animationFrameId: number;

    const updateFPS = (timestamp: number) => {
      frameCountRef.current++;
      
      if (timestamp - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (timestamp - lastTimeRef.current));
        setMetrics(prev => ({ ...prev, fps }));
        frameCountRef.current = 0;
        lastTimeRef.current = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(updateFPS);
    };

    if (isVisible) {
      animationFrameId = requestAnimationFrame(updateFPS);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible]);

  // Memory usage monitoring
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    const interval = setInterval(updateMemoryUsage, 2000);
    return () => clearInterval(interval);
  }, []);

  // Network latency monitoring
  useEffect(() => {
    const measureNetworkLatency = async () => {
      const start = performance.now();
      try {
        await fetch('/api/health', { method: 'HEAD' });
        const latency = performance.now() - start;
        setMetrics(prev => ({ ...prev, networkLatency: Math.round(latency) }));
      } catch (error) {
        console.warn('Network latency measurement failed');
      }
    };

    const interval = setInterval(measureNetworkLatency, 5000);
    return () => clearInterval(interval);
  }, []);

  // Performance health check
  useEffect(() => {
    const healthy = 
      metrics.fps >= 30 &&
      metrics.memoryUsage < 80 &&
      metrics.networkLatency < 200 &&
      metrics.apiResponseTime < 1000;
    
    setIsHealthy(healthy);
  }, [metrics]);

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-success';
    if (value <= thresholds.warning) return 'text-warning';
    return 'text-danger';
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      default: return 'top-4 right-4';
    }
  };

  const MetricCard = ({ 
    icon: Icon, 
    label, 
    value, 
    unit, 
    color,
    progress 
  }: {
    icon: any;
    label: string;
    value: number;
    unit: string;
    color: string;
    progress?: number;
  }) => (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-card/50">
      <Icon className={`w-4 h-4 ${color}`} />
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`text-sm font-medium ${color}`}>
          {value}{unit}
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-1" />
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`fixed z-50 ${getPositionClasses()}`}
        >
          <Card className="glass-card min-w-[280px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Performance Monitor
                <Badge variant={isHealthy ? "default" : "destructive"} className="ml-auto">
                  {isHealthy ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  {isHealthy ? 'Healthy' : 'Issues'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!compact && (
                <div className="grid grid-cols-2 gap-2">
                  <MetricCard
                    icon={Zap}
                    label="FPS"
                    value={metrics.fps}
                    unit=""
                    color={getPerformanceColor(60 - metrics.fps, { good: 30, warning: 50 })}
                  />
                  <MetricCard
                    icon={Database}
                    label="Memory"
                    value={metrics.memoryUsage}
                    unit="%"
                    color={getPerformanceColor(metrics.memoryUsage, { good: 50, warning: 80 })}
                    progress={metrics.memoryUsage}
                  />
                  <MetricCard
                    icon={Wifi}
                    label="Latency"
                    value={metrics.networkLatency}
                    unit="ms"
                    color={getPerformanceColor(metrics.networkLatency, { good: 50, warning: 200 })}
                  />
                  <MetricCard
                    icon={Activity}
                    label="API"
                    value={metrics.apiResponseTime}
                    unit="ms"
                    color={getPerformanceColor(metrics.apiResponseTime, { good: 200, warning: 1000 })}
                  />
                </div>
              )}
              
              {compact && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-success" />
                    <span>{metrics.fps}fps</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Database className="w-3 h-3 text-warning" />
                    <span>{metrics.memoryUsage}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-primary" />
                    <span>{metrics.networkLatency}ms</span>
                  </div>
                </div>
              )}
              
              {/* Real-time chart placeholder */}
              <div className="h-16 bg-gradient-to-r from-primary/20 to-success/20 rounded-lg flex items-end justify-around p-2">
                {Array.from({ length: 10 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="bg-primary/60 rounded-sm"
                    style={{
                      width: '6px',
                      height: `${Math.random() * 40 + 10}px`
                    }}
                    animate={{
                      height: `${Math.random() * 40 + 10}px`
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Real-time performance metrics
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};