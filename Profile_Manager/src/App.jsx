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
      {/* Grid Background */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Profile Manager</h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              "Il n'y a pas de richesse sans créativité" - Manage and showcase creative profiles with style.
            </p>
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

      {/* Corner Decoration */}
      <div className="fixed top-4 right-4 text-xs text-gray-600 writing-vertical">
        Directrice Artistique • Webdesign • Print • Illustration • UI design • UX design • Motion design • Interactive
      </div>
    </div>
  );
};

export default App;

// Add this CSS at the end of your global CSS or in a style tag
const styles = `
  .writing-vertical {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
`;
