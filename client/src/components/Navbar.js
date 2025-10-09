import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🧠 MindCare
        </Link>
        
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {user && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </>
          )}
        </ul>
        
        <div className="nav-auth">
          {user ? (
            <>
              <span style={{ color: 'white', fontWeight: '500', marginRight: '1rem' }}>
                Welcome, {user.username}! 👋
              </span>
              <button onClick={logout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;