import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Sidebar.css";

function Sidebar() {

  return (

    <div className="sidebar">

      <h2>Admin Panel</h2>

      <Link to="/admin/audio-call">
        Audio Call
      </Link>

    </div>
  );
}

export default Sidebar;