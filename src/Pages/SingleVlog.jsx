import React, { useEffect, useState } from "react";
import "../Styles/SingleVlog.css";

import { useParams, Link } from "react-router-dom";

import vlog1 from "../assets/basics.jpg";
import vlog2 from "../assets/ether.jpg";
import vlog3 from "../assets/blockchain.avif";

function SingleVlog() {

  const { id } = useParams();

  const [vlog, setVlog] = useState(null);

  // STATIC BLOGS

  const staticVlogs = [

    {
      id: "v1",
      title: "Blockchain Basics",
      description:
        "Blockchain is a distributed ledger technology that securely stores records across multiple systems.",

      image: vlog1
    },

    {
      id: "v2",
      title: "Ethereum Explained",
      description:
        "Ethereum is a decentralized blockchain platform that supports smart contracts and decentralized applications.",

      image: vlog2
    },

    {
      id: "v3",
      title: "Smart Contracts Demo",
      description:
        "Smart contracts are self-executing contracts where the agreement is directly written into code.",

      image: vlog3
    }
  ];



  useEffect(() => {

    // CHECK STATIC BLOGS FIRST

    const staticFound = staticVlogs.find(
      (item) => item.id === id
    );

    if (staticFound) {

      setVlog(staticFound);

      return;
    }



    // FETCH DATABASE BLOGS

    fetch("http://localhost:3002/api/vlogs")
      .then(res => res.json())
      .then(data => {

        const found = data.find(
          (item) => item._id === id
        );

        setVlog(found);
      })

      .catch(err => console.log(err));

  }, [id]);



  if (!vlog) {

    return <h1 className="loading-spinner">Loading...</h1>;
  }



  return (

    <div className="single-blog-page">

      <div className="single-blog-card">

        <Link to="/vlogs">

          <button className="blog-back-btn">
            ← Back to Blogs
          </button>

        </Link>



        <img
          src={vlog.image || vlog.thumbnail}
          alt={vlog.title}
          className="single-blog-img"
        />



        <h1 className="blog-title">
          {vlog.title}
        </h1>



        <p className="blog-content">
          {vlog.description}
        </p>

      </div>

    </div>
  );
}

export default SingleVlog;