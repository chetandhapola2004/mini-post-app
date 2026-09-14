import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LogoIcon, PlusIcon, FeedIcon } from './Icons';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar-header">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrap">
            <LogoIcon size={20} />
          </div>
          <span className="brand-name">MiniPost</span>
        </Link>

        <nav className="navbar-nav">
          <NavLink 
            to="/feed" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            <FeedIcon size={16} />
            <span>Feed</span>
          </NavLink>

          <NavLink 
            to="/create-post" 
            className={({ isActive }) => `nav-btn-create ${isActive ? 'nav-btn-active' : ''}`}
          >
            <PlusIcon size={16} />
            <span>Create</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
