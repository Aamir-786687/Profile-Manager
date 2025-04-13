import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { firebaseService } from "../services/firebaseService";

const UserList = ({ filters }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state);
  const [editingUser, setEditingUser] = useState(null);
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
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      const searchMatch = !filters.search || 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());

      // Specialization filter
      const specializationMatch = !filters.specialization || 
        user.specialization === filters.specialization;

      // Language filter
      const languageMatch = !filters.language || 
        (Array.isArray(user.languages) && user.languages.includes(filters.language));

      // Education filter
      const educationMatch = !filters.education || 
        user.education === filters.education;

      return searchMatch && specializationMatch && languageMatch && educationMatch;
    });
  }, [users, filters]);

  const handleDelete = async (userId) => {
    if (!userId) {
      console.error("Invalid user ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await firebaseService.deleteUser(userId);
        dispatch({ type: "DELETE_USER", payload: userId });
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      ...user,
      languages: Array.isArray(user.languages)
        ? user.languages.join(", ")
        : user.languages,
    });
    setPreviewImage(user.imageUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        // Create a preview URL for the selected image
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);

        // Upload the image to Firebase Storage
        const imageUrl = await firebaseService.uploadImage(file);
        setFormData(prev => ({ ...prev, imageUrl }));
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedUser = {
      ...formData,
      languages: formData.languages.split(",").map((l) => l.trim()),
    };

    try {
      const result = await firebaseService.updateUser(
        editingUser.id,
        updatedUser
      );
      dispatch({ type: "UPDATE_USER", payload: result });
      setEditingUser(null);
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
      setPreviewImage(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center p-16 text-white bg-[#1a1a1a]/50 backdrop-blur-sm border border-[#333] m-10 relative rounded-lg shadow-lg">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-xl"></div>
        <h3 className="text-4xl mb-6 font-bold relative z-10">No profiles found</h3>
        <p className="text-xl text-gray-400 relative z-10">
          {users.length === 0 ? "Get started by creating a new profile." : "No profiles match your filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredUsers.map((user) => (
        <div key={user.id} className="group relative overflow-hidden bg-[#0f0f0f] rounded-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
          <div className="aspect-[3/2] w-full overflow-hidden">
            <img
              src={user.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={user.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-base font-bold text-white mb-1">{user.name}</h3>
              <p className="text-blue-400 text-sm mb-2">{user.specialization}</p>
              
              <div className="space-y-1 text-xs text-gray-300 mb-3">
                <p className="line-clamp-2">{user.description}</p>
                <p>{Array.isArray(user.languages) ? user.languages.join(" • ") : user.languages}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded text-xs font-medium text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded text-xs font-medium text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Category Tag */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] font-medium text-gray-300">
              {user.education}
            </span>
          </div>
        </div>
      ))}

      {/* Edit Form Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] p-8 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-800">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Image URL Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Profile Image URL
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-blue-500/30">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#2a2a2a]/50 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                        className="w-full p-3 bg-[#2a2a2a]/50 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                      <p className="mt-2 text-xs text-gray-400">
                        Enter a valid image URL
                      </p>
                    </div>
                  </div>
                </div>

                {/* Other form fields */}
                {["name", "email", "description", "languages", "education", "specialization", "twitter", "instagram"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label
                      htmlFor={`edit-${field}`}
                      className="block text-sm font-medium text-gray-300"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      id={`edit-${field}`}
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-3 bg-[#2a2a2a]/50 backdrop-blur-sm border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      required={field === "name" || field === "email"}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-6 border-t border-blue-500/30">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 text-sm font-semibold bg-blue-500/50 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600 transition-all duration-300 border border-blue-500/30"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-6 py-3 text-sm font-semibold bg-gray-700/50 backdrop-blur-sm text-white rounded-lg hover:bg-gray-600 transition-all duration-300 border border-gray-600/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
