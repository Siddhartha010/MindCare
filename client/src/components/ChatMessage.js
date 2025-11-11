import React, { useState, useEffect } from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message, type, timestamp, isTyping }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    if (type === 'bot' && !isTyping) {
      const interval = setInterval(() => {
        if (currentIndex < message.length) {
          setDisplayedText(prev => prev + message[currentIndex]);
          setCurrentIndex(currentIndex + 1);
        } else {
          clearInterval(interval);
        }
      }, 30); // Adjust speed of typing animation

      return () => clearInterval(interval);
    } else {
      setDisplayedText(message);
    }
  }, [message, currentIndex, type, isTyping]);

  const renderTypingIndicator = () => (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );

  const renderEmoji = () => {
    if (type === 'bot') {
      return '🤖';
    } else {
      return '👤';
    }
  };

  return (
    <div className={`chat-message-wrapper ${type} ${isVisible ? 'visible' : ''}`}>
      <div className="message-avatar">{renderEmoji()}</div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">{type === 'user' ? 'You' : 'AI Assistant'}</span>
          <span className="message-time">{timestamp.toLocaleTimeString()}</span>
        </div>
        <div className={`message-bubble ${type}`}>
          {isTyping ? renderTypingIndicator() : displayedText}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;