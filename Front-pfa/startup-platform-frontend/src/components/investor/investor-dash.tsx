// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  Briefcase,
  Target,
  TrendingUp,
  Settings,
  LogOut,
  Search,
  Bell,
  Mail,
  FileText,
  Users,
  Filter,
} from 'lucide-react';
import './investor-dash.css';

// 🔹 Types from backend
interface DashboardResponse {
  profileCompletion: number;
  pitchsGenerated: number;
  matchingInvestors: number;
  connectionsActive: number;
  milestonesCompleted: number;
  lastUpdated?: string;
  recentActivities: Activity[];
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 🔹 Dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  // 🔹 Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch('http://localhost:8080/api/dashboard/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Échec du chargement du tableau de bord');

        const  data:DashboardResponse = await res.json();
        setDashboardData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // Sidebar menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/investor-dashboard' },
    { id: 'profil', label: 'Profil Investisseur', icon: '👤', path: '/profile-investor' },
    { id: 'startups', label: 'Startups', icon: '🏢', path: '/investor/startups' },
    { id: 'analytics', label: 'Calendrier', icon: '📅', path: '/calendar' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️', path: '/investor/settings' }
  ];

  // 🔹 Render page content
  const renderPageContent = () => {
    // Loading state
    if (loading && location.pathname === '/investor/dashboard') {
      return <div className="loading">Chargement du tableau de bord…</div>;
    }

    // Error state
    if (error) {
      return <div className="error">❌ {error}</div>;
    }

    // Default: Dashboard home
    return (
      <>
        <h1 className="welcome-title">Welcome back, Investisseur! 👋</h1>
        <p className="welcome-subtitle">
          Voici l’aperçu de votre activité d’investissement aujourd’hui.
        </p>

        {/* Profile Completion Card */}
        {dashboardData && (
          <div className="completion-card">
            <div className="completion-header">
              <div className="completion-info">
                <div className="completion-icon">
                  <Briefcase size={24} color="#6366f1" />
                </div>
                <div>
                  <div className="completion-title">Complétion du Profil</div>
                  <div className="completion-subtitle">
                    Complétez votre profil pour améliorer les matchings
                  </div>
                </div>
              </div>
              <div className="completion-score">{dashboardData.profileCompletion}%</div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${dashboardData.profileCompletion}%` }}
              ></div>
            </div>
            <button
              className="complete-btn"
              onClick={() => navigate('/profile-investor')}
            >
              Modifier le profil <span className="arrow">→</span>
            </button>
          </div>
        )}

        {/* Stats Grid */}
        {dashboardData && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Startups Matchées</span>
                <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
                  <Target size={24} color="#6366f1" />
                </div>
              </div>
              <div className="stat-value">{dashboardData.matchingInvestors}</div>
              <div className="stat-change">
                <TrendingUp size={16} color="#10b981" />
                <span className="stat-change-text">
                  +{Math.max(1, Math.floor(dashboardData.matchingInvestors / 4))} cette semaine
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Demandes de Connexion</span>
                <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
                  <Users size={24} color="#10b981" />
                </div>
              </div>
              <div className="stat-value">{dashboardData.connectionsActive}</div>
              <div className="stat-change">
                <TrendingUp size={16} color="#10b981" />
                <span className="stat-change-text">
                  +{Math.max(1, Math.floor(dashboardData.connectionsActive / 3))} cette semaine
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Investissements Actifs</span>
                <div className="stat-icon" style={{ backgroundColor: '#fce7f3' }}>
                  <Briefcase size={24} color="#ec4899" />
                </div>
              </div>
              <div className="stat-value">{dashboardData.connectionsActive}</div>
              <div className="stat-change">
                <TrendingUp size={16} color="#10b981" />
                <span className="stat-change-text">+2 ce mois-ci</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Grid: Quick Actions + Recent Activity */}
        <div className="bottom-grid">
          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Actions Rapides</h2>
            <div className="actions-list">
              <button
                className="action-card"
                onClick={() => navigate('/investor/startups')}
              >
                <div className="action-icon" style={{ backgroundColor: '#e0e7ff' }}>
                  <Target size={24} color="#6366f1" />
                </div>
                <div className="action-content">
                  <div className="action-title">Explorer les Startups</div>
                  <div className="action-description">Voir les startups matchées à vos critères</div>
                </div>
                <span className="action-arrow">→</span>
              </button>

              <button
                className="action-card"
                onClick={() => alert("Fonctionnalité à venir : Pitch Decks")}
              >
                <div className="action-icon" style={{ backgroundColor: '#d1fae5' }}>
                  <FileText size={24} color="#10b981" />
                </div>
                <div className="action-content">
                  <div className="action-title">Pitch Decks à Lire</div>
                  <div className="action-description">Vérifiez les pitchs en attente</div>
                </div>
                <span className="action-arrow">→</span>
              </button>

              <button
                className="action-card"
                onClick={() => navigate('/investor/settings')}
              >
                <div className="action-icon" style={{ backgroundColor: '#fef3c7' }}>
                  <Filter size={24} color="#f59e0b" />
                </div>
                <div className="action-content">
                  <div className="action-title">Mettre à Jour les Critères</div>
                  <div className="action-description">Affinez vos préférences d’investissement</div>
                </div>
                <span className="action-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2 className="section-title">Activité Récente</h2>
            <div className="activity-list">
              {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon" style={{ backgroundColor: '#e0e7ff' }}>
                      <Target size={20} color="#6366f1" />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-description">{activity.description}</div>
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                ))
              ) : (
                <p>Aucune activité récente.</p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <>
        {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />}
        <aside className={`sidebar ${isMobileOpen ? 'sidebar-open' : ''}`}>
          <div className="sidebar-content">
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <div className="logo-icon">💼</div>
                <div className="logo-text">
                  <h1>InvestorHub</h1>
                  <p>Startup Platform</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsMobileOpen(false)}>✕</button>
            </div>

            <nav className="sidebar-nav">
              {menuItems.map((item) => {
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

      {/* Main Content */}
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setIsMobileOpen(true)}>☰</button>
            <div className="header-title">
              <h1>Dashboard</h1>
              <p>Aperçu de votre activité</p>
            </div>
          </div>
          <div className="header-right">
            <button className="icon-btn">🔍</button>
            <button className="icon-btn notification-btn">
              🔔
              <span className="notification-badge"></span>
            </button>
            <div className="user-avatar">IN</div>
          </div>
        </header>

        <main className="content-area">{renderPageContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;