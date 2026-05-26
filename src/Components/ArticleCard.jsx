import React from 'react';
import "../Styles/ArticleCard.css";
import { Link } from "react-router-dom";

function ArticleCard({id, image, title, description }) {
  return (
    <div className="article-card">

      <img
        src={image}
        alt={title}
      />

      <h2>{title}</h2>

      <p>{description}</p>

     <Link to={`/article/${id}`}>
  <button>
    Read More
  </button>
</Link>

    </div>
  );
}
export default ArticleCard;