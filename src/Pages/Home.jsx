import React from 'react';
import '../Styles/Home.css';
import bannerImg from "../assets/banner.jpg";

function Home() {
  return (
    <div className="home-container">
      {/* Introduction Section right below Navbar */}
      <div className="welcome-header">
        <h2 className="home-main-title">Blockchain Voice Network</h2>
        <p className="home-subtitle">
          Secure Real-Time Audio Calling & Recording Platform Using WebRTC Technology
        </p>
      </div>

      {/* Hero Section Banner */}
      <div className="hero-banner">
        <img
          src={bannerImg}
          alt="Blockchain Banner"
          className="hero-bg-img"
        />
        <div className="hero-overlay">
          <div className="hero-text-content">
            <h1>Welcome to our Website</h1>
            <p>
              Learn about blockchain technology, articles, vlogs, audio calling,
              and secure recording systems.
            </p>
            <button className="explore-btn">Explore More</button>
          </div>
        </div>
      </div>

      {/* Feature Card Section */}
      <div className="features-section">
        <div className="feature-card">
          <h2>Real-Time Calling</h2>
          <p>Connect users instantly using WebRTC peer-to-peer communication.</p>
        </div>

        <div className="feature-card">
          <h2>Secure Recordings</h2>
          <p>Calls are automatically recorded and securely stored in database.</p>
        </div>

        <div className="feature-card">
          <h2>Admin Dashboard</h2>
          <p>Admin can manage users, recordings and monitor activity.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;