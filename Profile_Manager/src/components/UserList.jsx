import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { firebaseService } from '../services/firebaseService';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    languages: '',
    education: '',
    specialization: '',
    twitter: '',
    instagram: '',
    imageUrl: ''
  });

  const handleDelete = async (userId) => {
    if (!userId) {
      console.error('Invalid user ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await firebaseService.deleteUser(userId);
        dispatch({ type: 'DELETE_USER', payload: userId });
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      ...user,
      languages: Array.isArray(user.languages) ? user.languages.join(', ') : user.languages
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async e => {
    e.preventDefault();
    const updatedUser = {
      ...formData,
      languages: formData.languages.split(',').map(l => l.trim())
    };

    try {
      const result = await firebaseService.updateUser(editingUser.id, updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: result });
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        description: '',
        languages: '',
        education: '',
        specialization: '',
        twitter: '',
        instagram: '',
        imageUrl: ''
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <h3 className="empty-state-title">No profiles found</h3>
        <p className="empty-state-text">Get started by creating a new profile.</p>
      </div>
    );
  }

  return (
    <div className="users-grid">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <div className="user-image-container">
            <img 
              src={user.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'} 
              alt={user.name} 
              className="user-image"
            />
          </div>
          <div className="user-content">
            {editingUser?.id === user.id ? (
              <form onSubmit={handleUpdate} className="edit-form">
                <div className="form-grid">
                  {['name', 'email', 'description', 'languages', 'education', 'specialization', 'twitter', 'instagram', 'imageUrl'].map(field => (
                    <div key={field} className="form-group">
                      <label htmlFor={`edit-${field}`} className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        id={`edit-${field}`}
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="form-input"
                        required={field === 'name' || field === 'email'}
                      />
                    </div>
                  ))}
                </div>
                <div className="card-actions">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="user-name">{user.name}</h3>
                <p className="user-description">{user.description}</p>
                
                <div className="user-info">
                  <p className="info-item">
                    <span className="info-icon">📧</span>
                    {user.email}
                  </p>
                  <p className="info-item">
                    <span className="info-icon">🌐</span>
                    {Array.isArray(user.languages) ? user.languages.join(', ') : user.languages}
                  </p>
                  <p className="info-item">
                    <span className="info-icon">🎓</span>
                    {user.education}
                  </p>
                  <p className="info-item">
                    <span className="info-icon">💼</span>
                    {user.specialization}
                  </p>
                </div>

                <div className="social-links">
                  {user.twitter && (
                    <a 
                      href={user.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-link"
                    >
                      Twitter
                    </a>
                  )}
                  {user.instagram && (
                    <a 
                      href={user.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-link"
                    >
                      Instagram
                    </a>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(user)}
                    className="btn btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
