import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import MoodTracker from './pages/MoodTracker';
import WellnessTips from './pages/WellnessTips';
import Community from './pages/Community';
import TestLogin from './pages/TestLogin';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
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
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/quiz" element={user ? <Quiz user={user} /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/mood" element={user ? <MoodTracker user={user} /> : <Navigate to="/login" />} />
          <Route path="/wellness" element={user ? <WellnessTips /> : <Navigate to="/login" />} />
          <Route path="/community" element={user ? <Community user={user} /> : <Navigate to="/login" />} />
          <Route path="/chatbot" element={user ? <Chatbot user={user} /> : <Navigate to="/login" />} />
          <Route path="/test" element={<TestLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;