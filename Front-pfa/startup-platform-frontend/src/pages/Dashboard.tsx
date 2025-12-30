// src/pages/Dashboard.tsx
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  ChevronRight,
  Award,
  Calendar,
  MessageSquare,
  Briefcase,
  DollarSign,
  Menu,
  X,
  Lightbulb,
  Building,
  Sparkles
} from 'lucide-react';
import './Dashboard.css';
import { Link, useLocation } from 'react-router-dom';

// --- TOAST NOTIFICATION SYSTEM ---
const ToastContext = createContext<{ toast: ({ description }: { description: string }) => void } | undefined>(undefined);

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast = ({ id, description, onDismiss }: { id: number; description: string; onDismiss: (id: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="toast"
      onClick={() => onDismiss(id)}
    >
      <p>{description}</p>
    </motion.div>
  );
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<{ id: number; description: string }[]>([]);

  const toast = useCallback(({ description }: { description: string }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, description }]);
  }, []);

  const onDismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} id={t.id} description={t.description} onDismiss={onDismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// --- COMMON BUTTON COMPONENT ---
const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  size = 'default', 
  disabled, 
  ...props 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
  variant?: string; 
  size?: string; 
  disabled?: boolean;
  [key: string]: any;
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'icon' ? 'btn-icon' : '';

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// --- METRIC CARD ---
const MetricCard = ({ icon: Icon, title, value, change, color, delay }: { 
  icon: any; 
  title: string; 
  value: number; 
  change: string; 
  color: string; 
  delay: number; 
}) => {
  const colorMap: Record<string, string> = {
    blue: 'blue',
    green: 'green',
    indigo: 'indigo',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="metric-card"
    >
      <div className="metric-header">
        <div>
          <p className="metric-title">{title}</p>
          <p className="metric-value">{value}</p>
        </div>
        <div className={`metric-icon-box ${colorMap[color]}`}>
          <Icon />
        </div>
      </div>
      <p className="metric-change">
        <TrendingUp />
        {change}
      </p>
    </motion.div>
  );
};

// --- ACTIVITY FEED ---
const IconMap: Record<string, any> = {
  FileText: FileText,
  Users: Users,
  Target: Target,
  Calendar: Calendar,
  MessageSquare: MessageSquare,
};

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

const ActivityItem = ({ activity }: { activity: Activity }) => {
  const Icon = IconMap[activity.icon] || FileText;

  return (
    <li className="activity-item">
      <div className={`activity-icon-box ${activity.type}`}>
        <Icon />
      </div>
      <div className="activity-content">
        <h4>{activity.title}</h4>
        <p>{activity.description}</p>
      </div>
      <span className="activity-timestamp">{activity.timestamp}</span>
    </li>
  );
};

const ActivityFeed = ({ activities }: { activities: Activity[] }) => (
  <div className="widget">
    <h2>Recent Activity</h2>
    <ul className="activity-list">
      {activities.map(activity => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </ul>
  </div>
);

// --- QUICK ACTIONS ---
const ActionButton = ({ icon: Icon, title, description, onClick }: { 
  icon: any; 
  title: string; 
  description: string; 
  onClick: () => void; 
}) => (
  <Button
    variant="secondary"
    className="action-btn"
    onClick={onClick}
  >
    <div className="action-icon">
      <Icon />
    </div>
    <div className="action-text">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <ChevronRight className="action-arrow" />
  </Button>
);

const QuickActions = () => {
  const { toast } = useToast();
  const handleAction = (action: string) => {
    toast({ description: `Quick Action: '${action}' triggered. Feature not implemented.` });
  };

  const actions = [
    { icon: FileText, title: 'Generate Pitch Deck', description: 'Create a new, customized presentation.', action: 'Pitch' },
    { icon: DollarSign, title: 'Update Funding Goal', description: 'Adjust your current funding round details.', action: 'Funding' },
    { icon: Briefcase, title: 'Manage Team Members', description: 'Add or edit founder and team roles.', action: 'Team' },
    { icon: BarChart3, title: 'View Analytics', description: 'Deep dive into growth and user metrics.', action: 'Analytics' },
  ];

  return (
    <div className="widget">
      <h2>Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ActionButton
              icon={action.icon}
              title={action.title}
              description={action.description}
              onClick={() => handleAction(action.title)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- SIDEBAR ---
const Sidebar = ({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean; setIsMobileOpen: (open: boolean) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'profil', label: 'Profil Startup', icon: '🏢', path: '/profile' },
    { id: 'generateur', label: 'Générateur IA', icon: '💡', path: '/generateur' },
    { id: 'investisseurs', label: 'Investisseurs', icon: '📈', path: '/investisseurs' },
    { id: 'analytics', label: 'Analytics', icon: '📅', path: '/investor-calendar' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' }
  ];
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  return (
    <>
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo-icon">🏢</div>
              <div className="logo-text">
                <h1>StartupHub</h1>
                <p>IA Platform</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsMobileOpen(false)}>✕</button>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <span className="nav-icon">🚪</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// --- MAIN DASHBOARD ---
const Dashboard = () => {
  const { toast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dashboard data state
  const [startupName, setStartupName] = useState('Your Startup');
  const [userName, setUserName] = useState('Founder');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [metrics, setMetrics] = useState({
    pitchesGenerated: 0,
    investorsMatched: 0,
    milestonesCompleted: 0,
    connectionsActive: 0
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  const getAuthToken = () => localStorage.getItem('accessToken');

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      const token = getAuthToken();
      if (!token) {
        setError('Non authentifié.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/dashboard/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Échec du chargement du dashboard');
        }

        const data = await res.json();
        
        // Set state from backend response
        setStartupName(data.startupName || 'Your Startup');
        setUserName(data.userName || 'Founder');
        setProfileCompletion(data.profileCompletion || 0);
        setMetrics({
          pitchesGenerated: data.pitchsGenerated || 0,
          investorsMatched: data.matchingInvestors || 0,
          milestonesCompleted: data.milestonesCompleted || 0,
          connectionsActive: data.connectionsActive || 0
        });

        // Mock recent activity (backend doesn't provide this yet)
        setRecentActivity([
          { id: '1', type: 'pitch', title: 'New pitch generated', description: 'AI pitch created for FinTech sector', timestamp: '2 hours ago', icon: 'FileText' },
          { id: '2', type: 'investor', title: 'Investor match found', description: 'Matched with 3 new investors', timestamp: '5 hours ago', icon: 'Users' },
          { id: '3', type: 'milestone', title: 'Milestone achieved', description: 'Completed product development', timestamp: '1 day ago', icon: 'Target' },
          { id: '4', type: 'meeting', title: 'Meeting scheduled', description: 'Call with investor on Dec 5', timestamp: '2 days ago', icon: 'Calendar' },
          { id: '5', type: 'feedback', title: 'Pitch feedback received', description: 'Positive feedback on your pitch', timestamp: '3 days ago', icon: 'MessageSquare' }
        ]);

        setLoading(false);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Erreur réseau');
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div className="main-content">
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Chargement du dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-layout">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div className="main-content">
          <div className="error-screen">
            <div className="error-icon">✕</div>
            <h2>Erreur</h2>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="main-content">
        {/* Top Navigation */}
        <nav className="topbar">
          <div className="topbar-left">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden"
            >
              <Menu />
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
            <Button variant="ghost" size="icon" className="relative">
              <Bell />
              <span className="notification-dot"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings />
            </Button>
            <div className="user-info">
              <div className="user-text hidden sm:block">
                <p className="user-name">{userName}</p>
                <p className="user-startup">{startupName}</p>
              </div>
              <div className="avatar">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="dashboard-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="welcome-section"
          >
            <h1>Welcome back, {userName}! 👋</h1>
            <p>Here's what's happening with {startupName} today.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="profile-banner">
              <div className="profile-header">
                <div className="profile-title">
                  <Award />
                  <div>
                    <h3>Profile Completion</h3>
                    <p>Complete your profile to unlock more features</p>
                  </div>
                </div>
                <div className="profile-percent">{profileCompletion}%</div>
              </div>
              <div className="profile-progress-bg">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="profile-progress"
                />
              </div>
              {profileCompletion < 100 && (
                <Button variant="ghost" className="profile-cta">
                  Complete Profile
                  <ChevronRight />
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="metrics-grid"
          >
            <MetricCard
              icon={FileText}
              title="Pitches Generated"
              value={metrics.pitchesGenerated}
              change="+3 this week"
              color="blue"
              delay={0.3}
            />
            <MetricCard
              icon={Users}
              title="Investors Matched"
              value={metrics.investorsMatched}
              change="+2 this week"
              color="green"
              delay={0.4}
            />
            <MetricCard
              icon={Target}
              title="Milestones Completed"
              value={metrics.milestonesCompleted}
              change="+5 this month"
              color="indigo"
              delay={0.5}
            />
          </motion.div>

          <div className="content-grid">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <QuickActions />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <ActivityFeed activities={recentActivity} />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <ToastProvider>
    <Dashboard />
  </ToastProvider>
);

export default App;