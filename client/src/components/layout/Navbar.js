import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ auth }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only show the main navigation on certain paths
  const hideNav = ['/', '/login', '/register'].includes(location.pathname);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <h1>Fit<span className="brand-highlight">Track</span></h1>
          </Link>
        </div>
        
        <div className="hamburger" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        {!hideNav && auth.isAuthenticated ? (
          <div className={`navbar-nav ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/exercise" className={`nav-item ${location.pathname === '/exercise' ? 'active' : ''}`}>
              Exercise
            </Link>
            <Link to="/diet" className={`nav-item ${location.pathname === '/diet' ? 'active' : ''}`}>
              Diet
            </Link>
            <Link to="/goals" className={`nav-item ${location.pathname === '/goals' ? 'active' : ''}`}>
              Goals
            </Link>
            <Link to="/groups" className={`nav-item ${location.pathname === '/groups' ? 'active' : ''}`}>
              Groups
            </Link>
            <button onClick={auth.logout} className="nav-item logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className={`navbar-nav ${mobileMenuOpen ? 'active' : ''}`}>
            {location.pathname !== '/login' && 
              <Link to="/login" className="nav-item btn-outlined">Login</Link>
            }
            {location.pathname !== '/register' && 
              <Link to="/register" className="nav-item btn-primary">Register</Link>
            }
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;