import React from 'react';

const CrisisAlert = ({ score, onClose }) => {
  const helplines = [
    { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
    { name: 'SAMHSA National Helpline', number: '1-800-662-4357', available: '24/7' },
    { name: 'International Association for Suicide Prevention', number: 'Visit iasp.info', available: 'Global' }
  ];

  return (
    <div className="crisis-overlay">
      <div className="crisis-modal">
        <div className="crisis-header">
          <h2>🆘 Immediate Support Available</h2>
          <button onClick={onClose} className="crisis-close">×</button>
        </div>
        
        <div className="crisis-content">
          <p className="crisis-message">
            Your responses indicate you may be experiencing severe distress. 
            <strong> You are not alone, and help is available.</strong>
          </p>
          
          <div className="crisis-helplines">
            <h3>📞 Crisis Helplines</h3>
            {helplines.map((helpline, index) => (
              <div key={index} className="helpline-item">
                <div className="helpline-name">{helpline.name}</div>
                <div className="helpline-number">{helpline.number}</div>
                <div className="helpline-available">{helpline.available}</div>
              </div>
            ))}
          </div>
          
          <div className="crisis-actions">
            <button onClick={() => window.open('tel:988')} className="btn btn-danger">
              📞 Call 988 Now
            </button>
            <button onClick={() => window.location.href = '/chatbot'} className="btn btn-primary">
              💬 Talk to AI Support
            </button>
          </div>
          
          <div className="crisis-note">
            <p><strong>Remember:</strong> This is a temporary feeling. Professional help can make a significant difference.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisAlert;