import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="footer" role="contentinfo">
      <div className="footer-content" style={{ textAlign: 'center', padding: '1rem' }}>
        <p>Built with ❤️ by Ritesh Sharma</p>
       
      </div>
    </footer>
    </div>
  );
};

export default Layout;