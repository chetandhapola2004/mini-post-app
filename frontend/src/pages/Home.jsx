import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, ArrowRightIcon, HeartIcon, ImageIcon } from "../components/Icons";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="home-pill">
          <span className="pill-dot"></span>
          <span className="pill-text">Simple, focused photo sharing</span>
        </div>

        <h1 className="home-hero-title">
          Capture moments, <br className="hero-break" />
          <span className="title-accent">share stories cleanly.</span>
        </h1>

        <p className="home-hero-sub">
          A minimalist micro-publishing platform crafted for your photographs and captions. No algorithms, no clutter — just what matters.
        </p>

        <div className="home-cta-group">
          <button className="btn-primary" onClick={() => navigate("/create-post")}>
            <PlusIcon size={18} />
            <span>Create New Post</span>
          </button>
          <button className="btn-secondary" onClick={() => navigate("/feed")}>
            <span>Explore Feed</span>
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </section>

      {/* Interactive showcase card preview */}
      <section className="home-preview-section">
        <div className="preview-card-showcase">
          <div className="showcase-card">
            <div className="showcase-img-wrap">
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" 
                alt="Sample photography" 
                className="showcase-img"
              />
              <div className="showcase-tag">Featured Preview</div>
            </div>
            <div className="showcase-content">
              <div className="showcase-caption-wrap">
                <p className="showcase-caption">Golden reflections along the calm pacific coastline. 🌅</p>
                <span className="showcase-time">Just now</span>
              </div>
              <div className="showcase-actions">
                <button className="preview-like-btn" title="Like">
                  <HeartIcon size={16} filled={true} className="liked-heart" />
                  <span>24</span>
                </button>
              </div>
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <ImageIcon size={20} />
              </div>
              <div>
                <h3 className="feature-title">High-fidelity Images</h3>
                <p className="feature-desc">Preserve the colors and crisp details of every snap you upload.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <PlusIcon size={20} />
              </div>
              <div>
                <h3 className="feature-title">Effortless Publishing</h3>
                <p className="feature-desc">Drag, drop, add your thoughts, and share immediately with the world.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;