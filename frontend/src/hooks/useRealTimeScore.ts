import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import io from 'socket.io-client';

export const useRealTimeScore = (userId) => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userId) {
      // Initialize WebSocket connection
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

      newSocket.on('connect', () => {
        console.log('Connected to YECS real-time updates');
        newSocket.emit('join_user_room', { user_id: userId });
      });

      newSocket.on('score_updated', (data) => {
        if (data.user_id === userId) {
          setScore(prevScore => ({
            ...prevScore,
            yecs_score: data.score,
            risk_level: data.risk_level
          }));
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userId]);

  const calculateScore = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.calculateScore(userId);
      setScore(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate score');
    } finally {
      setLoading(false);
    }
  };

  const getScoreHistory = async () => {
    try {
      const response = await apiService.getUserScores(userId);
      return response.data.score_history;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch score history');
      return [];
    }
  };

  const getPreviewScore = async (previewData) => {
    try {
      const response = await apiService.getScorePreview(previewData);
      return response.data;
    } catch (err) {
      console.error('Preview score error:', err);
      return null;
    }
  };

  return {
    score,
    loading,
    error,
    calculateScore,
    getScoreHistory,
    getPreviewScore,
    socket
  };
};
