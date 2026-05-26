import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../Styles/Articles.css';

import blockchainImg from '../assets/article.avif'; 
import typesImg from '../assets/types-of-blockchain.jpg';
import smartImg from '../assets/smart.jpg';

function Articles() {

  const navigate = useNavigate();
  const [dbArticles, setDbArticles] = useState([]);

  // STATIC ARTICLES (your 3 default ones)
 const staticArticles = [
  {
    id: "s1",
    title: "What is Blockchain?",
    shortDesc: "Blockchain is a decentralized digital ledger...",
    description:
      "Blockchain is a decentralized digital ledger technology that securely stores records across multiple computers. It ensures transparency, security, and immutability of data.",
    image: blockchainImg
  },

  {
    id: "s2",
    title: "Types of Blockchain",
    shortDesc: "Blockchain can be Public, Private...",
    description:
      "There are four major types of blockchain: Public, Private, Consortium, and Hybrid blockchains. Each type offers different levels of decentralization and accessibility.",
    image: typesImg
  },

  {
    id: "s3",
    title: "Smart Contracts",
    shortDesc: "Smart contracts are self-executing contracts...",
    description:
      "Smart contracts are automated agreements stored on blockchain networks that execute automatically when predefined conditions are met.",
    image: smartImg
  }
];

  // FETCH ADMIN ARTICLES (from MongoDB)
 useEffect(() => {
  const fetchArticles = async () => {
    debugger;
    try {
      const res = await fetch("http://localhost:3002/api/articles");
      const data = await res.json();
      setDbArticles(data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchArticles();
}, []);

  return (
    <div className="articles-page">
      <h1 className="page-title">Latest Articles</h1>

      <div className="articles-grid">

        {/* STATIC ARTICLES */}
        {staticArticles.map((art) => (
          <div className="article-card" key={art.id}>
            <div className="card-image-container">
              <img src={art.image} alt={art.title} className="article-img" />
            </div>

            <div className="card-content">
              <h3>{art.title}</h3>
              <p>{art.desc }</p>

              <button
                className="read-more-btn"
              onClick={() => navigate(`/articles/${art.id}`)}
              >
                Read More
              </button>
            </div>
          </div>
        ))}

        {/* DATABASE ARTICLES (ADMIN ADDED) */}
        {dbArticles.map((art) => (
          <div className="article-card" key={art._id}>
            <div className="card-image-container">
              <img src={art.image} alt={art.title} className="article-img" />
            </div>

            <div className="card-content">
              <h3>{art.title}</h3>
            <p>{art.shortDesc}</p>
            

              <button
                className="read-more-btn"
                onClick={() => navigate(`/articles/${art._id}`)}
              >
                Read More
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Articles;