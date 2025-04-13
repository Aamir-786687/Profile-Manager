import { useState, useEffect } from 'react';

const FilterBar = ({ users, filters, onFilterChange, onClearFilters }) => {
  // Extract unique options from users
  const [langOptions, setLangOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [specOptions, setSpecOptions] = useState([]);

  useEffect(() => {
    if (!Array.isArray(users)) return;

    // Get unique languages from all users
    const languages = [...new Set(users.flatMap(u => 
      Array.isArray(u.languages) ? u.languages : []
    ))].filter(Boolean);

    // Get unique education levels
    const educations = [...new Set(users.map(u => u.education).filter(Boolean))];

    // Get unique specializations
    const specializations = [...new Set(users.map(u => u.specialization).filter(Boolean))];

    setLangOptions(languages);
    setEducationOptions(educations);
    setSpecOptions(specializations);
  }, [users]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search profiles..."
            className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-4">
          {[
            { name: 'specialization', label: 'Specialization', options: specOptions },
            { name: 'language', label: 'Language', options: langOptions },
            { name: 'education', label: 'Education', options: educationOptions }
          ].map(filter => (
            <select
              key={filter.name}
              name={filter.name}
              value={filters[filter.name]}
              onChange={handleFilterChange}
              className="px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600 transition-colors"
            >
              <option value="">{filter.label}</option>
              {filter.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ))}

          {/* Clear Filters Button */}
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;