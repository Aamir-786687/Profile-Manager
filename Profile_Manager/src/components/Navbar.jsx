import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { firebaseService } from '../services/firebaseService';

const Navbar = ({ onEdit }) => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
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

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      // Upload image to Firebase Storage
      const imageUrl = await firebaseService.uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newUser = {
      ...formData,
      languages: formData.languages.split(',').map(l => l.trim())
    };

    try {
      const addedUser = await firebaseService.addUser(newUser);
      dispatch({ type: 'ADD_USER', payload: addedUser });
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
      setPreviewUrl('');
      setShowForm(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Profile Manager</h1>
      </div>
      <div className="navbar-actions">
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Profile'}
        </button>
      </div>

      {showForm && (
        <div className="navbar-form">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {['name', 'email', 'description', 'languages', 'education', 'specialization', 'twitter', 'instagram'].map(field => (
                <div key={field} className="form-group">
                  <label htmlFor={field} className="form-label">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="form-input"
                    required={field === 'name' || field === 'email'}
                  />
                </div>
              ))}
              <div className="form-group">
                <label htmlFor="image" className="form-label">
                  Profile Image
                </label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="image"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="image-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="btn btn-secondary"
                  >
                    Choose Image
                  </button>
                  {previewUrl && (
                    <div className="image-preview">
                      <img src={previewUrl} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                Add Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 