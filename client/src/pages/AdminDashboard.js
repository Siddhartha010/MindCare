import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [filters, setFilters] = useState({
    user: '',
    type: '',
    dateRange: 'all'
  });

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchActivities();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.is_admin) {
        // Verify admin status with the server
        const response = await API.get('/api/auth/verify-admin');
        if (response.data.isAdmin) {
          setIsAdmin(true);
        } else {
          setError('You do not have admin privileges.');
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Error verifying admin status:', error);
      setError('Failed to verify admin status');
      setIsAdmin(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/activity/all');
      const allActivities = response.data;

      // Separate login activities
      const loginActivities = allActivities.filter(a => a.activity_type === 'login');
      
      // Get unique users who logged in
      const uniqueUsers = [...new Map(loginActivities.map(a => [a.user_id, a])).values()];
      setLogins(uniqueUsers);

      // Group other activities by user
      const otherActivities = allActivities.filter(a => a.activity_type !== 'login');
      setActivities(otherActivities);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.response?.data?.error || 'Failed to load activities');
      setLoading(false);
    }
  };

  const filterActivities = () => {
    return activities.filter(activity => {
      const matchesUser = !filters.user || 
        activity.username.toLowerCase().includes(filters.user.toLowerCase()) ||
        activity.email.toLowerCase().includes(filters.user.toLowerCase());
      
      const matchesType = !filters.type || activity.activity_type === filters.type;
      
      let matchesDate = true;
      const activityDate = new Date(activity.created_at);
      const now = new Date();
      
      if (filters.dateRange === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        matchesDate = activityDate >= today;
      } else if (filters.dateRange === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = activityDate >= weekAgo;
      } else if (filters.dateRange === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        matchesDate = activityDate >= monthAgo;
      }
      
      return matchesUser && matchesType && matchesDate;
    });
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div className="admin-loading">Loading activities...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;

  // Group activities by user
  const userActivities = filterActivities().reduce((acc, activity) => {
    if (!acc[activity.user_id]) {
      acc[activity.user_id] = [];
    }
    acc[activity.user_id].push(activity);
    return acc;
  }, {});

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>User Activities Monitor</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search user..."
            value={filters.user}
            onChange={(e) => setFilters({...filters, user: e.target.value})}
            className="filter-input"
          />
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            className="filter-input"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="login-section">
        <h2>Recent Logins ({logins.length} users)</h2>
        <div className="login-cards">
          {logins.map((login) => (
            <div key={login.user_id} className="login-card">
              <div className="user-info">
                <span className="username">{login.username}</span>
                <span className="email">{login.email}</span>
              </div>
              <div className="login-time">
                Last login: {new Date(login.created_at).toLocaleString()}
              </div>
              <button 
                className="view-activities-btn"
                onClick={() => setExpandedUser(expandedUser === login.user_id ? null : login.user_id)}
              >
                {expandedUser === login.user_id ? 'Hide Activities' : 'View Activities'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {logins.map((login) => (
        expandedUser === login.user_id && (
          <div key={`activities-${login.user_id}`} className="user-activities-section">
            <h3>Activities for {login.username}</h3>
            <div className="activities-summary">
              <div className="summary-card">
                <h4>Quiz Attempts</h4>
                <p>{userActivities[login.user_id]?.filter(a => a.activity_type === 'quiz').length || 0}</p>
              </div>
              <div className="summary-card">
                <h4>Mood Entries</h4>
                <p>{userActivities[login.user_id]?.filter(a => a.activity_type === 'mood').length || 0}</p>
              </div>
              <div className="summary-card">
                <h4>Chat Sessions</h4>
                <p>{userActivities[login.user_id]?.filter(a => a.activity_type === 'chatbot').length || 0}</p>
              </div>
              <div className="summary-card">
                <h4>Community Posts</h4>
                <p>{userActivities[login.user_id]?.filter(a => a.activity_type === 'community').length || 0}</p>
              </div>
            </div>
            <div className="activities-timeline">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Activity</th>
                    <th>Description</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {(userActivities[login.user_id] || [])
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((activity, index) => (
                    <tr key={index}>
                      <td>{new Date(activity.created_at).toLocaleString()}</td>
                      <td>
                        <span className={`activity-type ${activity.activity_type}`}>
                          {activity.activity_type}
                        </span>
                      </td>
                      <td>{activity.description}</td>
                      <td>{activity.page_url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default AdminDashboard;
