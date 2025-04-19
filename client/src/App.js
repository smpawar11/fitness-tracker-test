import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import ExerciseTracker from './components/exercise/ExerciseTracker';
import DietTracker from './components/diet/DietTracker';
import GoalTracker from './components/goals/GoalTracker';
import GroupDashboard from './components/groups/GroupDashboard';
import GroupDetail from './components/groups/GroupDetail';
import JoinGroup from './components/groups/JoinGroup';
import setAuthToken from './utils/setAuthToken';

// Check if token exists in localStorage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // Set up authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.token) {
        try {
          const res = await fetch('http://localhost:5000/api/auth', {
            headers: {
              'x-auth-token': localStorage.token
            }
          });
          
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            setAuthToken(null);
          }
        } catch (err) {
          console.error('Auth check failed:', err.message);
          localStorage.removeItem('token');
          setAuthToken(null);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      console.log('App: Sending login request to API for user:', username);
      
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      console.log('App: Login API response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('App: Login successful, token received');
        localStorage.setItem('token', data.token);
        setAuthToken(data.token);
        
        // Fetch user data
        console.log('App: Fetching user data with token');
        const userRes = await fetch('http://localhost:5000/api/auth', {
          headers: {
            'x-auth-token': data.token
          }
        });
        
        console.log('App: User data fetch status:', userRes.status);
        
        if (userRes.ok) {
          const userData = await userRes.json();
          console.log('App: User data retrieved successfully');
          setUser(userData);
          setIsAuthenticated(true);
          return true;
        } else {
          console.error('App: Failed to retrieve user data');
        }
      } else {
        const errorData = await res.json();
        console.error('App: Login failed:', errorData);
      }
      return false;
    } catch (err) {
      console.error('App: Login error:', err.message);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Register function
  const register = async (formData) => {
    try {
      console.log('App: Sending registration request to API for user:', formData.username);
      
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      console.log('App: Registration API response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('App: Registration successful, token received');
        localStorage.setItem('token', data.token);
        setAuthToken(data.token);
        
        // Fetch user data
        console.log('App: Fetching user data after registration');
        const userRes = await fetch('http://localhost:5000/api/auth', {
          headers: {
            'x-auth-token': data.token
          }
        });
        
        console.log('App: User data fetch status:', userRes.status);
        
        if (userRes.ok) {
          const userData = await userRes.json();
          console.log('App: User data retrieved successfully:', userData.username);
          setUser(userData);
          setIsAuthenticated(true);
          return true;
        } else {
          console.error('App: Failed to retrieve user data after registration');
        }
      } else {
        const errorData = await res.json();
        console.error('App: Registration failed:', errorData);
      }
      return false;
    } catch (err) {
      console.error('App: Registration error:', err.message);
      return false;
    }
  };

  // Create authentication context for the app
  const authContext = {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    register
  };

  return (
    <Router>
      <div className="App">
        <Navbar auth={authContext} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register auth={authContext} />} />
          <Route path="/login" element={<Login auth={authContext} />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute auth={authContext}>
              <Dashboard auth={authContext} />
            </PrivateRoute>
          } />
          
          <Route path="/exercise" element={
            <PrivateRoute auth={authContext}>
              <ExerciseTracker auth={authContext} />
            </PrivateRoute>
          } />
          
          <Route path="/diet" element={
            <PrivateRoute auth={authContext}>
              <DietTracker auth={authContext} />
            </PrivateRoute>
          } />
          
          <Route path="/goals" element={
            <PrivateRoute auth={authContext}>
              <GoalTracker auth={authContext} />
            </PrivateRoute>
          } />
          
          <Route path="/groups" element={
            <PrivateRoute auth={authContext}>
              <GroupDashboard auth={authContext} />
            </PrivateRoute>
          } />
          
          <Route path="/groups/:id" element={
            <PrivateRoute auth={authContext}>
              <GroupDetail auth={authContext} />
            </PrivateRoute>
          } />
          
          <Route path="/join-group/:inviteCode" element={
            <PrivateRoute auth={authContext}>
              <JoinGroup auth={authContext} />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;