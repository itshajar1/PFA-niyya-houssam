// src/components/layout/Sidebar.tsx
import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, FileText, Users, Target, TrendingUp, Settings, User, Zap, X 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContext } from "../App"; // Assuming ToastContext is in App.tsx

// Reuse your Button component
import Button from "../components/common/Button";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const toastContext = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/startups' },
    { name: 'Pitch Deck Generator', icon: FileText, path: '#' },
    { name: 'Investor Matching', icon: Users, path: '#' },
    { name: 'Milestones', icon: Target, path: '#' },
    { name: 'Analytics', icon: TrendingUp, path: '#' },
    { name: 'Profile', icon: User, path: '/startup/profile' },
    { name: 'Settings', icon: Settings, path: '#' }
  ];

  const handleNavClick = (name, path) => {
    if (path === '/startup/profile') {
      navigate('/startup/profile');
    } else if (path === '/startups') {
      navigate('/startups');
    } else if (path !== '#') {
      toastContext?.toast?.({ description: `${name} clicked. Navigation logic is simulated.` });
    }
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen && window.innerWidth < 1024 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Content */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? '0%' : '-100%' }}
        transition={{ duration: 0.3 }}
        className={`sidebar ${isOpen ? 'open' : ''}`}
      >
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2 className="sidebar-logo">
              <Zap size={16} />
              StartUpOS
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setIsOpen(false)}
            >
              <X size={14} />
            </Button>
          </div>

          <nav className="sidebar-nav">
            <ul>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isDashboard = item.name === 'Dashboard' && location.pathname === '/startups';

                return (
                  <li key={item.name}>
                    <Button
                      variant={isDashboard ? 'primary' : 'ghost'}
                      className={`w-full ${!isDashboard ? 'text-slate-600 justify-start' : ''}`}
                      onClick={() => handleNavClick(item.name, item.path)}
                    >
                      <Icon size={16} />
                      <span className="ml-3">{item.name}</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="sidebar-footer">
            <Button variant="ghost" className="text-red-500 w-full justify-start">
              <LogOutIcon />
              <span className="ml-3">Sign Out</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export default Sidebar;