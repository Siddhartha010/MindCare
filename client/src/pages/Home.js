import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="container">
      <div className="fade-in" style={{ textAlign: 'center', padding: '4rem 0', color: 'white' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: '800', textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
          {user ? `Welcome back, ${user.username}!` : 'Welcome to MindCare'}
        </h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.95, fontWeight: '400', lineHeight: '1.6' }}>
          Your AI-powered mental health companion for tracking and improving well-being
        </p>
        {!user && (
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Get Started Today
          </Link>
        )}
      </div>

      <div className="grid grid-2" style={{ marginTop: '4rem' }}>
        <Link to={user ? "/mood" : "/login"} className="card feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card-header">
            <h3 className="card-title">🌈 Mood Tracking</h3>
          </div>
          <p>Track your daily emotions with simple emoji selections and gain insights into your emotional patterns.</p>
        </Link>

        <Link to={user ? "/quiz" : "/login"} className="card feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card-header">
            <h3 className="card-title">📊 Weekly Assessments</h3>
          </div>
          <p>Take our scientifically-backed 10-question quiz to track your mental health progress over time.</p>
        </Link>

        <Link to={user ? "/wellness" : "/login"} className="card feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card-header">
            <h3 className="card-title">💡 Wellness Tips</h3>
          </div>
          <p>Access evidence-based practices and daily tips for better mental health and well-being.</p>
        </Link>

        <Link to={user ? "/community" : "/login"} className="card feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card-header">
            <h3 className="card-title">💬 Community Q&A</h3>
          </div>
          <p>Ask questions and get support from the community. Share experiences and help others on their wellness journey.</p>
        </Link>

        <Link to={user ? "/chatbot" : "/login"} className="card feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card-header">
            <h3 className="card-title">🤖 AI Assistant</h3>
          </div>
          <p>Get personalized advice on diet, exercise, relaxation techniques, and mental wellness strategies.</p>
        </Link>
      </div>

      <div className="why-choose-section" style={{ marginTop: '4rem' }}>
        <div className="why-choose-header">
          <h2>✨ Why Choose MindCare?</h2>
          <p>Your trusted companion for mental wellness and emotional growth</p>
        </div>
        
        <div className="benefits-grid">
          <div className="benefit-card secure">
            <div className="benefit-icon">🛡️</div>
            <h4>Secure & Private</h4>
            <p>Your mental health data is encrypted and stored securely with complete privacy protection.</p>
          </div>
          <div className="benefit-card personalized">
            <div className="benefit-icon">🎯</div>
            <h4>AI-Powered Insights</h4>
            <p>Receive tailored recommendations based on your unique mental health patterns and progress.</p>
          </div>
          <div className="benefit-card easy">
            <div className="benefit-icon">📱</div>
            <h4>Easy to Use</h4>
            <p>Simple, intuitive interface designed for daily use without overwhelming complexity.</p>
          </div>
          <div className="benefit-card science">
            <div className="benefit-icon">🧠</div>
            <h4>Science-Based</h4>
            <p>Built on proven psychological assessment methods and evidence-based wellness practices.</p>
          </div>
        </div>
        
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Assessment Questions</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">AI Support</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Privacy Protected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;