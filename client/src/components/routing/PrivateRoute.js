import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ auth, children }) => {
  if (auth.loading) {
    // Show loading spinner while checking authentication status
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // If not authenticated, redirect to login page, otherwise render the protected component
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;