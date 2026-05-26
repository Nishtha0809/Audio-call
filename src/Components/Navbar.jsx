import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../Styles/Navbar.css';

function Navbar() {

  // GET JWT TOKEN FROM LOCAL STORAGE
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // LOGOUT FUNCTION
  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {

      // REMOVE JWT TOKEN
      localStorage.removeItem("token");

      // REDIRECT TO LOGIN PAGE
      navigate("/login");

      // REFRESH UI
      window.location.reload();
    }
  };

  return (
    <nav className="navbar">

      <div className="nav-logo">
        <h2>Blockchain System</h2>
      </div>

      <div className="nav-links">

        <Link to="/" className="nav-item">
          Home
        </Link>

        <Link to="/articles" className="nav-item">
          Articles
        </Link>

        <Link to="/vlogs" className="nav-item">
          Blogs
        </Link>

        {
          // IF TOKEN EXISTS SHOW DASHBOARD + LOGOUT
          token ? (
            <>
              <Link
                to="/admin/dashboard"
                className="nav-item admin-login-btn"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (

            // IF NO TOKEN SHOW LOGIN BUTTON
            <Link
              to="/login"
              className="nav-item admin-login-btn"
            >
              Admin Login
            </Link>
          )
        }

      </div>
    </nav>
  );
}

export default Navbar;