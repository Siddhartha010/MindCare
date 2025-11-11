import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import CrisisAlert from '../components/CrisisAlert';

const Quiz = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await API.get('/api/quiz/questions');
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const handleResponse = (questionId, responseIndex) => {
    setResponses({
      ...responses,
      [questionId]: responseIndex
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const responseArray = questions.map(q => responses[q.id] || 0);
      const weekNumber = Date.now(); // Use timestamp instead of week number
      
      const response = await API.post('/api/quiz/submit', {
        userId: user.id,
        responses: responseArray,
        weekNumber: weekNumber
      });
      
      setResult(response.data);
      
      // Check for crisis situation (score <= 4 indicates severe distress)
      if (response.data.score <= 4) {
        setShowCrisisAlert(true);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading quiz...</div></div>;
  }

  if (result) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
          <div style={{ background: '#10b981', color: 'white', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            ✅ Your response has been recorded successfully!
          </div>
          <h2>Quiz Complete! 🎉</h2>
          <div style={{ margin: '2rem 0' }}>
            <div style={{ fontSize: '3rem', margin: '1rem 0' }}>
              {result.level === 'Good' ? '😊' : result.level === 'Moderate' ? '😐' : '😟'}
            </div>
            <h3>Mental Health Level: {result.level}</h3>
            <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
              Score: {result.score}/30
            </p>
            <p>{result.message}</p>
            <p style={{ marginTop: '1rem', color: '#666' }}>Your results have been saved and will appear on your dashboard.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Take Again
            </button>
            <button onClick={() => { window.location.href = '/dashboard'; window.location.reload(); }} className="btn btn-outline">
              View Progress
            </button>
            <button onClick={() => window.location.href = '/mood'} className="btn btn-secondary">
              Track Mood
            </button>
            <button onClick={() => window.location.href = '/chatbot'} className="btn btn-accent">
              Get Recommendations
            </button>
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
              className="btn btn-secondary"
            >
              📧 Email Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <div className="card-header">
          <h2 className="card-title">Weekly Mental Health Assessment</h2>
          <div style={{ background: '#e2e8f0', borderRadius: '1rem', height: '8px', margin: '1rem 0' }}>
            <div 
              style={{ 
                background: 'var(--primary)', 
                height: '100%', 
                borderRadius: '1rem', 
                width: `${progress}%`,
                transition: 'width 0.3s'
              }}
            />
          </div>
          <p>Question {currentQuestion + 1} of {questions.length}</p>
        </div>

        <div className="quiz-question">
          <h3 style={{ marginBottom: '1.5rem' }}>{question.question}</h3>
          <div className="quiz-options">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`quiz-option ${responses[question.id] === index ? 'selected' : ''}`}
                onClick={() => handleResponse(question.id, index)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button
            onClick={prevQuestion}
            className="btn btn-outline"
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              className="btn btn-primary"
              disabled={submitting || Object.keys(responses).length < questions.length}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="btn btn-primary"
              disabled={responses[question.id] === undefined}
            >
              Next
            </button>
          )}
        </div>
      </div>
      
      {showCrisisAlert && (
        <CrisisAlert 
          score={result.score} 
          onClose={() => setShowCrisisAlert(false)} 
        />
      )}
    </div>
  );
};

export default Quiz;