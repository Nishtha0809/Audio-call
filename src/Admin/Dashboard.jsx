import React from "react";
import Sidebar from "../Components/Sidebar";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  // LOGOUT
  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {

      localStorage.removeItem("isAdmin");
      localStorage.removeItem("token");

      navigate("/login");

      window.location.reload();
    }
  };

  return (

    <div className="dashboard-container">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN PAGE */}
      <div className="dashboard-page">

        {/* ANIMATED GLOW */}
        <div className="dashboard-glow-1"></div>
        <div className="dashboard-glow-2"></div>

        {/* CARD */}
        <div className="dashboard-card">

          <h1 className="dashboard-title">
            Admin Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Manage Articles, Vlogs & Audio Calls
          </p>

          {/* BUTTONS */}
          <div className="dashboard-buttons">

            <Link to="/admin/add-article">
              <button className="dashboard-btn">
                Add Article
              </button>
            </Link>

            <Link to="/admin/add-vlog">
              <button className="dashboard-btn">
                Add Vlog
              </button>
            </Link>

            

            <div className="logout-wrapper">
  <button
    className="dashboard-btn logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;