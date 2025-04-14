import axios from "axios";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const BASE_URL = "https://profile-manager-9364e-default-rtdb.firebaseio.com";

export const firebaseService = {
  getUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users.json`);
      if (!response.data) return [];

      return Object.entries(response.data).map(([id, user]) => ({
        ...user,
        id,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users. Please try again later.");
    }
  },

  addUser: async (userData) => {
    try {
      // Validate required fields
      if (!userData.name?.trim() || !userData.email?.trim()) {
        throw new Error("Name and email are required fields");
      }

      const processedData = {
        name: userData.name.trim(),
        email: userData.email.trim(),
        description: userData.description?.trim() || "",
        languages: Array.isArray(userData.languages) 
          ? userData.languages 
          : (userData.languages?.split(',').map(lang => lang.trim()).filter(Boolean) || []),
        education: userData.education?.trim() || "",
        specialization: userData.specialization?.trim() || "",
        twitter: userData.twitter?.trim() || "",
        instagram: userData.instagram?.trim() || "",
        imageUrl: userData.imageUrl,
        createdAt: new Date().toISOString()
      };

      // Send the request to Firebase
      const response = await axios.post(`${BASE_URL}/users.json`, processedData);
      
      if (!response.data?.name) {
        throw new Error("Failed to create user profile");
      }

      // Return the created user with their ID
      return { 
        ...processedData, 
        id: response.data.name 
      };
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error(error.message || "Failed to add user. Please try again.");
    }
  },

  updateUser: async (userId, userData) => {
    try {
      if (!userId) {
        throw new Error("User ID is required for update");
      }

      const processedData = {
        ...userData,
        languages: Array.isArray(userData.languages) 
          ? userData.languages 
          : userData.languages?.split(',').map(lang => lang.trim()).filter(Boolean) || [],
        updatedAt: new Date().toISOString()
      };

      const response = await axios.put(`${BASE_URL}/users/${userId}.json`, processedData);
      
      if (!response.data) {
        throw new Error("Failed to update user profile");
      }

      return { 
        ...processedData, 
        id: userId 
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user. Please try again.");
    }
  },

  deleteUser: async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/users/${userId}.json`);
      return userId;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user. Please try again later.");
    }
  },

  uploadImage: async (file) => {
    try {
      if (!file) {
        throw new Error("No file provided");
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
      }


      try {
        const timestamp = Date.now();
        const fileName = `profile_images/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, fileName);

        const uploadResult = await uploadBytes(storageRef, file);
        if (!uploadResult?.ref) {
          throw new Error("Failed to upload image");
        }

        const downloadURL = await getDownloadURL(uploadResult.ref);
        if (!downloadURL) {
          throw new Error("Failed to get image URL");
        }

        return downloadURL;
      } catch (uploadError) {
        console.error("Firebase Storage Error:", uploadError);
        throw new Error(
          uploadError.code === "storage/unauthorized"
            ? "Unauthorized access to storage. Please check your permissions."
            : "Failed to upload image. Please try again."
        );
      }
    } catch (error) {
      console.error("Error in uploadImage:", error);
      throw error;
    }
  }
};
