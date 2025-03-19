// filepath: /home/albert/Money_Round/frontend/MoneyRound/src/components/Layout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/create-account">Create Account</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default Layout;