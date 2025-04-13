"use client"

import { useState, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { firebaseService } from "../services/firebaseService"

const UserList = ({ filters }) => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state)
  const [editingUser, setEditingUser] = useState(null)
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
  })
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const searchMatch =
        !filters.search ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())

      // Specialization filter
      const specializationMatch = !filters.specialization || user.specialization === filters.specialization

      // Language filter
      const languageMatch =
        !filters.language || (Array.isArray(user.languages) && user.languages.includes(filters.language))

      // Education filter
      const educationMatch = !filters.education || user.education === filters.education

      return searchMatch && specializationMatch && languageMatch && educationMatch
    })
  }, [users, filters])

  const handleDelete = async (userId) => {
    if (!userId) {
      console.error("Invalid user ID")
      return
    }

    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await firebaseService.deleteUser(userId)
        dispatch({ type: "DELETE_USER", payload: userId })
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      ...user,
      languages: Array.isArray(user.languages) ? user.languages.join(", ") : user.languages,
      // Don't set imageFile here, as we're editing an existing image
    })
    setPreviewImage(user.imageUrl)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploading(true)
      try {
        // Create a preview URL for the selected image
        const previewUrl = URL.createObjectURL(file)
        setPreviewImage(previewUrl)

        // Store the file in the form data for later upload
        setFormData((prev) => ({ ...prev, imageFile: file }))
      } catch (error) {
        console.error("Error handling image:", error)
        alert("Failed to process image. Please try again.")
      } finally {
        setUploading(false)
      }
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      // Create a copy of the form data for updating
      const updatedUser = {
        ...formData,
        languages: formData.languages.split(",").map((l) => l.trim()),
      }

      // If there's a new image file, upload it
      if (formData.imageFile) {
        const imageUrl = await firebaseService.uploadImage(formData.imageFile)
        updatedUser.imageUrl = imageUrl
      }

      // Remove the imageFile property before sending to Firebase
      delete updatedUser.imageFile

      const result = await firebaseService.updateUser(editingUser.id, updatedUser)
      dispatch({ type: "UPDATE_USER", payload: result })
      setEditingUser(null)
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
      })
      setPreviewImage(null)
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

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
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredUsers.map((user) => (
        <div
          key={user.id}
          className="group relative overflow-hidden bg-[#0f0f0f] rounded-lg transition-all duration-300 hover:transform hover:scale-[1.02]"
        >
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
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl heading text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                Edit Profile
              </h2>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium tracking-wide text-gray-700">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
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
                          onChange={handleImageChange}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Maximum size: 5MB (JPEG & PNG)
                        </p>
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
                      value={formData.name}
                      onChange={handleChange}
                      required
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
                      value={formData.email}
                      onChange={handleChange}
                      required
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
                  {uploading ? "Saving Changes..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-6 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium tracking-wide shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserList
