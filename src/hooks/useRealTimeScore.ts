import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface ScoreData {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: {
    financial: number;
    credit: number;
    identity: number;
    business: number;
    social: number;
  };
  lastUpdated: string;
}

interface UseRealTimeScoreReturn {
  score: ScoreData | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  updateScore: (newScore: Partial<ScoreData>) => void;
}

export const useRealTimeScore = (userId?: string): UseRealTimeScoreReturn => {
  const [score, setScore] = useState<ScoreData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Initialize Socket.IO connection
    const newSocket = io(process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      setIsLoading(false);
      
      // Subscribe to user's score updates
      newSocket.emit('subscribe_score', { userId });
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

    // Score update handlers
    newSocket.on('score_updated', (data: ScoreData) => {
      setScore(data);
      setError(null);
    });

    newSocket.on('score_error', (err) => {
      setError(err.message);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [userId]);

  // Optimistic update function
  const updateScore = useCallback((newScore: Partial<ScoreData>) => {
    if (!socket || !userId) return;

    // Optimistically update the UI
    setScore(prev => prev ? { ...prev, ...newScore } : null);

    // Send update to server
    socket.emit('update_score', { userId, ...newScore });
  }, [socket, userId]);

  // Mock data for development
  useEffect(() => {
    if (!userId && !socket) {
      setTimeout(() => {
        setScore({
          score: 742,
          riskLevel: 'medium',
          factors: {
            financial: 85,
            credit: 78,
            identity: 92,
            business: 65,
            social: 71
          },
          lastUpdated: new Date().toISOString()
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [userId, socket]);

  return {
    score,
    isConnected,
    isLoading,
    error,
    updateScore
  };
};