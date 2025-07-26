import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './layout.css'; // Make sure your CSS file is linked

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session or Firebase logout if needed
    navigate('/');
  };

  return (
    <div className="layout-container">
      <div className="sidebar">
        <h2>🚀 SMIT Admin Panel</h2>
        <ul>
          <li onClick={() => navigate('/dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/appointments')}>Appointments</li>
          <li onClick={() => navigate('/helprequests')}>Help Requests</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
