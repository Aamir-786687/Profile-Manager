import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserList from './components/UserList';
import Navbar from './components/Navbar';
import { firebaseService } from './services/firebaseService';
import FilterBar from './components/FilterBar';

const App = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    specialization: "",
    language: "",
    education: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await firebaseService.getUsers();
        dispatch({ type: 'SET_USERS', payload: users });
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      specialization: "",
      language: "",
      education: "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-32 h-32 relative">
          <div className="w-full h-full border-4 border-blue-500/30 rounded-full animate-spin"></div>
          <div className="w-full h-full border-4 border-t-blue-500 rounded-full animate-spin absolute top-0 left-0" style={{ animationDuration: '0.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12">
            <h1 className="text-5xl text-center font-bold mb-4">Profile Manager</h1>
            
          </div>
          <FilterBar 
            users={users} 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          <UserList filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default App;

