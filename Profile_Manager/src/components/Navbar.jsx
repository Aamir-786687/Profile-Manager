import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { firebaseService } from "../services/firebaseService"
import { Plus, Trash2 } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch()
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
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
    imageFile: null,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const users = useSelector((state) => state);

  const resetForm = () => {
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
      imageFile: null,
    })
    setError("")
    setUploading(false)
  }

  const handleChange = (e) => {
    const { name, files, value } = e.target
    setError("") 

    if (name === "imageFile") {
      const file = files[0]
      if (file) {
        // Validate file type and size
        const validTypes = ['image/jpeg', 'image/png']
        if (!validTypes.includes(file.type)) {
          setError("Please select a valid image file (JPEG or PNG)")
        }

        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imageUrl: "", 
        }))
      }
    } else if (name === "imageUrl") {
      setFormData((prev) => ({
        ...prev,
        imageUrl: value,
        imageFile: null, 
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const validateForm = () => {
    if (!formData.name?.trim()) {
      setError("Name is required")
      return false
    }
    if (!formData.email?.trim()) {
      setError("Email is required")
      return false
    }
    if (!formData.email.match) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (!validateForm()) {
        return
      }

      setUploading(true)
      let finalImageUrl = formData.imageUrl

      // Handle image upload if there's a file
      if (formData.imageFile) {
        try {
          finalImageUrl = await firebaseService.uploadImage(formData.imageFile)
        } catch (error) {
          setError(error.message || "Failed to upload image")
          setUploading(false)
          return
        }
      }

      // Prepare user data
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        description: formData.description?.trim() || "",
        languages: formData.languages
          ? formData.languages.split(",").map((lang) => lang.trim()).filter(Boolean)
          : [],
        education: formData.education?.trim() || "",
        specialization: formData.specialization?.trim() || "",
        twitter: formData.twitter?.trim() || "",
        instagram: formData.instagram?.trim() || "",
        imageUrl: finalImageUrl || "https://via.placeholder.com/300x200?text=No+Image",
      }

      // Add user to database
      const addedUser = await firebaseService.addUser(userData)
      
      // Update Redux store
      dispatch({ type: "ADD_USER", payload: addedUser })

      resetForm()
      setShowForm(false)
    } catch (error) {
      setError(error.message || "Failed to add profile. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      setError("Please select at least one profile to delete");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} selected profile(s)?`)) {
      try {
        // Delete users one by one
        for (const userId of selectedUsers) {
          await firebaseService.deleteUser(userId);
          dispatch({ type: "DELETE_USER", payload: userId });
        }
        setShowDeleteModal(false);
        setSelectedUsers([]);
      } catch (error) {
        setError(error.message || "Failed to delete profiles. Please try again.");
      }
    }
  };

  return (
    <nav className="border border-yellow bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 m-15">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg"></div>
            <span className="brand-text text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"> <p> PROFILES </p></span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-white border border-red-200 rounded-lg text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors flex items-center space-x-2 font-medium tracking-wide shadow-sm"
            >
              <span className="text-lg"><Trash2 /></span>
              <span>Delete Profiles</span>
            </button>

            <button
              onClick={() => {
                setShowForm(true)
                resetForm()
              }}
              className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center space-x-2 font-medium tracking-wide shadow-sm"
            >
              <span className="text-lg"><Plus /></span>
              <span>Add Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Profile Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl heading text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Add New Profile</h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium tracking-wide text-gray-700">
                    Profile Image
                  </label>
                  
                  {/* Image Preview */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
                      {(formData.imageFile || formData.imageUrl) ? (
                        <img
                          src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200?text=Invalid+Image"
                            setError("Invalid image URL")
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No image</span>
                        </div>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Options */}
                    <div className="flex-1 space-y-4">
                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium tracking-wide text-gray-700 mb-1">
                          Upload Image File
                        </label>
                        <input
                          type="file"
                          name="imageFile"
                          accept="image/jpeg,image/png,image/gif"
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Maximum size: 5MB (JPEG & PNG)
                        </p>
                      </div>

                      {/* URL Input */}
                      <div>
                        <label className="block text-sm font-medium tracking-wide text-gray-700 mb-1">
                          Or Enter Image URL
                        </label>
                        <input
                          type="text"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium tracking-wide text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium tracking-wide text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Optional Fields */}
                {[
                  { name: "description", label: "Description" },
                  { name: "languages", label: "Languages (comma-separated)" },
                  { name: "education", label: "Education" },
                  { name: "specialization", label: "Specialization" },
                  { name: "twitter", label: "Twitter URL" },
                  { name: "instagram", label: "Instagram URL" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium tracking-wide text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {uploading ? "Adding Profile..." : "Add Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="flex-1 px-6 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium tracking-wide shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Profiles Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl heading text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">Delete Profiles</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedUsers([])
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                    className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={handleBulkDelete}
                disabled={selectedUsers.length === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg text-white font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Delete Selected ({selectedUsers.length})
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedUsers([])
                }}
                className="flex-1 px-6 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium tracking-wide shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
