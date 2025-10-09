// Simple test script to verify authentication
const axios = require('axios');

const testAuth = async () => {
  try {
    console.log('Testing authentication...');
    
    // Test registration
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Registration successful:', registerResponse.data);
    
    // Test login
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login successful:', loginResponse.data);
    
  } catch (error) {
    console.error('Auth test failed:', error.response?.data || error.message);
  }
};

testAuth();