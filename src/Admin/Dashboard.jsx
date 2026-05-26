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

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT MAIN CONTENT */}
      <div className="dashboard-page">

        <div className="dashboard-card">

          <h1 className="dashboard-title">
            Admin Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Manage Articles and Vlogs
          </p>

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

            <button
              className="dashboard-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;