import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ user, onLogout }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={onLogout} />
        <main className="page-content">
          <Outlet context={{ user, onLogout }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
