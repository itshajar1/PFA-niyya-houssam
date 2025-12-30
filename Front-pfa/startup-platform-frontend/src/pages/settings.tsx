// src/pages/SettingsPage.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './settings.css';
 // Réutilise ton Sidebar existant
const Sidebar = ({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean; setIsMobileOpen: (open: boolean) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'profil', label: 'Profil Startup', icon: '🏢', path: '/profile' },
    { id: 'generateur', label: 'Générateur IA', icon: '💡', path: '/generateur' },
    { id: 'investisseurs', label: 'Investisseurs', icon: '📈', path: '/investisseurs' },
    { id: 'analytics', label: 'Calendrier', icon: '📅', path: '/calendar' },
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

const SettingsPage: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem('accessToken');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Appel API pour sauvegarder le profil
    setSuccess('Profil mis à jour avec succès !');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de supprimer votre compte ? Cette action est irréversible.')) return;

    const token = getAuthToken();
    try {
      // TODO: Appel API pour supprimer le compte
      // await fetch('http://localhost:8080/api/startup/me', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (err) {
      setError('Erreur lors de la suppression du compte.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="settings-page">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="main-content">
        <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="settings-header">
          <h1>⚙️ Paramètres</h1>
          <p>Gérez votre profil, compte et préférences</p>
        </div>

        {success && (
          <div className="toast toast-success">
            <span className="toast-icon">✓</span>
            {success}
          </div>
        )}
        {error && (
          <div className="toast toast-error">
            <span className="toast-icon">✕</span>
            {error}
          </div>
        )}

    
         

        <div className="settings-section">
          <h2>🔔 Notifications</h2>
          <div className="settings-form">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Recevoir un email pour les nouvelles demandes de réunion</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Recevoir un rappel 1h avant chaque réunion</span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>🔒 Compte</h2>
          <div className="settings-form">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => alert("Fonctionnalité non implémentée - changer mot de passe")}
            >
              Changer le mot de passe
            </button>
          </div>
        </div>

        <div className="settings-section danger-zone">
          <h2 style={{ color: '#e74c3c' }}>⚠️ Zone de danger</h2>
          <p>Actions irréversibles. Soyez prudent.</p>
          <button type="button" className="btn-danger" onClick={handleDeleteAccount}>
            Supprimer mon compte
          </button>
        </div>

        <div className="settings-footer">
          <button type="button" className="btn-logout" onClick={handleLogout}>
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;