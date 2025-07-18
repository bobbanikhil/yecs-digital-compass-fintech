import { useState, useEffect, useCallback } from 'react';

interface VoiceCommand {
  phrase: string;
  action: () => void;
  description: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface UseVoiceCommandsReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  addCommand: (command: VoiceCommand) => void;
  removeCommand: (phrase: string) => void;
}

export const useVoiceCommands = (
  commands: VoiceCommand[] = [],
  options: {
    continuous?: boolean;
    interimResults?: boolean;
    language?: string;
    confidenceThreshold?: number;
  } = {}
): UseVoiceCommandsReturn => {
  const {
    continuous = false,
    interimResults = true,
    language = 'en-US',
    confidenceThreshold = 0.7,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [registeredCommands, setRegisteredCommands] = useState<VoiceCommand[]>(commands);

  // Check if speech recognition is supported
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = continuous;
    recognitionInstance.interimResults = interimResults;
    recognitionInstance.lang = language;

    recognitionInstance.onresult = (event: any) => {
      const results = Array.from(event.results);
      const latestResult = results[results.length - 1] as any;
      
      if (latestResult) {
        const transcript = latestResult[0].transcript;
        const confidence = latestResult[0].confidence;
        
        setTranscript(transcript);
        setConfidence(confidence);
        
        // Check for command matches
        if (latestResult.isFinal && confidence >= confidenceThreshold) {
          checkForCommands(transcript.toLowerCase().trim());
        }
      }
    };

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [isSupported, continuous, interimResults, language, confidenceThreshold]);

  // Check transcript against registered commands
  const checkForCommands = useCallback((transcript: string) => {
    for (const command of registeredCommands) {
      const commandPhrase = command.phrase.toLowerCase();
      
      // Exact match
      if (transcript === commandPhrase) {
        command.action();
        return;
      }
      
      // Partial match (contains the command)
      if (transcript.includes(commandPhrase)) {
        command.action();
        return;
      }
      
      // Fuzzy match using Levenshtein distance
      if (calculateSimilarity(transcript, commandPhrase) > 0.8) {
        command.action();
        return;
      }
    }
  }, [registeredCommands]);

  // Calculate string similarity
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  // Levenshtein distance calculation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const startListening = useCallback(() => {
    if (!recognition || !isSupported) return;
    
    try {
      recognition.start();
    } catch (error) {
      setError('Failed to start speech recognition');
    }
  }, [recognition, isSupported]);

  const stopListening = useCallback(() => {
    if (!recognition || !isSupported) return;
    
    try {
      recognition.stop();
    } catch (error) {
      setError('Failed to stop speech recognition');
    }
  }, [recognition, isSupported]);

  const addCommand = useCallback((command: VoiceCommand) => {
    setRegisteredCommands(prev => [...prev, command]);
  }, []);

  const removeCommand = useCallback((phrase: string) => {
    setRegisteredCommands(prev => prev.filter(cmd => cmd.phrase !== phrase));
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    addCommand,
    removeCommand,
  };
};

// Global type declarations for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}