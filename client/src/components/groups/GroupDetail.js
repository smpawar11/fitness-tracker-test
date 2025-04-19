import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const GroupDetail = ({ auth }) => {
  const { id } = useParams();
  
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        // Example of how you would fetch data in a real implementation
        // const groupRes = await fetch(`http://localhost:5000/api/groups/${id}`, {
        //   headers: {
        //     'x-auth-token': localStorage.token
        //   }
        // });
        // const groupData = await groupRes.json();
        // setGroup(groupData);
        
        // For now, we'll use dummy data
        setGroup({
          id,
          name: 'Morning Runners',
          description: 'A group for early morning runners who love to start their day with exercise',
          type: 'cardio',
          memberCount: 24,
          isPrivate: false,
          inviteCode: 'run2025',
          createdBy: {
            id: '123',
            name: 'Jane Runner'
          },
          createdAt: '2025-03-10T08:00:00.000Z'
        });
        
        // Simulating members fetch
        setMembers([
          {
            id: '123',
            name: 'Jane Runner',
            role: 'admin',
            joinedDate: '2025-03-10T08:00:00.000Z'
          },
          {
            id: '456',
            name: 'John Jogger',
            role: 'member',
            joinedDate: '2025-03-11T08:00:00.000Z'
          },
          {
            id: '789',
            name: 'Mary Miles',
            role: 'member',
            joinedDate: '2025-03-12T08:00:00.000Z'
          }
        ]);
        
        // Simulating posts fetch
        setPosts([
          {
            id: '1',
            content: 'Just finished a 5k in 22 minutes! New personal best!',
            author: {
              id: '456',
              name: 'John Jogger'
            },
            createdAt: '2025-04-16T07:30:00.000Z',
            likes: 8,
            comments: [
              {
                id: '1001',
                content: 'That\'s amazing! Congrats!',
                author: {
                  id: '123',
                  name: 'Jane Runner'
                },
                createdAt: '2025-04-16T07:45:00.000Z'
              }
            ]
          },
          {
            id: '2',
            content: 'Morning run by the lake today - beautiful sunrise!',
            author: {
              id: '123',
              name: 'Jane Runner'
            },
            createdAt: '2025-04-15T06:20:00.000Z',
            likes: 12,
            comments: []
          }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError('Failed to load group details');
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPost.trim()) return;
    
    try {
      // Example of how you would post data in a real implementation
      // const res = await fetch(`http://localhost:5000/api/groups/${id}/posts`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-auth-token': localStorage.token
      //   },
      //   body: JSON.stringify({ content: newPost })
      // });
      // const data = await res.json();
      
      // For now, we'll add it directly to the state
      const newPostData = {
        id: Date.now().toString(),
        content: newPost,
        author: {
          id: auth.user?.id || 'current-user',
          name: auth.user?.name || 'Current User'
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      
      setPosts([newPostData, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading group details...</div>;
  }

  if (!group) {
    return <div className="error-message">Group not found</div>;
  }

  return (
    <div className="group-detail">
      <div className="group-header">
        <h1>{group.name}</h1>
        <p className="group-description">{group.description}</p>
        
        <div className="group-meta">
          <p><strong>Focus:</strong> {group.type}</p>
          <p><strong>Members:</strong> {group.memberCount}</p>
          <p><strong>Created:</strong> {formatDate(group.createdAt)}</p>
          <p><strong>Invite Code:</strong> {group.inviteCode}</p>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="group-content">
        <div className="posts-section">
          <h2>Group Activity</h2>
          
          <form className="post-form" onSubmit={handlePostSubmit}>
            <textarea
              placeholder="Share an update with the group..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="btn btn-primary">Post</button>
          </form>
          
          <div className="posts-list">
            {posts.length === 0 ? (
              <p>No activity yet. Be the first to post!</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <span className="post-author">{post.author.name}</span>
                    <span className="post-date">{formatDate(post.createdAt)}</span>
                  </div>
                  
                  <div className="post-content">{post.content}</div>
                  
                  <div className="post-actions">
                    <button className="btn-text">Like ({post.likes})</button>
                    <button className="btn-text">Comment</button>
                  </div>
                  
                  {post.comments.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="comment">
                          <div className="comment-header">
                            <span className="comment-author">{comment.author.name}</span>
                            <span className="comment-date">{formatDate(comment.createdAt)}</span>
                          </div>
                          <div className="comment-content">{comment.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="members-section">
          <h2>Members ({members.length})</h2>
          <div className="members-list">
            {members.map(member => (
              <div key={member.id} className="member-card">
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  {member.role === 'admin' && <span className="member-badge">Admin</span>}
                </div>
                <span className="member-joined">Joined {formatDate(member.joinedDate)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="group-actions">
        <Link to="/groups" className="btn btn-outline">Back to Groups</Link>
        <button className="btn btn-secondary">Invite Members</button>
        <button className="btn btn-outline">Leave Group</button>
      </div>
    </div>
  );
};

export default GroupDetail;