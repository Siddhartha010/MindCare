import React, { useState } from 'react';

const WellnessTips = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const tips = [
    { category: 'mindfulness', icon: '🧘', title: 'Practice Deep Breathing', tip: 'Take 5 deep breaths: inhale for 4 counts, hold for 4, exhale for 6. This activates your parasympathetic nervous system.' },
    { category: 'exercise', icon: '🏃', title: 'Move Your Body', tip: 'Even 10 minutes of walking can boost endorphins and improve mood. Try dancing to your favorite song!' },
    { category: 'sleep', icon: '😴', title: 'Sleep Hygiene', tip: 'Create a bedtime routine: dim lights 1 hour before bed, avoid screens, and keep your room cool (65-68°F).' },
    { category: 'nutrition', icon: '🥗', title: 'Brain-Healthy Foods', tip: 'Include omega-3 rich foods like salmon, walnuts, and chia seeds. Dark leafy greens support neurotransmitter production.' },
    { category: 'social', icon: '🤝', title: 'Connect with Others', tip: 'Reach out to a friend or family member. Social connections are vital for mental health and longevity.' },
    { category: 'mindfulness', icon: '📝', title: 'Gratitude Practice', tip: 'Write down 3 things you\'re grateful for each day. This simple practice can rewire your brain for positivity.' },
    { category: 'stress', icon: '🌱', title: 'Nature Therapy', tip: 'Spend 20 minutes in nature. Studies show it reduces cortisol levels and improves overall well-being.' },
    { category: 'creativity', icon: '🎨', title: 'Creative Expression', tip: 'Engage in creative activities like drawing, music, or writing. Creativity reduces stress and boosts self-esteem.' }
  ];

  const categories = [
    { id: 'all', name: 'All Tips', icon: '🌟' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
    { id: 'exercise', name: 'Exercise', icon: '🏃' },
    { id: 'sleep', name: 'Sleep', icon: '😴' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
    { id: 'social', name: 'Social', icon: '🤝' },
    { id: 'stress', name: 'Stress Relief', icon: '🌱' },
    { id: 'creativity', name: 'Creativity', icon: '🎨' }
  ];

  const filteredTips = selectedCategory === 'all' ? tips : tips.filter(tip => tip.category === selectedCategory);

  return (
    <div className="container">
      <div className="wellness-header">
        <h1>💡 Daily Wellness Tips</h1>
        <p>Evidence-based practices for better mental health</p>
      </div>

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="tips-grid">
        {filteredTips.map((tip, index) => (
          <div key={index} className="tip-card">
            <div className="tip-icon">{tip.icon}</div>
            <h3 className="tip-title">{tip.title}</h3>
            <p className="tip-content">{tip.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WellnessTips;