import React from 'react';
import { Link } from 'react-router-dom';
import './landing.css';

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-overlay">
        <div className="landing-inner">
          <div className="landing-content">
            <h1 className="landing-title">Transform Your <span className="highlight">Fitness Journey</span></h1>
            <p className="landing-description">
              Track workouts, monitor nutrition, achieve goals, and join a community of fitness enthusiasts all in one place
            </p>
            
            <div className="landing-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outlined btn-lg">
                Sign In
              </Link>
            </div>
          </div>

          <div className="landing-image">
            {/* Image placeholder - will be styled via CSS */}
            <div className="image-placeholder"></div>
          </div>
        </div>

        <div className="features-section">
          <h2 className="section-title">Everything you need to reach your goals</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon exercise-icon"></div>
              <h3>Workout Tracking</h3>
              <p>Log and analyze your exercise routines with detailed metrics and progress charts</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon nutrition-icon"></div>
              <h3>Nutrition Logging</h3>
              <p>Track your meals, calories, and nutrients to maintain a balanced diet</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon goals-icon"></div>
              <h3>Goal Setting</h3>
              <p>Set SMART fitness goals and track your progress with visual indicators</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon community-icon"></div>
              <h3>Community</h3>
              <p>Join groups, share achievements, and stay motivated with like-minded fitness enthusiasts</p>
            </div>
          </div>
        </div>
        
        <div className="cta-section">
          <h2>Ready to start your fitness journey?</h2>
          <p>Join thousands of users already transforming their lives</p>
          <Link to="/register" className="btn btn-secondary btn-lg">Sign Up Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;