import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import UserList from './components/UserList';
import Navbar from './components/Navbar';
import { firebaseService } from './services/firebaseService';
import './styles/main.css';

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await firebaseService.getUsers();
        dispatch({ type: 'SET_USERS', payload: users });
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="spinner"></div>
          <p>Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <UserList />
      </main>
    </div>
  );
};

export default App;
