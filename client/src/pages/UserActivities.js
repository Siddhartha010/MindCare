import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../utils/api';
import './UserActivities.css';

const UserActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    search: ''
  });

  useEffect(() => {
    checkAdminStatus();
    fetchActivities();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.is_admin) {
        setIsAdmin(true);
      } else {
        setError('Access denied. Admin privileges required.');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setError('Failed to verify admin status');
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await API.get('/api/activity/all');
      setActivities(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to fetch activities');
        console.error('Error fetching activities:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    return activities.filter(activity => {
      const matchesType = filters.type === '' || activity.activity_type === filters.type;
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = filters.search === '' || 
        activity.description?.toLowerCase().includes(searchTerm) ||
        activity.username?.toLowerCase().includes(searchTerm) ||
        activity.email?.toLowerCase().includes(searchTerm) ||
        activity.page_url?.toLowerCase().includes(searchTerm);
      return matchesType && matchesSearch;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div className="loading">Loading activities...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const filteredActivities = filterActivities();

  return (
    <div className="activities-container">
      <div className="activities-header">
        <h1>Your Activities</h1>
        <p>Track your journey and progress through the platform</p>
        
        <div className="activities-filters">
          <select 
            className="filter-input"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="">All Activities</option>
            <option value="page_view">Page Views</option>
            <option value="login">Login Events</option>
            <option value="quiz">Quiz Activities</option>
            <option value="mood">Mood Tracking</option>
            <option value="chat">Chat Interactions</option>
          </select>

          <input
            type="text"
            placeholder="Search activities..."
            className="filter-input"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
      </div>

      {filteredActivities.length > 0 ? (
        <div className="activities-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Type</th>
                <th>Details</th>
                <th>Page</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{formatDate(activity.created_at)}</td>
                  <td>{activity.username} ({activity.email})</td>
                  <td>
                    <span className={`activity-type ${activity.activity_type}`}>
                      {activity.activity_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{activity.description}</td>
                  <td>{activity.page_url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-activities">
          <h3>No activities found</h3>
          <p>Try adjusting your filters or come back later</p>
        </div>
      )}
    </div>
  );
};

export default UserActivities;