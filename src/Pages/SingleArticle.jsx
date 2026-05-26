import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import "../Styles/SingleArticle.css";

import blockchainImg from '../assets/article.avif';
import typesImg from '../assets/types-of-blockchain.jpg';
import smartImg from '../assets/smart.jpg';

function SingleArticle() {

  const { id } = useParams();

  const [article, setArticle] = useState(null);

  // STATIC ARTICLES
  const staticArticles = [
    {
      id: "s1",
      title: "What is Blockchain?",
      description:
        "Blockchain is a decentralized digital ledger technology that securely stores records across multiple computers. It ensures transparency, security, and immutability of data.",
      image: blockchainImg
    },

    {
      id: "s2",
      title: "Types of Blockchain",
      description:
        "There are four major types of blockchain: Public, Private, Consortium, and Hybrid blockchains. Each type offers different levels of decentralization and accessibility.",
      image: typesImg
    },

    {
      id: "s3",
      title: "Smart Contracts",
      description:
        "Smart contracts are automated agreements stored on blockchain networks that execute automatically when predefined conditions are met.",
      image: smartImg
    }
  ];

  useEffect(() => {

    const staticFound = staticArticles.find(
      (a) => a.id === id
    );

    if (staticFound) {
      setArticle(staticFound);
      return;
    }

    fetch("http://localhost:3002/api/articles")
      .then(res => res.json())
      .then(data => {

        const found = data.find(
          (a) => a._id === id
        );

        setArticle(found);
      });

  }, [id]);

  if (!article) return <h1 className="loading">Loading...</h1>;

  return (
    <div className="single-article-page">

      <div className="single-article-card">

        <Link to="/articles">
          <button className="back-btn">
            ← Back to Articles
          </button>
        </Link>

        <img
          src={article.image}
          alt={article.title}
          className="single-article-img"
        />

        <h1 className="single-title">
          {article.title}
        </h1>

        <p className="single-description">
          {article.description }
        </p>

      </div>

    </div>
  );
}

export default SingleArticle;