import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import UserRegistration from './pages/UserRegistration';
import BusinessProfile from './pages/BusinessProfile';
import FinancialData from './pages/FinancialData';
import ScoreCalculation from './pages/ScoreCalculation';
import Dashboard from './pages/Dashboard';
import { apiService } from './services/api';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiHealth, setApiHealth] = useState(false);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await apiService.healthCheck();
        setApiHealth(response.data.status === 'healthy');
      } catch (error) {
        console.error('API health check failed:', error);
        setApiHealth(false);
      } finally {
        setTimeout(() => setIsLoading(false), 2000); // Show loading for 2 seconds
      }
    };

    checkApiHealth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar apiHealth={apiHealth} />

        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<UserRegistration />} />
              <Route path="/business-profile/:userId" element={<BusinessProfile />} />
              <Route path="/financial-data/:userId" element={<FinancialData />} />
              <Route path="/calculate-score/:userId" element={<ScoreCalculation />} />
              <Route path="/dashboard/:userId" element={<Dashboard />} />
            </Routes>
          </motion.main>
        </AnimatePresence>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;
