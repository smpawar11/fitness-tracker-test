import React, { useState, useEffect } from 'react';

const ExerciseTracker = ({ auth }) => {
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    type: 'cardio',
    duration: '',
    distance: '',
    sets: '',
    reps: '',
    weight: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    const fetchExercises = async () => {
      try {
        // Example of how you would fetch data in a real implementation
        // const res = await fetch('http://localhost:5000/api/exercises', {
        //   headers: {
        //     'x-auth-token': localStorage.token
        //   }
        // });
        // const data = await res.json();
        // setExercises(data);

        // For now, we'll use dummy data
        setExercises([
          {
            id: '1',
            name: 'Morning Run',
            type: 'cardio',
            duration: 30,
            distance: 5,
            date: '2025-04-15'
          },
          {
            id: '2',
            name: 'Push-ups',
            type: 'strength',
            sets: 3,
            reps: 15,
            date: '2025-04-16'
          }
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to load exercises');
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleInputChange = (e) => {
    setNewExercise({
      ...newExercise,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Example of how you would post data in a real implementation
      // const res = await fetch('http://localhost:5000/api/exercises', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-auth-token': localStorage.token
      //   },
      //   body: JSON.stringify(newExercise)
      // });
      // const data = await res.json();
      
      // For now, we'll add it directly to the state
      const newExerciseWithId = {
        ...newExercise,
        id: Date.now().toString()
      };
      
      setExercises([newExerciseWithId, ...exercises]);
      
      // Reset the form
      setNewExercise({
        name: '',
        type: 'cardio',
        duration: '',
        distance: '',
        sets: '',
        reps: '',
        weight: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Error adding exercise:', err);
      setError('Failed to add exercise');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="exercise-tracker">
      <h1>Exercise Tracker</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="exercise-form-container">
        <h2>Add New Exercise</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Exercise Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newExercise.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Exercise Type</label>
            <select
              id="type"
              name="type"
              value={newExercise.type}
              onChange={handleInputChange}
              required
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="flexibility">Flexibility</option>
              <option value="balance">Balance</option>
            </select>
          </div>
          
          {newExercise.type === 'cardio' && (
            <>
              <div className="form-group">
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={newExercise.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="distance">Distance (km)</label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={newExercise.distance}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>
            </>
          )}
          
          {newExercise.type === 'strength' && (
            <>
              <div className="form-group">
                <label htmlFor="sets">Sets</label>
                <input
                  type="number"
                  id="sets"
                  name="sets"
                  value={newExercise.sets}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reps">Reps</label>
                <input
                  type="number"
                  id="reps"
                  name="reps"
                  value={newExercise.reps}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={newExercise.weight}
                  onChange={handleInputChange}
                  step="0.5"
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={newExercise.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Add Exercise</button>
        </form>
      </div>
      
      <div className="exercise-list">
        <h2>Your Exercise History</h2>
        {exercises.length === 0 ? (
          <p>No exercises logged yet. Start tracking your workouts!</p>
        ) : (
          <div className="exercise-cards">
            {exercises.map(exercise => (
              <div key={exercise.id} className="exercise-card">
                <h3>{exercise.name}</h3>
                <p><strong>Type:</strong> {exercise.type}</p>
                <p><strong>Date:</strong> {exercise.date}</p>
                
                {exercise.type === 'cardio' && (
                  <>
                    <p><strong>Duration:</strong> {exercise.duration} minutes</p>
                    <p><strong>Distance:</strong> {exercise.distance} km</p>
                  </>
                )}
                
                {exercise.type === 'strength' && (
                  <>
                    <p><strong>Sets:</strong> {exercise.sets}</p>
                    <p><strong>Reps:</strong> {exercise.reps}</p>
                    {exercise.weight && <p><strong>Weight:</strong> {exercise.weight} kg</p>}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseTracker;