import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, AlertTriangle, CheckCircle, Info, TrendingUp, 
  DollarSign, Target, Zap, Clock, Star, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error' | 'achievement' | 'opportunity';
  title: string;
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  progress?: number;
  icon?: any;
  category: 'score' | 'business' | 'financial' | 'market' | 'recommendation';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Score Improvement',
    message: 'Your credit score increased by 12 points this month! Great progress on your financial health.',
    timestamp: '2 hours ago',
    priority: 'high',
    actionable: true,
    action: {
      label: 'View Details',
      onClick: () => console.log('View score details')
    },
    progress: 85,
    icon: TrendingUp,
    category: 'score'
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Funding Opportunity',
    message: 'Based on your improved profile, you may qualify for a $50K business loan with favorable terms.',
    timestamp: '4 hours ago',
    priority: 'high',
    actionable: true,
    action: {
      label: 'Apply Now',
      onClick: () => console.log('Apply for loan')
    },
    icon: DollarSign,
    category: 'business'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Market Alert',
    message: 'Industry competition in your sector has increased by 15%. Consider strengthening your competitive advantages.',
    timestamp: '1 day ago',
    priority: 'medium',
    actionable: true,
    action: {
      label: 'Strategy Guide',
      onClick: () => console.log('View strategy guide')
    },
    icon: AlertTriangle,
    category: 'market'
  },
  {
    id: '4',
    type: 'info',
    title: 'Document Verification',
    message: 'Your identity verification will expire in 30 days. Renew now to maintain your high identity score.',
    timestamp: '2 days ago',
    priority: 'medium',
    actionable: true,
    action: {
      label: 'Renew Documents',
      onClick: () => console.log('Renew documents')
    },
    icon: Clock,
    category: 'score'
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Milestone Achieved',
    message: 'Congratulations! You\'ve reached the top 25% of entrepreneurs in your industry.',
    timestamp: '3 days ago',
    priority: 'low',
    actionable: false,
    icon: Star,
    category: 'score'
  }
];

export const SmartNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'high' | 'actionable'>('all');
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'info',
          title: 'Real-time Update',
          message: 'Your financial health factor has been updated with new transaction data.',
          timestamp: 'Just now',
          priority: 'low',
          actionable: false,
          icon: Info,
          category: 'financial'
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
          duration: 3000,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [toast]);

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'error':
        return <X className="w-4 h-4 text-destructive" />;
      case 'achievement':
        return <Star className="w-4 h-4 text-primary" />;
      case 'opportunity':
        return <Target className="w-4 h-4 text-success" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'error':
        return 'border-destructive/20 bg-destructive/5';
      case 'achievement':
        return 'border-primary/20 bg-primary/5';
      case 'opportunity':
        return 'border-success/20 bg-success/5';
      default:
        return 'border-muted/20 bg-muted/5';
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'high':
        return notification.priority === 'high';
      case 'actionable':
        return notification.actionable;
      default:
        return true;
    }
  });

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Smart Notifications</h3>
            <p className="text-sm text-muted-foreground">
              {filteredNotifications.length} notifications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('high')}
          >
            High Priority
          </Button>
          <Button
            variant={filter === 'actionable' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('actionable')}
          >
            Actionable
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`glass-card hover-lift transition-all duration-200 ${getTypeColor(notification.type)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {notification.icon ? (
                        <notification.icon className="w-5 h-5 text-primary" />
                      ) : (
                        getTypeIcon(notification.type)
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>

                      {/* Progress Bar */}
                      {notification.progress && (
                        <div className="mb-2">
                          <Progress value={notification.progress} className="h-1" />
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>
                        <div className="flex items-center gap-2">
                          {notification.actionable && notification.action && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={notification.action.onClick}
                              className="text-xs gap-1"
                            >
                              {notification.action.label}
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissNotification(notification.id)}
                            className="text-xs p-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-8">
          <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No notifications to display</p>
        </div>
      )}
    </div>
  );
};