// src/pages/InvestorMeetingsPage.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import './inv-calendar.css';

const localizer = momentLocalizer(moment);
moment.locale('fr');

// Types
interface Meeting {
  id: string;
  connectionId: string; 
  statut: string;
  meetingDate: string;
  meetingPlace: string;
  message: string;
  startup: { nom: string; secteur: string };
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  place: string;
}
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
// Composant d'événement personnalisé pour le calendrier
const CustomEvent = ({ event }: { event: CalendarEvent }) => (
  <div className="calendar-event-content">
    <div className="event-title">{event.title}</div>
    <div className="event-details">
      🕒 {new Date(event.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      &nbsp;|&nbsp;
      📍 {event.place || 'Lieu non précisé'}
    </div>
  </div>
);

const InvestorMeetingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar'>('requests');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
const [showRescheduleModal, setShowRescheduleModal] = useState(false);
const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const getAuthToken = () => localStorage.getItem('accessToken');

  // Charger les deux datasets au montage
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Charger les demandes envoyées
      const sentRes = await fetch('http://localhost:8080/api/meetings/sent', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const  data:Meeting[] = await sentRes.json();
      setMeetings(data);

      // Charger les réunions à venir (ACCEPTED only)
      const upcomingRes = await fetch('http://localhost:8080/api/meetings/upcoming', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const  data1:any[] = await upcomingRes.json();
      const events: CalendarEvent[] = data1.map(m => ({
        id: m.id,
        title: `${m.startup?.nom || 'Startup'}`,
        start: new Date(m.meetingDate),
        end: new Date(new Date(m.meetingDate).getTime() + 45 * 60000),
        place: m.meetingPlace || 'Lieu non précisé'
      }));
      setCalendarEvents(events);
    } catch (err: any) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };
  const [newDate, setNewDate] = useState('');
const [newMessage, setNewMessage] = useState('');
const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

const handleReschedule = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedMeetingId || !newDate || !selectedMeeting) return;

  const token = getAuthToken();
  const payload = {
    connectionId: selectedMeeting.connectionId, 
    meetingDate: newDate,
    meetingPlace: selectedMeeting.meetingPlace || "Visioconférence", 
    message: newMessage || undefined
  };

  try {
    const res = await fetch(`http://localhost:8080/api/meetings/${selectedMeetingId}/reschedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
if (!res.ok) throw new Error('Échec du rescheduling');

// ✅ Fermer la modal
setShowRescheduleModal(false);
setNewDate('');
setNewMessage('');
setSelectedMeeting(null);
setSelectedMeetingId(null);

// ✅ Recharger les données
await fetchData();
  } catch (err) {
    setError('Erreur lors de la proposition');
  }
};
const handleCancelMeeting = async (meetingId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette réunion ?')) return;

  const token = getAuthToken();
  try {
    const res = await fetch(`http://localhost:8080/api/meetings/${meetingId}/cancel`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Échec de l’annulation');

    // Recharger les données
    await fetchData();
  } catch (err: any) {
    setError('Erreur lors de l’annulation de la réunion');
  }
};
  const getStatusBadge = (status: string) => {
    const config: Record<string, { text: string; color: string }> = {
      PENDING: { text: 'En attente', color: '#f39c12' },
      ACCEPTED: { text: 'Acceptée', color: '#27ae60' },
      REJECTED: { text: 'Refusée', color: '#e74c3c' },
      CANCELLED: { text: 'Annulée', color: '#95a5a6' }
    };
    const { text, color } = config[status] || config.PENDING;
    return <span className="status-badge" style={{ backgroundColor: color + '20', color }}>{text}</span>;
  };

  if (loading) {
    return (
      <div className="meetings-page">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div className="main-content">
          <div className="loading">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="meetings-page">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="main-content">
        <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="page-header">
          <h1>📅 Réunions & Agenda</h1>
          <p>Gérez vos demandes et visualisez vos rendez-vous confirmés</p>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Onglets */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📩 Demandes ({meetings.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            🗓️ Calendrier ({calendarEvents.length})
          </button>
        </div>

        <main className="content-area">
          {activeTab === 'requests' ? (
            <div className="meetings-list">
              {meetings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>Aucune demande envoyée</h3>
                  <p>Commencez par contacter des startups depuis la page <strong>Startups</strong>.</p>
                </div>
              ) : (
                <div className="meetings-grid">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="meeting-card">
                      <div className="meeting-header">
                        <h3>{meeting.startup?.nom || 'Startup'}</h3>
                        {getStatusBadge(meeting.statut)}
                      </div>
                      <p className="meeting-message">{meeting.message}</p>

                     <div className="meeting-details">
  <div>📅 {new Date(meeting.meetingDate).toLocaleString('fr-FR')}</div>
  <div>📍 {meeting.meetingPlace || 'Lieu non précisé'}</div>
  {meeting.statut === 'ACCEPTED' && (
  <div className="meeting-actions">
    <button
      className="btn-reschedule"
      title="Replanifier"
      onClick={() => {
        setSelectedMeetingId(meeting.id);
        setSelectedMeeting(meeting);
        setShowRescheduleModal(true);
      }}
    >
      🔄 Replanifier
    </button>
    <button
      className="btn-cancel"
      title="Annuler la réunion"
      onClick={() => handleCancelMeeting(meeting.id)}
    >
      ❌ Annuler
    </button>
  </div>
)}
</div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="calendar-container">
              {calendarEvents.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🗓️</div>
                  <h3>Aucune réunion confirmée</h3>
                  <p>Vous verrez vos réunions ici une fois acceptées par les startups.</p>
                </div>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  components={{ event: CustomEvent }}
                  culture="fr"
                  messages={{
                    today: "Aujourd'hui",
                    previous: "<",
                    next: ">",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                    noEventsInRange: "Aucune réunion prévue"
                  }}
                />
              )}
            </div>
          )}
        </main>
      </div>
      {showRescheduleModal && (
  <div className="modal-backdrop" onClick={() => setShowRescheduleModal(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close-btn" onClick={() => setShowRescheduleModal(false)}>✕</button>
      <h2>🔄 Replanifier la réunion</h2>
      <p>Proposez une nouvelle date et heure à la startup.</p>

      <form onSubmit={handleReschedule}>
        <div className="form-group">
          <label>Nouvelle date & heure</label>
          <input
            type="datetime-local"
            required
            onChange={(e) => setNewDate(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Message (optionnel)</label>
          <textarea
            placeholder="Ex: Je suis disponible le 5 janvier à 14h."
            onChange={(e) => setNewMessage(e.target.value)}
            className="form-input"
            rows={3}
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={() => setShowRescheduleModal(false)}>
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            Envoyer la proposition
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default InvestorMeetingsPage;