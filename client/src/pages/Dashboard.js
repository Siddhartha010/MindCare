import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Gamification from '../components/Gamification';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ user }) => {
  const [progressData, setProgressData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
    fetchAnalytics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProgressData = async () => {
    try {
      const response = await API.get(`/api/progress/${user.id}`);
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await API.get(`/api/progress/analytics/${user.id}`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading dashboard...</div></div>;
  }

  const chartData = {
    labels: progressData.slice(-10).map((_, index) => `Week ${index + 1}`),
    datasets: [
      {
        label: 'Mental Health Score',
        data: progressData.slice(-10).map(item => item.score),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Mental Health Progress Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
      },
    },
  };

  const getScoreColor = (score) => {
    if (score <= 10) return '#10b981'; // Green
    if (score <= 20) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getRecommendation = () => {
    if (progressData.length === 0) return "Take your first quiz to get personalized recommendations!";
    
    const latestScore = progressData[0].score;
    if (latestScore <= 10) {
      return "Great job! Your mental health is in good shape. Keep maintaining healthy habits.";
    } else if (latestScore <= 20) {
      return "Your mental health needs some attention. Consider stress management techniques and regular exercise.";
    } else {
      return "Your mental health requires immediate attention. Consider speaking with a mental health professional.";
    }
  };

  return (
    <div className="container">
      <div className="card-header" style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Your Mental Health Dashboard</h1>
        <p>Track your progress and insights</p>
      </div>

      <Gamification user={user} />

      <div className="grid grid-3">
        <div className="card">
          <h3>📊 Total Assessments</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {analytics?.totalAssessments || 0}
          </div>
        </div>

        <div className="card">
          <h3>📈 Latest Score</h3>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: progressData.length > 0 ? getScoreColor(progressData[0].score) : 'var(--gray)'
          }}>
            {progressData.length > 0 ? `${progressData[0].score}/30` : 'No data'}
          </div>
        </div>

        <div className="card">
          <h3>🎯 Current Level</h3>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: progressData.length > 0 ? getScoreColor(progressData[0].score) : 'var(--gray)'
          }}>
            {progressData.length > 0 ? progressData[0].level : 'No data'}
          </div>
        </div>
      </div>

      {progressData.length > 0 && (
        <div className="card">
          <h3>Progress Chart</h3>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      <div className="card">
        <h3>💡 Personalized Recommendations</h3>
        <div style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          {getRecommendation()}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/chatbot" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            🤖 Get AI Advice
          </a>
          <a href="/wellness" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            💡 View Tips
          </a>
          <a href="/mood" className="btn btn-accent" style={{ textDecoration: 'none' }}>
            🌈 Track Mood
          </a>
        </div>
      </div>

      {progressData.length > 0 && (
        <div className="card">
          <h3>📋 Recent Assessments</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Score</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Level</th>
                </tr>
              </thead>
              <tbody>
                {progressData.slice(0, 5).map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', color: getScoreColor(item.score) }}>
                      {item.score}/30
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        background: getScoreColor(item.score),
                        color: 'white',
                        fontSize: '0.875rem'
                      }}>
                        {item.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <h3>🚀 Quick Actions</h3>
        <div className="grid grid-2" style={{ gap: '1rem', marginTop: '1rem' }}>
          <a href="/mood" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            🌈 Track Mood
          </a>
          <a href="/quiz" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            📊 Take Assessment
          </a>
          <a href="/wellness" className="btn btn-accent" style={{ textDecoration: 'none' }}>
            💡 Wellness Tips
          </a>
          <a href="/community" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            💬 Community Q&A
          </a>
          <a href="/chatbot" className="btn btn-outline" style={{ textDecoration: 'none' }}>
            🤖 AI Assistant
          </a>
        </div>
        <button 
          onClick={async () => {
            try {
              const response = await fetch(`/api/reports/send/${user.id}`, { method: 'POST' });
              const data = await response.json();
              alert(data.message);
            } catch (error) {
              alert('Error sending report');
            }
          }} 
          className="btn btn-primary" 
          style={{ marginTop: '1rem', width: '100%' }}
        >
          📧 Send Full Report to Email
        </button>
      </div>
      
      <div className="card" style={{ textAlign: 'center' }}>
        <h3>📧 Email Reports</h3>
        <p>Get comprehensive mental health reports sent directly to your email with detailed insights, progress tracking, and personalized recommendations.</p>
      </div>

      {progressData.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>👋 Welcome to MindCare!</h3>
          <p style={{ marginBottom: '2rem' }}>
            Start your mental wellness journey by taking your first assessment or tracking your mood.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;