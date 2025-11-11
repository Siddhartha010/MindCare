import API from './api';

const ActivityTracker = {
  async logActivity(activityType, description = '', pageUrl = window.location.pathname) {
    try {
      await API.post('/api/activity/log', {
        activity_type: activityType,
        description,
        page_url: pageUrl
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  },

  // Predefined activity types
  ACTIVITIES: {
    PAGE_VIEW: 'page_view',
    LOGIN: 'login',
    LOGOUT: 'logout',
    QUIZ_START: 'quiz_start',
    QUIZ_COMPLETE: 'quiz_complete',
    MOOD_LOG: 'mood_log',
    CHAT_MESSAGE: 'chat_message',
    COMMUNITY_POST: 'community_post',
    COMMUNITY_COMMENT: 'community_comment'
  }
};

export default ActivityTracker;