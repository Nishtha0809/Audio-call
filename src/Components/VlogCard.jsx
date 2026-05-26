import React from "react";
import "../Styles/Vlogs.css";
import { useNavigate } from "react-router-dom";

function VlogCard({
  id,
  image,
  title,
  description
}) {

  const navigate = useNavigate();

  return (

    <div className="vlog-card">

      {/* IMAGE */}

      <div className="vlog-img-container">

        <img
          src={image}
          alt={title}
          className="vlog-img"
        />

      </div>


      {/* CONTENT */}

      <div className="vlog-content">

        <h3>{title}</h3>

        <p>{description}</p>


        {/* BUTTON */}

        <button
          className="watch-btn"
          onClick={() => navigate(`/vlog/${id}`)}
        >
          Watch Now
        </button>

      </div>

    </div>
  );
}

export default VlogCard;