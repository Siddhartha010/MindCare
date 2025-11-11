import React from 'react';
import { motion } from 'framer-motion';
import BreathingExerciseComponent from '../components/BreathingExercise';
import './PageStyles.css';

const BreathingExercisePage = () => {
  return (
    <div className="page-container breathing-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Mindful Breathing</h1>
        <p className="page-description">
          Practice these scientifically-proven breathing exercises to reduce stress, anxiety, and improve your mental well-being.
          Just a few minutes of mindful breathing each day can help you stay centered and calm throughout your day.
          <span className="highlight">Discover the power of your breath</span> and transform your mental state with these simple techniques.
        </p>
      </motion.div>
      <BreathingExerciseComponent />
    </div>
  );
};

export default BreathingExercisePage;