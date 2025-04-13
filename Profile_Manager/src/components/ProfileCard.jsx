import React from "react";

const ProfileCard = ({ user, setEditingUser }) => (
  <div className="p-4 border rounded shadow">
    <img
      src={user.imageUrl}
      alt={user.name}
    />
    <h2>{user.name}</h2>
    <p>{user.email}</p>
    <p>{user.description}</p>
    <p>Lang: {user.languages.join(", ")}</p>
    <p>Edu: {user.education}</p>
    <p>Spec: {user.specialization}</p>
    <div className="flex gap-2">
      <a href={user.X} target="_blank">
        X
      </a>
      <a href={user.instagram} target="_blank">
        Instagram
      </a>
    </div>
    <button
      className="mt-2 px-4 py-1 bg-blue-500 text-white"
      onClick={() => setEditingUser(user)}
    >
      Edit
    </button>
  </div>
);

export default ProfileCard;
