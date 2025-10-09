// Simple in-memory database for development
let users = [];
let quizResponses = [];
let chatHistory = [];
let moodEntries = [];
let nextUserId = 1;

const simpleDB = {
  // Users
  createUser: (username, email, password) => {
    const user = {
      id: nextUserId++,
      username,
      email,
      password,
      created_at: new Date()
    };
    users.push(user);
    return user;
  },

  findUserByEmail: (email) => {
    return users.find(user => user.email === email);
  },

  // Quiz responses
  createQuizResponse: (userId, weekNumber, responses, score, level) => {
    const response = {
      id: Date.now(),
      user_id: userId,
      week_number: weekNumber,
      responses: JSON.stringify(responses),
      score,
      mental_health_level: level,
      created_at: new Date()
    };
    quizResponses.push(response);
    return response;
  },

  getQuizResponsesByUser: (userId) => {
    return quizResponses.filter(r => r.user_id === userId);
  },

  // Chat history
  createChatMessage: (userId, message, response) => {
    const chat = {
      id: Date.now(),
      user_id: userId,
      message,
      response,
      created_at: new Date()
    };
    chatHistory.push(chat);
    return chat;
  },

  getChatHistory: (userId) => {
    return chatHistory.filter(c => c.user_id === userId);
  },

  // Community Q&A
  createQuestion: (userId, title, content, category) => {
    const question = {
      id: Date.now(),
      user_id: userId,
      title,
      content,
      category: category || 'General',
      replies: [],
      created_at: new Date()
    };
    if (!global.questions) global.questions = [];
    global.questions.push(question);
    return question;
  },

  getAllQuestions: () => {
    return global.questions || [];
  },

  getQuestionById: (questionId) => {
    return (global.questions || []).find(q => q.id === parseInt(questionId));
  },

  addReply: (questionId, userId, content) => {
    const question = (global.questions || []).find(q => q.id === parseInt(questionId));
    if (question) {
      const reply = {
        id: Date.now(),
        user_id: userId,
        content,
        created_at: new Date()
      };
      question.replies.push(reply);
      return reply;
    }
    return null;
  },

  // Mood tracking
  createMoodEntry: (userId, mood, note) => {
    const moodValues = {
      'Happy': 5, 'Grateful': 5, 'Calm': 4, 'Neutral': 3,
      'Tired': 2, 'Sad': 2, 'Anxious': 1, 'Angry': 1
    };
    
    const entry = {
      id: Date.now(),
      user_id: userId,
      mood,
      value: moodValues[mood] || 3,
      note: note || '',
      created_at: new Date()
    };
    moodEntries.push(entry);
    return entry;
  },

  getMoodHistory: (userId) => {
    return moodEntries.filter(m => m.user_id === userId).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  // Gamification
  getUserStats: (userId) => {
    const userQuizzes = quizResponses.filter(q => q.user_id === userId);
    const userMoods = moodEntries.filter(m => m.user_id === userId);
    
    // Calculate streaks
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toDateString());
    }
    
    const moodStreak = last7Days.reduce((streak, dateStr) => {
      const hasEntry = userMoods.some(m => new Date(m.created_at).toDateString() === dateStr);
      return hasEntry ? streak + 1 : 0;
    }, 0);
    
    // Calculate badges
    const badges = [];
    if (userQuizzes.length >= 1) badges.push({ name: 'First Steps', icon: '🌱', description: 'Completed first assessment' });
    if (userQuizzes.length >= 5) badges.push({ name: 'Consistent Tracker', icon: '📊', description: 'Completed 5 assessments' });
    if (userMoods.length >= 7) badges.push({ name: 'Mood Master', icon: '🌈', description: 'Tracked mood for 7 days' });
    if (moodStreak >= 3) badges.push({ name: 'Streak Champion', icon: '🔥', description: '3-day mood tracking streak' });
    if (userQuizzes.length >= 10) badges.push({ name: 'Wellness Warrior', icon: '⭐', description: 'Completed 10 assessments' });
    
    return {
      totalQuizzes: userQuizzes.length,
      totalMoodEntries: userMoods.length,
      currentStreak: moodStreak,
      badges,
      points: (userQuizzes.length * 10) + (userMoods.length * 5) + (moodStreak * 2)
    };
  }
};

module.exports = simpleDB;