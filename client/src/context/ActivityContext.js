import React, { createContext, useContext, useCallback } from 'react';
import API from '../utils/api';

const ActivityContext = createContext();

export function ActivityProvider({ children }) {
  const logActivity = useCallback(async (activityType, description, pageUrl = window.location.pathname) => {
    try {
      await API.post('/api/activity/log', {
        activity_type: activityType,
        description,
        page_url: pageUrl
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }, []);

  return (
    <ActivityContext.Provider value={{ logActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
