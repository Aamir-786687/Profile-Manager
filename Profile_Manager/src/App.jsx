import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocalStorage } from './hooks/useLocalStorage';
import UserList from './components/UserList';
import ProfileForm from './components/ProfileForm';

const App = () => {
  const dispatch = useDispatch();
  const [editingUser, setEditingUser] = useState(null);
  const { get } = useLocalStorage('users', []);

  useEffect(() => {
    const users = get();
    dispatch({ type: 'SET_USERS', payload: users });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ProfileForm editingUser={editingUser} setEditingUser={setEditingUser} />
      <UserList onEdit={setEditingUser} />
    </div>
  );
};

export default App;
