import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mic, MicOff, Settings, HelpCircle, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { useGestureControls } from '@/hooks/useGestureControls';

interface FloatingActionsProps {
  onAIToggle: () => void;
  onSettingsToggle: () => void;
  onHelpToggle: () => void;
  className?: string;
}

export const FloatingActions = ({ 
  onAIToggle, 
  onSettingsToggle, 
  onHelpToggle,
  className = '' 
}: FloatingActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Voice commands
  const voiceCommands = [
    { phrase: 'open ai assistant', action: onAIToggle, description: 'Open AI assistant' },
    { phrase: 'show settings', action: onSettingsToggle, description: 'Show settings' },
    { phrase: 'help me', action: onHelpToggle, description: 'Show help' },
    { phrase: 'expand menu', action: () => setIsExpanded(true), description: 'Expand menu' },
    { phrase: 'close menu', action: () => setIsExpanded(false), description: 'Close menu' },
  ];

  const { isListening, startListening, stopListening, isSupported } = useVoiceCommands(voiceCommands);

  // Gesture controls
  useGestureControls(containerRef.current, {
    onLongPress: () => setIsExpanded(!isExpanded),
    onDoubleTap: onAIToggle,
    onSwipeUp: () => setIsExpanded(true),
    onSwipeDown: () => setIsExpanded(false),
  });

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
      setIsVoiceActive(false);
    } else {
      startListening();
      setIsVoiceActive(true);
    }
  };

  const actions = [
    {
      icon: MessageCircle,
      label: 'AI Assistant',
      action: onAIToggle,
      variant: 'hero' as const,
    },
    {
      icon: isListening ? MicOff : Mic,
      label: isListening ? 'Stop Voice' : 'Voice Commands',
      action: toggleVoice,
      variant: isListening ? 'danger' as const : 'success' as const,
      disabled: !isSupported,
    },
    {
      icon: Settings,
      label: 'Settings',
      action: onSettingsToggle,
      variant: 'glass' as const,
    },
    {
      icon: HelpCircle,
      label: 'Help',
      action: onHelpToggle,
      variant: 'glass' as const,
    },
  ];

  return (
    <div 
      ref={containerRef}
      className={`fixed bottom-6 right-6 z-50 ${className}`}
    >
      <div className="relative">
        {/* Action buttons */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 flex flex-col gap-3"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.2,
                    type: 'spring',
                    stiffness: 400,
                    damping: 25 
                  }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    className="bg-card/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium text-card-foreground whitespace-nowrap"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    {action.label}
                  </motion.div>
                  <Button
                    onClick={action.action}
                    variant={action.variant}
                    size="icon"
                    className="w-12 h-12 rounded-full shadow-lg"
                    disabled={action.disabled}
                  >
                    <action.icon className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main toggle button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="hero"
            size="icon"
            className="w-14 h-14 rounded-full shadow-lg relative overflow-hidden"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? (
                <X className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
            </motion.div>
            
            {/* Voice activity indicator */}
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-success"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1,
                  ease: "easeOut"
                }}
              />
            )}
          </Button>
        </motion.div>

        {/* Voice feedback */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-2 bg-success/10 border border-success/20 rounded-lg p-3 min-w-[200px]"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-success-foreground">
                  Listening for voice commands...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};