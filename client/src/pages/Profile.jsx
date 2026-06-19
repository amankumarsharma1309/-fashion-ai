import "./Profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  useEffect(() => {
    getProfile();
  }, []);

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function getProfile() {
    const token =
      localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/profile`,
      {
        headers: {
          authorization: token,
        },
      }
    );

    setUser(response.data);
  }

  return (
    <div className="profile-container">
      <div className="profile-card">

        <div className="profile-avatar">
          👤
        </div>

        <h1>My Profile</h1>

        <div className="profile-info">
          <h3>Username</h3>
          <p>{user?.name}</p>
        </div>

        <div className="profile-info">
          <h3>Email</h3>
          <p>{user?.email}</p>
        </div>

        <div className="profile-info">
          <h3>Role</h3>
          <p>{user?.role}</p>
        </div>
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;