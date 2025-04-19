import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ auth }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  
  const { username, password } = formData;
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = async e => {
    e.preventDefault();
    console.log('Login form submitted for user:', username);
    
    console.log('Attempting login...');
    const success = await auth.login(username, password);
    console.log('Login attempt result:', success ? 'success' : 'failed');
    
    if (success) {
      console.log('Login successful. Redirecting to dashboard...');
      navigate('/dashboard');
    } else {
      console.error('Login failed for user:', username);
      setError('Invalid credentials. Please try again.');
    }
  };
  
  return (
    <div className="auth-container">
      <h1 className="auth-heading">Sign In</h1>
      <p className="auth-subheading">Log in to your Fitness Tracker account</p>
      
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
        
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      
      <p className="auth-redirect">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;