import React, { useState, useEffect } from 'react';

const GoalTracker = ({ auth }) => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'weight',
    target: '',
    deadline: '',
    current: '',
    unit: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    const fetchGoals = async () => {
      try {
        // Example of how you would fetch data in a real implementation
        // const res = await fetch('http://localhost:5000/api/goals', {
        //   headers: {
        //     'x-auth-token': localStorage.token
        //   }
        // });
        // const data = await res.json();
        // setGoals(data);

        // For now, we'll use dummy data
        setGoals([
          {
            id: '1',
            title: 'Weight Loss',
            description: 'Lose weight for summer',
            type: 'weight',
            target: 75,
            current: 80,
            unit: 'kg',
            deadline: '2025-07-01',
            progress: 50
          },
          {
            id: '2',
            title: '5K Run',
            description: 'Train for charity 5K run',
            type: 'endurance',
            target: 5,
            current: 3,
            unit: 'km',
            deadline: '2025-06-15',
            progress: 60
          }
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Failed to load goals');
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleInputChange = (e) => {
    setNewGoal({
      ...newGoal,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Example of how you would post data in a real implementation
      // const res = await fetch('http://localhost:5000/api/goals', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-auth-token': localStorage.token
      //   },
      //   body: JSON.stringify(newGoal)
      // });
      // const data = await res.json();
      
      // For now, we'll add it directly to the state
      const newGoalWithId = {
        ...newGoal,
        id: Date.now().toString(),
        progress: 0 // Starting progress is 0%
      };
      
      setGoals([newGoalWithId, ...goals]);
      
      // Reset the form
      setNewGoal({
        title: '',
        description: '',
        type: 'weight',
        target: '',
        deadline: '',
        current: '',
        unit: ''
      });
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Failed to add goal');
    }
  };

  const handleUpdateProgress = async (id, progress) => {
    try {
      // Example of how you would update data in a real implementation
      // const res = await fetch(`http://localhost:5000/api/goals/${id}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-auth-token': localStorage.token
      //   },
      //   body: JSON.stringify({ progress })
      // });
      
      // For now, we'll update it directly in the state
      setGoals(goals.map(goal => 
        goal.id === id ? { ...goal, progress } : goal
      ));
    } catch (err) {
      console.error('Error updating goal progress:', err);
      setError('Failed to update goal progress');
    }
  };

  // Helper function to get appropriate units based on goal type
  const getUnitOptions = (type) => {
    switch(type) {
      case 'weight':
        return ['kg', 'lbs'];
      case 'strength':
        return ['kg', 'lbs', 'reps'];
      case 'endurance':
        return ['km', 'miles', 'minutes'];
      case 'nutrition':
        return ['calories', 'g', 'meals'];
      default:
        return ['kg', 'lbs', 'reps', 'km', 'miles', 'minutes', 'calories', 'g', 'meals'];
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="goal-tracker">
      <h1>Goal Tracker</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="goal-form-container">
        <h2>Create New Goal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Goal Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newGoal.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newGoal.description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Goal Type</label>
            <select
              id="type"
              name="type"
              value={newGoal.type}
              onChange={handleInputChange}
              required
            >
              <option value="weight">Weight</option>
              <option value="strength">Strength</option>
              <option value="endurance">Endurance</option>
              <option value="nutrition">Nutrition</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="current">Current</label>
              <input
                type="number"
                id="current"
                name="current"
                value={newGoal.current}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="target">Target</label>
              <input
                type="number"
                id="target"
                name="target"
                value={newGoal.target}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="unit">Unit</label>
              <select
                id="unit"
                name="unit"
                value={newGoal.unit}
                onChange={handleInputChange}
                required
              >
                {getUnitOptions(newGoal.type).map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="deadline">Target Date</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={newGoal.deadline}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Create Goal</button>
        </form>
      </div>
      
      <div className="goal-list">
        <h2>Your Goals</h2>
        {goals.length === 0 ? (
          <p>No goals set yet. Create your first goal to start tracking!</p>
        ) : (
          <div className="goal-cards">
            {goals.map(goal => (
              <div key={goal.id} className="goal-card">
                <h3>{goal.title}</h3>
                {goal.description && <p className="goal-description">{goal.description}</p>}
                
                <div className="goal-details">
                  <p><strong>Type:</strong> {goal.type}</p>
                  <p><strong>Target:</strong> {goal.target} {goal.unit}</p>
                  <p><strong>Current:</strong> {goal.current} {goal.unit}</p>
                  <p><strong>Deadline:</strong> {new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
                
                <div className="progress-container">
                  <label>Progress: {goal.progress}%</label>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${goal.progress}%`}}
                    ></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => handleUpdateProgress(goal.id, parseInt(e.target.value))}
                    className="progress-slider"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;