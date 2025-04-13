// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect, useState } from 'react';
// import { v4 as uuid } from 'uuid';
// import { firebaseService } from '../services/firebaseService';

// const ProfileForm = ({ editingUser, setEditingUser }) => {
//   const dispatch = useDispatch();
//   const users = useSelector(state => state);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     description: '',
//     languages: '',
//     education: '',
//     specialization: '',
//     twitter: '',
//     instagram: '',
//     imageUrl: ''
//   });

//   useEffect(() => {
//     if (editingUser) {
//       setFormData({ 
//         ...editingUser, 
//         languages: Array.isArray(editingUser.languages) 
//           ? editingUser.languages.join(', ') 
//           : editingUser.languages 
//       });
//     } else {
//       setFormData({
//         name: '',
//         email: '',
//         description: '',
//         languages: '',
//         education: '',
//         specialization: '',
//         twitter: '',
//         instagram: '',
//         imageUrl: ''
//       });
//     }
//   }, [editingUser]);

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const newUser = {
//       ...formData,
//       languages: formData.languages.split(',').map(l => l.trim())
//     };

//     try {
//       if (editingUser) {
//         const updatedUser = await firebaseService.updateUser(editingUser.id, newUser);
//         dispatch({ type: 'UPDATE_USER', payload: updatedUser });
//       } else {
//         const addedUser = await firebaseService.addUser(newUser);
//         dispatch({ type: 'ADD_USER', payload: addedUser });
//       }

//       setFormData({
//         name: '',
//         email: '',
//         description: '',
//         languages: '',
//         education: '',
//         specialization: '',
//         twitter: '',
//         instagram: '',
//         imageUrl: ''
//       });
//       setEditingUser(null);
//     } catch (error) {
//       console.error('Error saving user:', error);
//     }
//   };

//   return (
//     <div className="form-content">
//       <h2 className="form-title">
//         {editingUser ? 'Edit Profile' : 'Add New Profile'}
//       </h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-grid">
//           {['name', 'email', 'description', 'languages', 'education', 'specialization', 'twitter', 'instagram', 'imageUrl'].map(field => (
//             <div key={field} className="form-group">
//               <label htmlFor={field} className="form-label">
//                 {field.charAt(0).toUpperCase() + field.slice(1)}
//               </label>
//               <input
//                 id={field}
//                 type="text"
//                 name={field}
//                 value={formData[field]}
//                 onChange={handleChange}
//                 className="form-input"
//                 required={field === 'name' || field === 'email'}
//                 placeholder={`Enter ${field}`}
//               />
//             </div>
//           ))}
//         </div>
//         <div className="form-buttons">
//           {editingUser && (
//             <button
//               type="button"
//               onClick={() => setEditingUser(null)}
//               className="btn btn-secondary"
//             >
//               Cancel
//             </button>
//           )}
//           <button
//             type="submit"
//             className="btn btn-primary"
//           >
//             {editingUser ? 'Update Profile' : 'Add Profile'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProfileForm;
