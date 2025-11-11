import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import './BreathingExercise.css';

const BreathingExercise = () => {
  const [phase, setPhase] = useState('inhale');
  const [timer, setTimer] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState({
    inhale: 4,
    hold: 7,
    exhale: 8,
    name: '4-7-8 Technique'
  });
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [completedCycles, setCompletedCycles] = useState(0);

  const breathingPatterns = [
    { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 Technique', description: 'Helps reduce anxiety and helps sleep' },
    { inhale: 4, hold: 4, exhale: 4, name: 'Box Breathing', description: 'Reduces stress and improves focus' },
    { inhale: 5, hold: 0, exhale: 5, name: 'Deep Breathing', description: 'Increases oxygen and calms the mind' },
    { inhale: 2, hold: 0, exhale: 4, name: 'Relaxing Breath', description: 'Promotes relaxation and stress relief' }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                return selectedPattern.hold || 0;
              case 'hold':
                setPhase('exhale');
                return selectedPattern.exhale;
              case 'exhale':
                setPhase('inhale');
                // Increment completed cycles when a full cycle is done
                setCompletedCycles(prev => prev + 1);
                return selectedPattern.inhale;
              default:
                return prevTimer;
            }
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase, selectedPattern]);

  const toggleExercise = () => {
    if (!isActive) {
      // Starting a new session
      setPhase('inhale');
      setTimer(selectedPattern.inhale);
      setSessionStartTime(new Date());
      setCompletedCycles(0);
    } else {
      // Ending the session, log the activity
      const sessionDuration = Math.floor((new Date() - sessionStartTime) / 1000); // in seconds
      logBreathingSession(sessionDuration);
    }
    setIsActive(!isActive);
  };
  
  // Function to log the breathing session to the backend
  const logBreathingSession = async (duration) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('/api/breathing/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          pattern: selectedPattern.name,
          duration: duration,
          completed: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to log breathing session');
      }
    } catch (error) {
      console.error('Error logging breathing session:', error);
    }
  };

  const selectPattern = (pattern) => {
    setSelectedPattern(pattern);
    setIsActive(false);
    setPhase('inhale');
    setTimer(pattern.inhale);
    setCompletedCycles(0);
  };
  
  // Particle.js configuration and initialization
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);
  
  // Get particle configuration based on current breathing phase
  const getParticlesConfig = () => {
    const baseConfig = {
      fpsLimit: 60,
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: phase === 'inhale' ? '#74c0fc' : 
                 phase === 'hold' ? '#4dabf7' : '#91a7ff'
        },
        shape: {
          type: "circle"
        },
        opacity: {
          value: 0.5,
          random: false,
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.1,
            sync: false
          }
        },
        move: {
          enable: true,
          speed: phase === 'inhale' ? 3 : 
                 phase === 'hold' ? 1 : 2,
          direction: phase === 'inhale' ? "none" : 
                     phase === 'hold' ? "none" : "outside",
          random: true,
          straight: false,
          outModes: {
            default: "out"
          },
          attract: {
            enable: phase === 'inhale',
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: {
            enable: true,
            mode: "grab"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            lineLinked: {
              opacity: 0.5
            }
          }
        }
      },
      detectRetina: true
    };
    
    return baseConfig;
  };

  return (
    <div className="breathing-exercise-page">
      {/* Particles background that changes with breathing phase */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={getParticlesConfig()}
        className="particles-background"
      />
      
      <div className="breathing-container">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="breathing-title"
        >
          Mindful Breathing
        </motion.h2>
        
        <div className="breathing-content">
          <div className="pattern-selector">
            {breathingPatterns.map((pattern, index) => (
              <motion.div
                key={index}
                className="pattern-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  className={`pattern-button ${selectedPattern.name === pattern.name ? 'active' : ''}`}
                  onClick={() => selectPattern(pattern)}
                >
                  {pattern.name}
                </button>
                <p className="pattern-description">{pattern.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="exercise-area">
            <motion.div 
              className={`breathing-circle ${isActive ? phase : ''}`}
              animate={{
                scale: isActive && phase === 'inhale' ? 1.2 :
                       isActive && phase === 'hold' ? 1.2 : 1
              }}
              transition={{ duration: isActive ? (phase === 'inhale' ? selectedPattern.inhale : 
                                                phase === 'exhale' ? selectedPattern.exhale : 1) : 0.5 }}
            >
              <div className="circle-content">
                <div className="instruction">{phase.charAt(0).toUpperCase() + phase.slice(1)}</div>
                <div className="timer">{timer}s</div>
                {isActive && (
                  <div className="cycles-counter">Cycles: {completedCycles}</div>
                )}
              </div>
            </motion.div>

            <motion.button 
              className="control-button"
              onClick={toggleExercise}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive ? 'End Session' : 'Begin'}
            </motion.button>
          </div>
          
          <motion.div 
            className="instructions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3>How to practice:</h3>
            <ol>
              <li>Find a comfortable position in a quiet space</li>
              <li>Select a breathing pattern that suits your needs</li>
              <li>Click Begin to start your mindfulness session</li>
              <li>Follow the animation and timing for each breath</li>
              <li>Focus on your breath and let go of distracting thoughts</li>
              <li>Continue for at least 5-10 cycles for best results</li>
            </ol>
          </motion.div>
        </div>
        
        {isActive && (
          <div className="session-info">
            <p>Session in progress - Focus on your breath</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;