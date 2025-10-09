import React, { useState, useEffect, useRef } from 'react';
import API from '../utils/api';

const Chatbot = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
    // Add welcome message
    setMessages([{
      type: 'bot',
      message: `Hello ${user.username}! 👋 I'm your AI mental health assistant. I can help you with stress management, sleep tips, diet advice, exercise suggestions, and relaxation techniques. What would you like to know about today?`,
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await API.get(`/api/chatbot/history/${user.id}`);
      const history = response.data.map(item => [
        { type: 'user', message: item.message, timestamp: new Date(item.created_at) },
        { type: 'bot', message: item.response, timestamp: new Date(item.created_at) }
      ]).flat();
      setMessages(prev => [...prev, ...history]);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    const messageToSend = inputMessage;
    setInputMessage('');

    try {
      const response = await API.post('/api/chatbot/chat', {
        userId: user.id,
        message: messageToSend
      });

      const botMessage = {
        type: 'bot',
        message: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'bot',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How can I manage stress?",
    "Tips for better sleep",
    "Healthy diet for mental health",
    "Relaxation techniques",
    "Exercise for mood improvement"
  ];

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <div className="card-header">
          <h2 className="card-title">🤖 AI Mental Health Assistant</h2>
          <p>Get personalized advice and support for your mental wellness journey</p>
        </div>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                <div style={{ marginBottom: '0.25rem', fontSize: '0.875rem', opacity: 0.7 }}>
                  {msg.type === 'user' ? 'You' : 'AI Assistant'} • {msg.timestamp.toLocaleTimeString()}
                </div>
                {msg.message}
              </div>
            ))}
            {loading && (
              <div className="chat-message bot">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)',
                    animation: 'pulse 1.5s infinite'
                  }} />
                  AI Assistant is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--gray)' }}>
              Quick questions:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--border)',
                    borderRadius: '1rem',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'var(--primary)';
                    e.target.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = 'inherit';
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about stress, sleep, diet, exercise, or relaxation techniques..."
              className="chat-input form-input"
              rows="3"
              style={{ resize: 'none' }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || loading}
              className="btn btn-primary"
              style={{ alignSelf: 'flex-end' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <h3>💡 What I can help you with:</h3>
        <div className="grid grid-2">
          <div>
            <h4>🧘‍♀️ Stress Management</h4>
            <p>Breathing exercises, mindfulness techniques, and coping strategies</p>
          </div>
          <div>
            <h4>😴 Sleep Improvement</h4>
            <p>Sleep hygiene tips, bedtime routines, and relaxation methods</p>
          </div>
          <div>
            <h4>🥗 Nutrition Advice</h4>
            <p>Brain-healthy foods, mood-boosting nutrients, and eating habits</p>
          </div>
          <div>
            <h4>🏃‍♂️ Exercise & Activity</h4>
            <p>Physical activities that improve mental health and mood</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;