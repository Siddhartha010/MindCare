import React, { useState } from 'react';
import API from '../utils/api';

const TestLogin = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/test');
      setResult('✅ Backend connected: ' + response.data.message);
    } catch (error) {
      setResult('❌ Backend error: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const testDatabase = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/auth/test');
      setResult('✅ Database connected: ' + response.data.message);
    } catch (error) {
      setResult('❌ Database error: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await API.post('/api/auth/register', {
        username: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'password123'
      });
      setResult('✅ Registration successful: ' + JSON.stringify(response.data.user));
    } catch (error) {
      setResult('❌ Registration error: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2>🔧 Debug Panel</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={testBackend} className="btn btn-primary" disabled={loading}>
            Test Backend
          </button>
          <button onClick={testDatabase} className="btn btn-primary" disabled={loading}>
            Test Database
          </button>
          <button onClick={testRegister} className="btn btn-primary" disabled={loading}>
            Test Register
          </button>
        </div>
        
        {loading && <div>Testing...</div>}
        
        {result && (
          <div style={{ 
            padding: '1rem', 
            background: result.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '0.5rem',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLogin;