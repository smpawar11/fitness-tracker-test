import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const JoinGroup = ({ auth }) => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  
  const [groupInfo, setGroupInfo] = useState(null);
  const [inviteCodeInput, setInviteCodeInput] = useState(inviteCode || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If we have an invite code from the URL, look up the group immediately
    if (inviteCode) {
      lookupGroup(inviteCode);
    }
  }, [inviteCode]);

  const lookupGroup = async (code) => {
    if (!code) {
      setError('Please enter an invite code');
      return;
    }

    setLoading(true);
    setError('');
    setGroupInfo(null);
    
    try {
      // Example of how you would fetch data in a real implementation
      // const res = await fetch(`http://localhost:5000/api/groups/invite/${code}`, {
      //   headers: {
      //     'x-auth-token': localStorage.token
      //   }
      // });
      
      // if (!res.ok) {
      //   throw new Error('Invalid invite code');
      // }
      
      // const data = await res.json();
      // setGroupInfo(data);

      // For now, we'll use dummy data
      // Simulate a possible error for invalid codes
      if (code !== 'run2025' && code !== 'weight2025' && code !== 'yoga2025') {
        throw new Error('Invalid invite code');
      }
      
      // Simulate fetching group info based on the code
      const groupData = {
        run2025: {
          id: '1',
          name: 'Morning Runners',
          description: 'A group for early morning runners',
          type: 'cardio',
          memberCount: 24,
          createdBy: { name: 'Jane Runner' }
        },
        weight2025: {
          id: '2',
          name: 'Weight Loss Support',
          description: 'Support group for weight loss journey',
          type: 'weight',
          memberCount: 56,
          createdBy: { name: 'John Fitness' }
        },
        yoga2025: {
          id: '3',
          name: 'Yoga Enthusiasts',
          description: 'Connect with fellow yoga practitioners',
          type: 'yoga',
          memberCount: 18,
          createdBy: { name: 'Sam Stretch' }
        }
      };
      
      // Small delay to simulate network request
      setTimeout(() => {
        setGroupInfo(groupData[code]);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error looking up group:', err);
      setError(err.message || 'Failed to find group with this invite code');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    lookupGroup(inviteCodeInput);
  };

  const handleJoinGroup = async () => {
    if (!groupInfo) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Example of how you would join a group in a real implementation
      // const res = await fetch(`http://localhost:5000/api/groups/${groupInfo.id}/join`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-auth-token': localStorage.token
      //   },
      //   body: JSON.stringify({ inviteCode: inviteCodeInput })
      // });
      
      // if (!res.ok) {
      //   throw new Error('Failed to join group');
      // }
      
      // Simulate success after a short delay
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        
        // After showing success message, redirect to group page
        setTimeout(() => {
          navigate(`/groups/${groupInfo.id}`);
        }, 1500);
      }, 800);
    } catch (err) {
      console.error('Error joining group:', err);
      setError(err.message || 'Failed to join group');
      setLoading(false);
    }
  };

  return (
    <div className="join-group">
      <h1>Join a Fitness Group</h1>
      
      {success ? (
        <div className="success-message">
          <p>You have successfully joined {groupInfo.name}!</p>
          <p>Redirecting to group page...</p>
        </div>
      ) : (
        <>
          {!groupInfo ? (
            <div className="invite-code-form">
              <p>Enter the invite code provided by the group administrator</p>
              
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="inviteCode">Invite Code</label>
                  <input
                    type="text"
                    id="inviteCode"
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value)}
                    placeholder="Enter invite code"
                    disabled={loading}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Find Group'}
                </button>
              </form>
            </div>
          ) : (
            <div className="group-join-card">
              <h2>{groupInfo.name}</h2>
              <p className="group-description">{groupInfo.description}</p>
              
              <div className="group-details">
                <p><strong>Type:</strong> {groupInfo.type}</p>
                <p><strong>Members:</strong> {groupInfo.memberCount}</p>
                <p><strong>Created by:</strong> {groupInfo.createdBy.name}</p>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="join-actions">
                <button 
                  onClick={handleJoinGroup}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Joining...' : 'Join Group'}
                </button>
                
                <button 
                  onClick={() => {
                    setGroupInfo(null);
                    setError('');
                  }}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Try Different Code
                </button>
              </div>
            </div>
          )}
          
          <div className="alternate-actions">
            <Link to="/groups" className="btn btn-text">Back to Groups</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default JoinGroup;