import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/analytics">Analytics</Link></li>
        <li><Link to="/content">Content Management</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
