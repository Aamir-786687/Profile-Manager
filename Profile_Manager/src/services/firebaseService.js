import axios from 'axios';

const BASE_URL = 'https://profile-manager-9364e-default-rtdb.firebaseio.com';

export const firebaseService = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users.json`);
      if (!response.data) return [];
      
      // Convert Firebase object to array with IDs
      return Object.entries(response.data).map(([id, user]) => ({
        ...user,
        id
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Add a new user
  addUser: async (user) => {
    try {
      // Remove id from the user object before sending to Firebase
      const { id, ...userData } = user;
      const response = await axios.post(`${BASE_URL}/users.json`, userData);
      return { ...userData, id: response.data.name };
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  // Update a user
  updateUser: async (userId, userData) => {
    try {
      // Remove id from the user object before sending to Firebase
      const { id, ...dataToUpdate } = userData;
      await axios.put(`${BASE_URL}/users/${userId}.json`, dataToUpdate);
      return { ...dataToUpdate, id: userId };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/users/${userId}.json`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}; 