import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Row, Col, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useRealTimeScore } from '../hooks/useRealTimeScore';
import ScoreVisualization from '../components/ScoreVisualization';

const ScoreCalculation = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { score, loading, error, calculateScore } = useRealTimeScore(parseInt(userId));
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateScore = async () => {
    setIsCalculating(true);
    try {
      await calculateScore();
      toast.success('🎉 Your YECS score has been calculated!');
      setTimeout(() => {
        navigate(`/dashboard/${userId}`);
      }, 2000);
    } catch (err) {
      toast.error('Failed to calculate score. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'danger';
      case 'VERY_HIGH': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="futuristic-card">
              <Card.Header className="text-center">
                <h2>YECS Score Calculation</h2>
                <p className="text-muted">
                  Calculate your Young Entrepreneur Credit Score using our AI-powered algorithm
                </p>
              </Card.Header>

              <Card.Body>
                {error && (
                  <Alert variant="danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                {!score && !isCalculating && (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <i className="fas fa-calculator fa-5x text-primary mb-4"></i>
                    </motion.div>

                    <h4>Ready to Calculate Your Score</h4>
                    <p className="text-muted mb-4">
                      Our advanced AI algorithm will analyze your profile and generate
                      a comprehensive credit score tailored for young entrepreneurs.
                    </p>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleCalculateScore}
                      disabled={loading}
                      className="calculate-btn"
                    >
                      <i className="fas fa-magic me-2"></i>
                      Calculate My YECS Score
                    </Button>
                  </div>
                )}

                {isCalculating && (
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <i className="fas fa-cog fa-5x text-primary mb-4"></i>
                    </motion.div>

                    <h4>Calculating Your Score...</h4>
                    <p className="text-muted">
                      AI is analyzing your entrepreneurial profile
                    </p>

                    <ProgressBar
                      animated
                      now={100}
                      variant="primary"
                      className="mb-4"
                    />

                    <div className="calculation-steps">
                      <p><i className="fas fa-check text-success me-2"></i> Analyzing business viability</p>
                      <p><i className="fas fa-check text-success me-2"></i> Evaluating payment history</p>
                      <p><i className="fas fa-check text-success me-2"></i> Assessing financial management</p>
                      <p><i className="fas fa-spinner fa-spin text-primary me-2"></i> Generating AI insights</p>
                    </div>
                  </div>
                )}

                {score && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="text-center mb-4">
                      <h3>Your YECS Score</h3>
                      <div className="score-display">
                        <span className={`score-number text-${getRiskColor(score.risk_level)}`}>
                          {score.yecs_score}
                        </span>
                        <div className="score-range">out of 850</div>
                      </div>
                      <Alert variant={getRiskColor(score.risk_level)} className="mt-3">
                        <strong>Risk Level: {score.risk_level}</strong>
                      </Alert>
                    </div>

                    {score.component_scores && (
                      <ScoreVisualization componentScores={score.component_scores} />
                    )}

                    {score.ai_explanation && (
                      <Card className="mt-4">
                        <Card.Header>
                          <h5><i className="fas fa-robot me-2"></i>AI Analysis</h5>
                        </Card.Header>
                        <Card.Body>
                          <p>{score.ai_explanation}</p>
                        </Card.Body>
                      </Card>
                    )}

                    <div className="text-center mt-4">
                      <Button
                        variant="success"
                        size="lg"
                        onClick={() => navigate(`/dashboard/${userId}`)}
                      >
                        <i className="fas fa-chart-bar me-2"></i>
                        View Detailed Dashboard
                      </Button>
                    </div>
                  </motion.div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default ScoreCalculation;
