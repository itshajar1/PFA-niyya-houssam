// src/pages/CalendarPage.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Link, useLocation, useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);
moment.locale('fr');

// Types
interface MeetingRequest {
  id: string;
  meetingDate: string;
  message: string;
  statut: string; // ← avec "t" (conforme à ton backend)
  investor: {
    nom: string;
    type: string;
    email: string;
  };
  startup: null | { nom: string }; // peut être null
}
// Types
interface FormattedMeetingRequest {
  id: string;
  investorName: string;
  message: string;
  meetingDate: string;
  statut: string;
}

interface CalendarEvent {
  tooltip: string;
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
}
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
const CalendarPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar'>('requests');
  const [requests, setRequests] = useState<FormattedMeetingRequest[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem('accessToken');

  // Charger les données au montage
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([
      fetchReceivedMeetings(),
      fetchUpcomingMeetings()
    ]);
    setLoading(false);
  };

  const fetchReceivedMeetings = async () => {
  try {
    const token = getAuthToken();
    // 👇 Ajoute cache: 'no-store'
    const res = await fetch('http://localhost:8080/api/meetings/received', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store' // ← Désactive le cache HTTP
    });
    const  data:any[] = await res.json();
    const formattedRequests: FormattedMeetingRequest[] = data.map(m => ({
      id: m.id,
      investorName: m.investor?.nom || 'Investisseur',
      message: m.message,
      meetingDate: m.meetingDate,
      statut: m.statut
    }));
    setRequests(formattedRequests);
  } catch (err: any) {
    console.error(err);
  }
};

  const fetchUpcomingMeetings = async () => {
  try {
    const token = getAuthToken();
    const res = await fetch('http://localhost:8080/api/meetings/upcoming', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data: any[] = await res.json(); // ✅ variable déclarée
  const events: CalendarEvent[] = data.map(m => {
  const date = new Date(m.meetingDate);
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const place = m.meetingPlace || 'Lieu non précisé';

  return {
    id: m.id,
    title: `${m.investor?.nom || 'Investisseur'} – ${m.startup?.nom || 'Ma startup'}`,
    start: date,
    end: new Date(date.getTime() + 30 * 60000),
    status: m.statut,
    tooltip: `🕒 ${time} | 📍 ${place}` // ← Single line
  };
});
    setUpcomingMeetings(events);
  } catch (err: any) {
    console.error(err);
  }
};
  

  const handleAccept = async (id: string) => {
  try {
    const token = getAuthToken();
    await fetch(`http://localhost:8080/api/meetings/${id}/accept`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });

    // ✅ Mettre à jour l'état localement
    setRequests(prev => prev.filter(r => r.id !== id)); // Supprime de la liste des demandes

    // ✅ Optionnel : Ajouter directement au calendrier (si tu veux voir l'effet immédiat)
    // Ou laisse fetchData() se charger de recharger tout (comme avant)

    await fetchData(); // Recharge tout pour être sûr
  } catch (err) {
    setError('Échec de l’acceptation');
  }
};

const handleReject = async (id: string) => {
  try {
    const token = getAuthToken();
    await fetch(`http://localhost:8080/api/meetings/${id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });

    // ✅ Mettre à jour l'état localement
    setRequests(prev => prev.filter(r => r.id !== id)); // Supprime de la liste des demandes

    await fetchData(); // Recharge tout pour être sûr
  } catch (err) {
    setError('Échec du refus');
  }
};

  if (loading) {
    return (
      <div className="calendar-page">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div className="main-content">
          <div className="loading">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="main-content">
        <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="calendar-header">
          <h1>📅 Mes Réunions</h1>
          <p>Gérez vos demandes et visualisez votre agenda</p>
        </div>

        {error && (
          <div className="toast toast-error">
            <span className="toast-icon">✕</span>
            {error}
          </div>
        )}

        {/* Onglets */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📥 Demandes ({requests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            🗓️ Calendrier ({upcomingMeetings.length})
          </button>
        </div>

        <main className="content-area">
          {activeTab === 'requests' ? (
            <div className="requests-list">
              {requests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>Aucune demande de réunion</h3>
                  <p>Les investisseurs peuvent vous contacter depuis votre profil.</p>
                </div>
              ) : (
                <div className="requests-grid">
                  {requests.map(request => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <h4>{request.investorName}</h4>
                       
                      </div>
                      <p className="request-message">{request.message}</p>
                      <div className="request-date">
                        📅 {new Date(request.meetingDate).toLocaleString('fr-FR')}
                      </div>
                      <div className="request-actions">
                        <button
                          className="btn btn-reject"
                          onClick={() => handleReject(request.id)}
                        >
                          Refuser
                        </button>
                        <button
                          className="btn btn-accept"
                          onClick={() => handleAccept(request.id)}
                        >
                          Accepter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="calendar-container">
              {upcomingMeetings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🗓️</div>
                  <h3>Aucune réunion confirmée</h3>
                  <p>Acceptez des demandes pour les voir ici.</p>
                </div>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={upcomingMeetings}
                  startAccessor="start"
                  endAccessor="end"
                  tooltipAccessor={(event) => event.tooltip} 
                  style={{ height: '70vh' }}
                  culture="fr"
                  messages={{
                    today: "Aujourd'hui",
                    previous: "<",
                    next: ">",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                    noEventsInRange: "Aucune réunion confirmée"
                  }}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CalendarPage;