import { useState } from "react";
import { useDispatch } from "react-redux";
import { firebaseService } from "../services/firebaseService";

const Navbar = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    languages: "",
    education: "",
    specialization: "",
    twitter: "",
    instagram: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === 'imageFile') {
      setFormData(prev => ({
        ...prev,
        imageFile: files[0] // Store the selected file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        ...formData,
        languages: formData.languages.split(",").map((lang) => lang.trim()),
      };
      const addedUser = await firebaseService.addUser(newUser);
      dispatch({ type: "ADD_USER", payload: addedUser });
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        description: "",
        languages: "",
        education: "",
        specialization: "",
        twitter: "",
        instagram: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <nav className="border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"></div>
            <span className="text-lg font-semibold tracking-wider">
              PROFILES
            </span>
          </div>

          {/* Add Profile Button */}
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white hover:border-gray-600 transition-colors flex items-center space-x-2"
          >
            <span className="text-lg">+</span>
            <span>Add Profile</span>
          </button>
        </div>
      </div>

      {/* Add Profile Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] p-8 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Profile</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Image URL field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Profile Image URL
                  </label>
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                  />
                </div>

                {/* Other form fields */}
                {[
                  { name: "name", label: "Name", required: true },
                  { name: "email", label: "Email", required: true },
                  { name: "description", label: "Description" },
                  { name: "languages", label: "Languages (comma-separated)" },
                  { name: "education", label: "Education" },
                  { name: "specialization", label: "Specialization" },
                  { name: "twitter", label: "Twitter URL" },
                  { name: "instagram", label: "Instagram URL" },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-800">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-white hover:border-gray-600 transition-colors"
                >
                  Add Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
