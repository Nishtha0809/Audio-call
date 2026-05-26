import React from 'react';
import '../Styles/Home.css'; 
import bannerImg from "../assets/banner.jpg";

function Home() {
  return (
    <div className="home-container">
      {/* Introduction Section right below Navbar */}
      <div className="welcome-header">
        <h2>Blockchain System Types</h2>
        <p>Providing secure and transparent solutions for the future.</p>
      </div>

      {/* Hero Section with Image and Text Overlay as per image_39c5f9.jpg */}
      <div className="hero-banner">
        <img src={bannerImg} alt="Blockchain Banner" className="hero-bg-img" />
        
        <div className="hero-overlay">
          <div className="hero-text-content">
            <h1>Welcome to our Website</h1>
            <p>Learn about blockchain technology, articles, and vlogs.</p>
            <button className="explore-btn">Explore More</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;