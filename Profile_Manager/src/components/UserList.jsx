import { useSelector } from 'react-redux';

const UserList = ({ onEdit }) => {
  const users = useSelector(state => state);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(user => (
        <div key={user.id} className="border p-4 rounded shadow">
          <img src={user.imageUrl} alt={user.name} className="w-full h-40 object-cover mb-2 rounded" />
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.description}</p>
          <p><strong>Languages:</strong> {user.languages.join(', ')}</p>
          <p><strong>Education:</strong> {user.education}</p>
          <p><strong>Specialization:</strong> {user.specialization}</p>
          <div className="flex gap-2 mt-2">
            <a href={user.twitter} target="_blank" className="text-blue-500">Twitter</a>
            <a href={user.instagram} target="_blank" className="text-pink-500">Instagram</a>
          </div>
          <button onClick={() => onEdit(user)} className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded">
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
