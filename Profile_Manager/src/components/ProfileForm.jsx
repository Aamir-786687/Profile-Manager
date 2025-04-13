import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

const ProfileForm = ({ editingUser, setEditingUser }) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state);
  const { get } = useLocalStorage('users', users);

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

  useEffect(() => {
    if (editingUser) {
      setFormData({ ...editingUser, languages: editingUser.languages.join(', ') });
    }
  }, [editingUser]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newUser = {
      ...formData,
      id: editingUser?.id || uuid(),
      languages: formData.languages.split(',').map(l => l.trim())
    };

    if (editingUser) {
      const updatedUsers = users.map(user => user.id === newUser.id ? newUser : user);
      dispatch({ type: 'UPDATE_USER', payload: newUser });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } else {
      dispatch({ type: 'ADD_USER', payload: newUser });
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
    }

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
    setEditingUser(null);
  };

  return (
    <form className="space-y-2 mb-6" onSubmit={handleSubmit}>
      {['name', 'email', 'description', 'languages', 'education', 'specialization', 'twitter', 'instagram', 'imageUrl'].map(field => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required={field === 'name' || field === 'email'}
        />
      ))}
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
        {editingUser ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
};

export default ProfileForm;
