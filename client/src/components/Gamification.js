import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const Gamification = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchStats = async () => {
    try {
      const response = await API.get(`/api/gamification/${user.id}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.id) return;
    fetchStats();
    // only re-run when the user id changes
  }, [user && user.id]);

  if (loading) return <div>Loading stats...</div>;
  if (!stats) return null;

  return (
    <div className="gamification-section">
      <div className="stats-overview">
        <div className="stat-card points">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{stats.points}</div>
          <div className="stat-label">Wellness Points</div>
        </div>
        
        <div className="stat-card streak">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{stats.currentStreak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        
        <div className="stat-card assessments">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.totalQuizzes}</div>
          <div className="stat-label">Assessments</div>
        </div>
        
        <div className="stat-card moods">
          <div className="stat-icon">🌈</div>
          <div className="stat-value">{stats.totalMoodEntries}</div>
          <div className="stat-label">Mood Entries</div>
        </div>
      </div>

      {stats.badges.length > 0 && (
        <div className="badges-section">
          <h3>🏅 Your Achievements</h3>
          <div className="badges-grid">
            {stats.badges.map((badge, index) => (
              <div key={index} className="badge-item">
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-name">{badge.name}</div>
                <div className="badge-description">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gamification;
