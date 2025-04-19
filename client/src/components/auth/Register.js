import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = ({ auth }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    realName: '',
    email: '',
    password: '',
    password2: ''
  });
  
  const [error, setError] = useState('');
  
  const { username, realName, email, password, password2 } = formData;
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = async e => {
    e.preventDefault();
    console.log('Registration form submitted with:', {username, realName, email});
    
    if (password !== password2) {
      console.error('Password validation failed: passwords do not match');
      setError('Passwords do not match');
      return;
    }
    
    console.log('Attempting to register user...');
    const success = await auth.register({ username, realName, email, password });
    console.log('Registration attempt result:', success ? 'success' : 'failed');
    
    if (success) {
      console.log('Redirecting to dashboard...');
      navigate('/dashboard');
    } else {
      console.error('Registration failed');
      setError('Registration failed. Please try again.');
    }
  };
  
  return (
    <div className="auth-container">
      <h1 className="auth-heading">Sign Up</h1>
      <p className="auth-subheading">Create your Fitness Tracker account</p>
      
      {error && <div className="auth-error">{error}</div>}
      
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="realName">Full Name</label>
          <input
            type="text"
            id="realName"
            name="realName"
            value={realName}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      
      <p className="auth-redirect">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;