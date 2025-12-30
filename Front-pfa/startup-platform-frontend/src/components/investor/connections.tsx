// src/pages/InvestorConnectionsPage.tsx
import React, { useState, useEffect } from 'react';
import './connections.css';
import { Link, useLocation } from 'react-router-dom';

// ===== Sidebar Component ====
const Sidebar = ({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean; setIsMobileOpen: (open: boolean) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/investor/dashboard' },
    { id: 'profil', label: 'Profil Investisseur', icon: '👤', path: '/investor/profile' },
    { id: 'startups', label: 'Startups', icon: '🏢', path: '/investor/startups' },
    
    { id: 'analytics', label: 'Calendrier', icon: '📅', path: '/calendar' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️', path: '/investor/settings' }
  ];
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  return (
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

// ===== Interfaces ====
interface ConnectionRequest {
  id: string;
  startupId: string;
  startupName: string;
  startupDescription: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  startupDetails?: StartupDetails; // ← Add this
}

interface StartupDetails {
  id: string;
  nom: string;
  secteur: string;
  description: string;
  tags: string[];
  profileCompletion: number;
  siteWeb: string;
  team: Array<{ nom: string; role: string }>;
  milestones: Array<{ titre: string; statut: string }>;
  matchingScore: number | null;
}

// ===== Main Component ====
const InvestorConnectionsPage: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ConnectionRequest[]>([]);
  
  const [activeFilter, setActiveFilter] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED'>('PENDING');
  
  // Modals
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(null);
  const [startupDetails, setStartupDetails] = useState<StartupDetails | null>(null);

  const [meetingData, setMeetingData] = useState({
    meetingDate: '',
    meetingPlace: '',
    message: 'Bonjour, proposons une réunion pour discuter plus en détail.',
  });

  const getAuthToken = () => localStorage.getItem('accessToken');

  // Fetch connection requests
  const fetchRequests = async () => {
  const token = getAuthToken();
  if (!token) {
    setError('Non authentifié.');
    setLoading(false);
    return;
  }

  try {
    // 1. Fetch connections
    const res = await fetch('http://localhost:8080/api/connections/received', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const connections = await res.json();

    // 2. For each connection, fetch startup details
    const enrichedRequests = await Promise.all(
      connections.map(async (req: any) => {
        const rawStatus = req.statut;
        let status: 'PENDING' | 'ACCEPTED' | 'REJECTED' = 'PENDING';
        if (rawStatus === 'ACCEPTED') status = 'ACCEPTED';
        else if (rawStatus === 'REJECTED') status = 'REJECTED';

        // Fetch startup details
        const startupRes = await fetch(
          `http://localhost:8080/api/investors/startups/${req.startupId}/details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const startup = await startupRes.json();

        return {
          id: req.id,
          startupId: req.startupId,
          startupName: startup.nom || 'Startup inconnue',
          startupDescription: startup.description || 'Aucune description.',
          message: req.message || '',
          status,
          createdAt: req.createdAt,
          // Optional: cache full details for instant modal
          startupDetails: startup,
        };
      })
    );

    setRequests(enrichedRequests);
    setFilteredRequests(enrichedRequests);
    setLoading(false);
  } catch (err: any) {
    console.error(err);
    setError(err.message || 'Erreur réseau');
    setLoading(false);
  }
};

  useEffect(() => {
    fetchRequests();
  }, []);

  // Apply filters
  useEffect(() => {
    setFilteredRequests(requests.filter(req => req.status === activeFilter));
  }, [activeFilter, requests]);

  // Accept connection
  const acceptConnection = async (id: string) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8080/api/connections/${id}/accept`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Échec de l\'acceptation.');

      await fetchRequests();
      setSuccess('Demande acceptée avec succès !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Reject connection
  const rejectConnection = async (id: string) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8080/api/connections/${id}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Échec du rejet.');

      await fetchRequests();
      setSuccess('Demande rejetée avec succès !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Fetch startup details and open modal
  const openProfileModal = async (startupId: string) => {
    const token = getAuthToken();
    if (!token) {
      setError('Non authentifié.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/investors/startups/${startupId}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Impossible de charger les détails de la startup.');
      }

      const details = await res.json();
      setStartupDetails(details);
      setShowProfileModal(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du profil.');
    } finally {
      setLoading(false);
    }
  };

  // Open meeting modal
  const openMeetingModal = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setShowMeetingModal(true);
  };

  // Schedule meeting
  const scheduleMeeting = async () => {
    const token = getAuthToken();
    if (!token || !selectedConnectionId) return;

    try {
      const res = await fetch('http://localhost:8080/api/meetings/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          connectionId: selectedConnectionId,
          meetingDate: meetingData.meetingDate,
          meetingPlace: meetingData.meetingPlace,
          message: meetingData.message,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setShowMeetingModal(false);
      setSuccess('Réunion planifiée avec succès !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="connections-page">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div className="main-content">
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Chargement des demandes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="connections-page">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setIsMobileOpen(true)}>☰</button>
            <div className="header-title">
              <h1>Demandes de Connexion</h1>
              <p>Gérez les demandes des startups intéressées</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-avatar">IH</div>
          </div>
        </header>

        <main className="content-area">
          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Filters */}
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setActiveFilter('PENDING')}
            >
              Nouvelles ({requests.filter(r => r.status === 'PENDING').length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'ACCEPTED' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ACCEPTED')}
            >
              Acceptées ({requests.filter(r => r.status === 'ACCEPTED').length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'REJECTED' ? 'active' : ''}`}
              onClick={() => setActiveFilter('REJECTED')}
            >
              Rejetées ({requests.filter(r => r.status === 'REJECTED').length})
            </button>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="no-requests">
              <div className="no-requests-icon">📬</div>
              <h3>Aucune demande {activeFilter === 'PENDING' ? 'nouvelle' : activeFilter.toLowerCase()}</h3>
              <p>Ajustez vos filtres ou attendez de nouvelles demandes.</p>
            </div>
          ) : (
            <div className="requests-list">
              {filteredRequests.map(req => (
                <div key={req.id} className={`request-card ${req.status.toLowerCase()}`}>
                  <div className="request-header">
                    <div className="startup-avatar">
                      {req.startupName.charAt(0).toUpperCase()}
                    </div>
                    <div className="startup-info">
                      <h3>{req.startupName}</h3>
                    </div>
                    <span className={`status-badge status-${req.status.toLowerCase()}`}>
                      {req.status === 'PENDING' && '⏳ En attente'}
                      {req.status === 'ACCEPTED' && '✅ Acceptée'}
                      {req.status === 'REJECTED' && '❌ Rejetée'}
                    </span>
                  </div>

                  <div className="request-body">
                    <div className="startup-description">
                      <strong>Description :</strong>
                      <p>{req.startupDescription}</p>
                    </div>
                    <div className="message-section">
                      <strong>Message de la startup :</strong>
                      <p className="connection-message">
                        {req.message.trim() || 'Aucun message personnalisé.'}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {req.status === 'PENDING' && (
                    <div className="request-actions">
                      <button
                        className="btn btn-view"
                        onClick={() => openProfileModal(req.startupId)}
                      >
                        👁️ Voir le profil
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => rejectConnection(req.id)}
                      >
                        ❌ Refuser
                      </button>
                      <button
                        className="btn btn-accept"
                        onClick={() => acceptConnection(req.id)}
                      >
                        ✅ Accepter
                      </button>
                    </div>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <div className="request-actions">
                      <button
                        className="btn btn-meeting"
                        onClick={() => openMeetingModal(req.id)}
                      >
                        📅 Planifier une réunion
                      </button>
                      <button
                        className="btn btn-view"
                        onClick={() => openProfileModal(req.startupId)}
                      >
                        👁️ Voir le profil
                      </button>
                    </div>
                  )}

                  {req.status === 'REJECTED' && (
                    <div className="request-footer">
                      <small>❌ La demande a été rejetée par vos soins.</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Meeting Modal */}
        {showMeetingModal && (
          <div className="modal-overlay" onClick={() => setShowMeetingModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Planifier une Réunion</h2>
                <button className="modal-close" onClick={() => setShowMeetingModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Date et heure</label>
                  <input
                    type="datetime-local"
                    value={meetingData.meetingDate}
                    onChange={(e) => setMeetingData({ ...meetingData, meetingDate: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Lieu (optionnel)</label>
                  <input
                    type="text"
                    placeholder="Ex: Google Meet, Casablanca, etc."
                    value={meetingData.meetingPlace}
                    onChange={(e) => setMeetingData({ ...meetingData, meetingPlace: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    rows={3}
                    value={meetingData.message}
                    onChange={(e) => setMeetingData({ ...meetingData, message: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setShowMeetingModal(false)}>
                  Annuler
                </button>
                <button className="btn btn-primary" onClick={scheduleMeeting}>
                  Planifier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {showProfileModal && startupDetails && (
          <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Profil de la Startup</h2>
                <button className="modal-close" onClick={() => setShowProfileModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="startup-full-profile">
                  <h3>{startupDetails.nom}</h3>
                  <p><strong>Secteur:</strong> {startupDetails.secteur}</p>
                  <p>{startupDetails.description}</p>
                  
                  <h4>Équipe</h4>
                  <ul>
                    {startupDetails.team.map((member, i) => (
                      <li key={i}>{member.nom} - {member.role}</li>
                    ))}
                  </ul>

                  <h4>Jalons</h4>
                  <ul>
                    {startupDetails.milestones.map((m, i) => (
                      <li key={i} style={{ color: m.statut === 'COMPLETED' ? 'green' : 'orange' }}>
                        {m.titre} — {m.statut}
                      </li>
                    ))}
                  </ul>

                  {startupDetails.matchingScore != null && (
                    <p><strong>Score de matching:</strong> {startupDetails.matchingScore}%</p>
                  )}

                  {startupDetails.siteWeb && (
                    <p>
                      <a href={startupDetails.siteWeb} target="_blank" rel="noreferrer">
                        Site web
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setShowProfileModal(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorConnectionsPage;