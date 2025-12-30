// src/components/layout/MainLayout.tsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Search, Bell, Settings } from "lucide-react";
import Sidebar from "../Sidebar";
import Button from "../common/Button";
import "./layout.css"; // Pure CSS file

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('startupUserData');
    if (stored) setUserData(JSON.parse(stored));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="main-content">
        {/* Top Navigation */}
        <nav className="topbar">
          <div className="topbar-left">
            {/* Hamburger menu: only visible on mobile */}
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="menu-toggle" // 👈 custom class
            >
              <Menu size={16} />
            </Button>

            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>
          </div>

          <div className="topbar-right">
            <Button variant="ghost" size="icon" className="notification-btn">
              <Bell size={16} />
              <span className="notification-dot"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings size={16} />
            </Button>
            <div className="user-info">
              {/* User text: hidden on mobile, shown on tablet+ */}
              <div className="user-text user-text--desktop">
                <p className="user-name">{userData?.userName || "User"}</p>
                <p className="user-startup">{userData?.startupName || "Startup"}</p>
              </div>
              <div className="avatar">
                {(userData?.userName || "U").charAt(0)}
              </div>
            </div>
          </div>
        </nav>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;