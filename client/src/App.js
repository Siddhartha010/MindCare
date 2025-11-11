import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticlesBackground from './components/ParticlesBackground';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import MoodTracker from './pages/MoodTracker';
import WellnessTips from './pages/WellnessTips';
import Community from './pages/Community';
import BreathingExercise from './pages/BreathingExercise';
import TestLogin from './pages/TestLogin';
import UserActivities from './pages/UserActivities';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';



function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Auth validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <ParticlesBackground />
        <Navbar user={user} logout={logout} />
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} />
              <Route path="/quiz" element={user ? <Quiz user={user} /> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/mood" element={user ? <MoodTracker user={user} /> : <Navigate to="/login" />} />
              <Route path="/wellness" element={user ? <WellnessTips /> : <Navigate to="/login" />} />
              <Route path="/community" element={user ? <Community user={user} /> : <Navigate to="/login" />} />
              <Route path="/breathing" element={user ? <BreathingExercise /> : <Navigate to="/login" />} />
              <Route path="/chatbot" element={user ? <Chatbot user={user} /> : <Navigate to="/login" />} />
              <Route path="/activities" element={user ? <UserActivities /> : <Navigate to="/login" />} />
              <Route path="/admin" element={user?.is_admin ? <AdminDashboard /> : <Navigate to="/" />} />
              <Route path="/test" element={<TestLogin />} />
            </Routes>
      </div>
    </Router>
  );
}

export default App;
