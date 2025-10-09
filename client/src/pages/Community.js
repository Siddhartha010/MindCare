import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const Community = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', category: 'General' });
  const [replyContent, setReplyContent] = useState({});
  const [loading, setLoading] = useState(true);

  const categories = ['General', 'Anxiety', 'Depression', 'Stress', 'Sleep', 'Relationships', 'Work'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await API.get('/api/community/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/community/questions', {
        userId: user.id,
        ...newQuestion
      });
      setNewQuestion({ title: '', content: '', category: 'General' });
      setShowForm(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error posting question:', error);
    }
  };

  const submitReply = async (questionId) => {
    try {
      await API.post(`/api/community/questions/${questionId}/reply`, {
        userId: user.id,
        content: replyContent[questionId]
      });
      setReplyContent({ ...replyContent, [questionId]: '' });
      fetchQuestions();
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="community-header">
        <h1>💬 Community Q&A</h1>
        <p>Ask questions and share experiences with the community</p>
      </div>

      <div className="community-actions">
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '❓ Ask a Question'}
        </button>
      </div>

      {showForm && (
        <div className="card question-form">
          <h3>Ask Your Question</h3>
          <form onSubmit={submitQuestion}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                value={newQuestion.category}
                onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                className="form-input"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Question Title</label>
              <input
                type="text"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                className="form-input"
                placeholder="What's your question?"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Details</label>
              <textarea
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                className="form-input"
                rows="4"
                placeholder="Provide more details about your question..."
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Post Question</button>
          </form>
        </div>
      )}

      <div className="questions-list">
        {questions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>No questions yet</h3>
            <p>Be the first to ask a question!</p>
          </div>
        ) : (
          questions.map(question => (
            <div key={question.id} className="card question-card">
              <div className="question-header">
                <div className="question-meta">
                  <span className="category-tag">{question.category}</span>
                  <span className="question-author">by {question.username}</span>
                  <span className="question-date">{new Date(question.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <h3 className="question-title">{question.title}</h3>
              <p className="question-content">{question.content}</p>
              
              <div className="replies-section">
                <h4>💬 Replies ({question.replies.length})</h4>
                
                {question.replies.map(reply => (
                  <div key={reply.id} className="reply-item">
                    <div className="reply-meta">
                      <span className="reply-author">{reply.username}</span>
                      <span className="reply-date">{new Date(reply.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="reply-content">{reply.content}</p>
                  </div>
                ))}
                
                <div className="reply-form">
                  <textarea
                    value={replyContent[question.id] || ''}
                    onChange={(e) => setReplyContent({...replyContent, [question.id]: e.target.value})}
                    className="form-input"
                    placeholder="Share your thoughts or advice..."
                    rows="3"
                  />
                  <button 
                    onClick={() => submitReply(question.id)}
                    disabled={!replyContent[question.id]?.trim()}
                    className="btn btn-secondary"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;