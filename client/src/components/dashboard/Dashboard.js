import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ auth }) => {
  const [stats, setStats] = useState({
    exerciseCount: 0,
    dietEntries: 0,
    completedGoals: 0,
    activeGroups: 0
  });

  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    const fetchStats = async () => {
      try {
        // Example of how you would fetch data in a real implementation
        // const res = await fetch('http://localhost:5000/api/stats', {
        //   headers: {
        //     'x-auth-token': localStorage.token
        //   }
        // });
        // const data = await res.json();
        // setStats(data);

        // For now, we'll use dummy data
        setStats({
          exerciseCount: 12,
          dietEntries: 8,
          completedGoals: 3,
          activeGroups: 2
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h1>Welcome, {auth.user?.name}</h1>
      <p>Your fitness journey at a glance</p>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Exercise Entries</h3>
          <p className="stat-number">{stats.exerciseCount}</p>
          <Link to="/exercise" className="btn btn-small">Track Exercise</Link>
        </div>

        <div className="stat-card">
          <h3>Diet Entries</h3>
          <p className="stat-number">{stats.dietEntries}</p>
          <Link to="/diet" className="btn btn-small">Track Diet</Link>
        </div>

        <div className="stat-card">
          <h3>Completed Goals</h3>
          <p className="stat-number">{stats.completedGoals}</p>
          <Link to="/goals" className="btn btn-small">Set Goals</Link>
        </div>

        <div className="stat-card">
          <h3>Active Groups</h3>
          <p className="stat-number">{stats.activeGroups}</p>
          <Link to="/groups" className="btn btn-small">View Groups</Link>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/exercise" className="action-card">
          <h3>Track Exercise</h3>
          <p>Log your workouts and track your progress</p>
        </Link>

        <Link to="/diet" className="action-card">
          <h3>Track Diet</h3>
          <p>Log your meals and monitor your nutrition</p>
        </Link>

        <Link to="/goals" className="action-card">
          <h3>Set Goals</h3>
          <p>Create and track fitness and health goals</p>
        </Link>

        <Link to="/groups" className="action-card">
          <h3>Join Groups</h3>
          <p>Connect with others on similar fitness journeys</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;