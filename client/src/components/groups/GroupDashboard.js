import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GroupDashboard = ({ auth }) => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    type: 'general',
    isPrivate: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    const fetchGroups = async () => {
      try {
        // Example of how you would fetch data in a real implementation
        // const res = await fetch('http://localhost:5000/api/groups', {
        //   headers: {
        //     'x-auth-token': localStorage.token
        //   }
        // });
        // const data = await res.json();
        // setGroups(data);

        // For now, we'll use dummy data
        setGroups([
          {
            id: '1',
            name: 'Morning Runners',
            description: 'A group for early morning runners',
            type: 'cardio',
            memberCount: 24,
            isPrivate: false,
            inviteCode: 'run2025',
            createdBy: {
              name: 'Jane Runner'
            }
          },
          {
            id: '2',
            name: 'Weight Loss Support',
            description: 'Support group for weight loss journey',
            type: 'weight',
            memberCount: 56,
            isPrivate: false,
            inviteCode: 'weight2025',
            createdBy: {
              name: 'John Fitness'
            }
          }
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load groups');
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewGroup({
      ...newGroup,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Example of how you would post data in a real implementation
      // const res = await fetch('http://localhost:5000/api/groups', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-auth-token': localStorage.token
      //   },
      //   body: JSON.stringify(newGroup)
      // });
      // const data = await res.json();
      
      // For now, we'll add it directly to the state
      const newGroupWithId = {
        ...newGroup,
        id: Date.now().toString(),
        memberCount: 1,
        inviteCode: Math.random().toString(36).substring(2, 8),
        createdBy: {
          name: auth.user?.name || 'Current User'
        }
      };
      
      setGroups([newGroupWithId, ...groups]);
      
      // Reset the form
      setNewGroup({
        name: '',
        description: '',
        type: 'general',
        isPrivate: false
      });
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="group-dashboard">
      <h1>Fitness Groups</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="group-actions">
        <button 
          className="btn btn-secondary" 
          onClick={() => document.getElementById('createGroupForm').classList.toggle('show')}
        >
          Create New Group
        </button>
        
        <Link to="/join-group" className="btn btn-outline">Join Group with Code</Link>
      </div>
      
      <div id="createGroupForm" className="create-group-form">
        <h2>Create New Fitness Group</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Group Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newGroup.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newGroup.description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Group Focus</label>
            <select
              id="type"
              name="type"
              value={newGroup.type}
              onChange={handleInputChange}
              required
            >
              <option value="general">General Fitness</option>
              <option value="cardio">Cardio & Running</option>
              <option value="strength">Strength Training</option>
              <option value="weight">Weight Management</option>
              <option value="nutrition">Nutrition</option>
              <option value="yoga">Yoga & Flexibility</option>
            </select>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="isPrivate"
              name="isPrivate"
              checked={newGroup.isPrivate}
              onChange={handleInputChange}
            />
            <label htmlFor="isPrivate">Make this group private</label>
            <p className="form-hint">Private groups require an invitation to join</p>
          </div>
          
          <button type="submit" className="btn btn-primary">Create Group</button>
        </form>
      </div>
      
      <div className="groups-container">
        <h2>Your Groups</h2>
        {groups.length === 0 ? (
          <p>You haven't joined any groups yet. Create or join a group to connect with others!</p>
        ) : (
          <div className="group-cards">
            {groups.map(group => (
              <div key={group.id} className="group-card">
                <h3>{group.name}</h3>
                {group.description && <p className="group-description">{group.description}</p>}
                
                <div className="group-details">
                  <p><strong>Focus:</strong> {group.type}</p>
                  <p><strong>Members:</strong> {group.memberCount}</p>
                  <p><strong>Privacy:</strong> {group.isPrivate ? 'Private' : 'Public'}</p>
                  <p><strong>Created by:</strong> {group.createdBy.name}</p>
                </div>
                
                <div className="group-actions">
                  <Link to={`/groups/${group.id}`} className="btn btn-primary">View Group</Link>
                  <button className="btn btn-outline">Invite Members</button>
                  <p className="invite-code">Invite Code: <strong>{group.inviteCode}</strong></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDashboard;