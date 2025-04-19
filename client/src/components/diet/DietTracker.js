import React, { useState, useEffect } from 'react';

const DietTracker = ({ auth }) => {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    name: '',
    type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    const fetchMeals = async () => {
      try {
        // Example of how you would fetch data in a real implementation
        // const res = await fetch('http://localhost:5000/api/diet', {
        //   headers: {
        //     'x-auth-token': localStorage.token
        //   }
        // });
        // const data = await res.json();
        // setMeals(data);

        // For now, we'll use dummy data
        setMeals([
          {
            id: '1',
            name: 'Oatmeal with Berries',
            type: 'breakfast',
            calories: 320,
            protein: 12,
            carbs: 52,
            fat: 8,
            date: '2025-04-16'
          },
          {
            id: '2',
            name: 'Chicken Salad',
            type: 'lunch',
            calories: 450,
            protein: 35,
            carbs: 25,
            fat: 15,
            date: '2025-04-16'
          }
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching meals:', err);
        setError('Failed to load meal history');
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleInputChange = (e) => {
    setNewMeal({
      ...newMeal,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Example of how you would post data in a real implementation
      // const res = await fetch('http://localhost:5000/api/diet', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-auth-token': localStorage.token
      //   },
      //   body: JSON.stringify(newMeal)
      // });
      // const data = await res.json();
      
      // For now, we'll add it directly to the state
      const newMealWithId = {
        ...newMeal,
        id: Date.now().toString()
      };
      
      setMeals([newMealWithId, ...meals]);
      
      // Reset the form
      setNewMeal({
        name: '',
        type: 'breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Error adding meal:', err);
      setError('Failed to add meal');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="diet-tracker">
      <h1>Diet Tracker</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="diet-form-container">
        <h2>Add New Meal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Meal Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newMeal.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Meal Type</label>
            <select
              id="type"
              name="type"
              value={newMeal.type}
              onChange={handleInputChange}
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="calories">Calories</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={newMeal.calories}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="protein">Protein (g)</label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={newMeal.protein}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="carbs">Carbs (g)</label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={newMeal.carbs}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fat">Fat (g)</label>
            <input
              type="number"
              id="fat"
              name="fat"
              value={newMeal.fat}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={newMeal.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Add Meal</button>
        </form>
      </div>
      
      <div className="meal-list">
        <h2>Your Meal History</h2>
        {meals.length === 0 ? (
          <p>No meals logged yet. Start tracking your nutrition!</p>
        ) : (
          <div className="meal-cards">
            {meals.map(meal => (
              <div key={meal.id} className="meal-card">
                <h3>{meal.name}</h3>
                <p><strong>Type:</strong> {meal.type}</p>
                <p><strong>Date:</strong> {meal.date}</p>
                <div className="nutrition-info">
                  <div className="nutrition-item">
                    <span>Calories</span>
                    <span>{meal.calories}</span>
                  </div>
                  <div className="nutrition-item">
                    <span>Protein</span>
                    <span>{meal.protein}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span>Carbs</span>
                    <span>{meal.carbs}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span>Fat</span>
                    <span>{meal.fat}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DietTracker;