import React, { useEffect, useState } from 'react';

import "../Styles/Vlogs.css";

import vlog1 from "../assets/basics.jpg";
import vlog2 from "../assets/ether.jpg";
import vlog3 from "../assets/blockchain.avif";

import VlogCard from "../Components/VlogCard";

function Vlogs() {

  const [dbVlogs, setDbVlogs] = useState([]);

  // STATIC BLOGS
  const staticVlogs = [

    {
      id: "v1",
      title: "Blockchain Basics",
      description: "Learn blockchain from scratch.",
      image: vlog1
    },

    {
      id: "v2",
      title: "Ethereum Explained",
      description: "Understand Ethereum network.",
      image: vlog2
    },

    {
      id: "v3",
      title: "Smart Contracts Demo",
      description: "Working of smart contracts.",
      image: vlog3
    }
  ];

  // FETCH ADMIN BLOGS
  useEffect(() => {

    fetch("http://localhost:3002/api/vlogs")
      .then(res => res.json())
      .then(data => setDbVlogs(data))
      .catch(err => console.log(err));

  }, []);

  return (

    <div className="vlogs-page">

      <h1 className="vlogs-title">
        Latest Blogs
      </h1>

      <div className="vlogs-container">


        {/* STATIC BLOGS */}

        {staticVlogs.map((vlog) => (

          <VlogCard
            key={vlog.id}
            id={vlog.id}
            image={vlog.image}
            title={vlog.title}
            description={vlog.description}
          />

        ))}



        {/* ADMIN ADDED BLOGS */}

        {dbVlogs.map((vlog) => (

          <VlogCard
            key={vlog._id}
            id={vlog._id}
            image={vlog.thumbnail}
            title={vlog.title}
            description={vlog.description}
          />

        ))}

      </div>

    </div>
  );
}

export default Vlogs;