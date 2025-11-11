import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const MoodTracker = ({ user }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const moods = [
    { emoji: '😊', name: 'Happy', value: 5, color: '#10b981' },
    { emoji: '😌', name: 'Calm', value: 4, color: '#06b6d4' },
    { emoji: '😐', name: 'Neutral', value: 3, color: '#6b7280' },
    { emoji: '😔', name: 'Sad', value: 2, color: '#f59e0b' },
    { emoji: '😰', name: 'Anxious', value: 1, color: '#ef4444' },
    { emoji: '😡', name: 'Angry', value: 1, color: '#dc2626' },
    { emoji: '😴', name: 'Tired', value: 2, color: '#8b5cf6' },
    { emoji: '🤗', name: 'Grateful', value: 5, color: '#ec4899' }
  ];

  const fetchMoodHistory = async () => {
    if (!user || !user.id) return;
    try {
      const response = await API.get(`/api/mood/${user.id}`);
      setMoodHistory(response.data);
    } catch (error) {
      console.error('Error fetching mood history:', error);
    }
  };

  useEffect(() => {
    if (!user || !user.id) return;
    fetchMoodHistory();
    // run when user id changes
  }, [user && user.id]);

  const saveMood = async () => {
    if (!selectedMood) return;
    
    setLoading(true);
    try {
      await API.post('/api/mood/save', {
        userId: user.id,
        mood: selectedMood,
        note: note
      });
      
      alert('✅ Mood saved successfully!');
      setSelectedMood('');
      setNote('');
      fetchMoodHistory();
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('❌ Error saving mood: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getMoodStats = () => {
    if (moodHistory.length === 0) return null;
    
    const recent = moodHistory.slice(-7);
    const avgMood = recent.reduce((sum, entry) => sum + entry.value, 0) / recent.length;
    const trend = recent.length > 1 ? recent[recent.length - 1].value - recent[0].value : 0;
    
    return { avgMood, trend, totalEntries: moodHistory.length };
  };

  const stats = getMoodStats();

  return (
    <div className="container">
      <div className="mood-header">
        <h1>🌈 Daily Mood Tracker</h1>
        <p>Track your emotional well-being with simple emoji selections</p>
      </div>

      <div className="grid grid-2">
        <div className="card mood-selector">
          <h3>How are you feeling today?</h3>
          <div className="mood-grid">
            {moods.map((mood) => (
              <div
                key={mood.name}
                className={`mood-option ${selectedMood === mood.name ? 'selected' : ''}`}
                onClick={() => setSelectedMood(mood.name)}
                style={{ '--mood-color': mood.color }}
              >
                <div className="mood-emoji">{mood.emoji}</div>
                <div className="mood-name">{mood.name}</div>
              </div>
            ))}
          </div>
          
          <div className="form-group">
            <label className="form-label">Add a note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-input"
              placeholder="What's on your mind?"
              rows="3"
            />
          </div>
          
          <button
            onClick={saveMood}
            disabled={!selectedMood || loading}
            className="btn btn-primary mood-save-btn"
          >
            {loading ? 'Saving...' : 'Save Mood'}
          </button>
        </div>

        {stats && (
          <div className="card mood-stats">
            <h3>📊 Your Mood Insights</h3>
            <div className="stat-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.avgMood.toFixed(1)}/5</div>
                <div className="stat-label">7-Day Average</div>
              </div>
              <div className="stat-item">
                <div className="stat-value" style={{ color: stats.trend > 0 ? '#10b981' : stats.trend < 0 ? '#ef4444' : '#6b7280' }}>
                  {stats.trend > 0 ? '📈' : stats.trend < 0 ? '📉' : '➡️'}
                </div>
                <div className="stat-label">Trend</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.totalEntries}</div>
                <div className="stat-label">Total Entries</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {moodHistory.length > 0 && (
        <div className="card">
          <h3>📅 Recent Mood History</h3>
          <div className="mood-timeline">
            {moodHistory.slice(-10).reverse().map((entry, index) => {
              const mood = moods.find(m => m.name === entry.mood);
              return (
                <div key={index} className="timeline-item">
                  <div className="timeline-emoji">{mood?.emoji}</div>
                  <div className="timeline-content">
                    <div className="timeline-mood">{entry.mood}</div>
                    <div className="timeline-date">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                    {entry.note && <div className="timeline-note">"{entry.note}"</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
