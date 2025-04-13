const SearchBar = ({ value, onChange }) => {
    return (
      <input
        type="text"
        placeholder="Search by name, email, description, specialization..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
    );
  };
  
  export default SearchBar;
  