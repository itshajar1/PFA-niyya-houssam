// src/components/startup/StartupProfile.tsx
import React, { useState, useEffect } from 'react';
import './StartupProfile.css';
import { Link, useLocation } from 'react-router-dom';

// ===== Interfaces =====
interface FounderMember {
  id: string;
  nom: string;
  role: string;
  linkedin?: string;
}

// Instead of enum
const MilestoneStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const;

type MilestoneStatus = typeof MilestoneStatus[keyof typeof MilestoneStatus];

interface Milestone {
  id: string;
  titre: string;
  description?: string;
  dateEcheance?: string; // ISO date (YYYY-MM-DD)
  statut: MilestoneStatus;
  completedAt?: string;  // ISO datetime
  createdAt: string;     // ISO datetime
}

type ModalType = 'addTeam' | 'editTeam' | 'addMilestone' | 'editMilestone' | null;
type ModalData = Partial<FounderMember> & Partial<Milestone>;

// ===== Sidebar Component =====
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

// ===== Helper: Date formatting =====
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const formatDateTime = (isoString: string | undefined): string => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('fr-FR');
};

// ===== Main Component =====
const StartupProfile = () => {
  const [startup, setStartup] = useState<{ [key: string]: any } | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    secteur: '',
    description: '',
    tags: '',
    siteWeb: '',
    dateCreation: '',
  });
  const [mode, setMode] = useState<'loading' | 'view' | 'form'>('loading');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [team, setTeam] = useState<FounderMember[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const [modal, setModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<ModalData>({});

  const getAuthToken = () => localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      if (!token) {
        setError('Non authentifié.');
        setMode('form');
        return;
      }

      try {
        const startupRes = await fetch('http://localhost:8080/api/startups/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (startupRes.ok) {
          const startupData = await startupRes.json();
          setStartup(startupData);
          setFormData({
            nom: startupData.nom || '',
            secteur: startupData.secteur || '',
            description: startupData.description || '',
            tags: startupData.tags || '',
            siteWeb: startupData.siteWeb || '',
            dateCreation: startupData.dateCreation ? startupData.dateCreation.split('T')[0] : '',
          });
          setMode('view');

          const teamRes = await fetch('http://localhost:8080/api/startups/me/team', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (teamRes.ok) {
            const teamData = await teamRes.json();
            setTeam(Array.isArray(teamData) ? teamData : []);
          }

          const milestonesRes = await fetch('http://localhost:8080/api/startups/me/milestones', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (milestonesRes.ok) {
            const milestonesData = await milestonesRes.json();
            setMilestones(Array.isArray(milestonesData) ? milestonesData : []);
          }
        } else {
          setMode('form');
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement.');
        setMode('form');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return;
    if (!formData.nom.trim()) {
      setError('Le nom de la startup est requis.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = startup ? 'http://localhost:8080/api/startups/me' : 'http://localhost:8080/api/startups';
      const method = startup ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setStartup(data);
        setMode('view');
        setSuccess(startup ? 'Profil mis à jour !' : 'Startup créée avec succès !');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Échec de la sauvegarde');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  // === Team CRUD ===
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    const { nom, role } = modalData;
    if (!nom || !role) {
      setError('Nom et rôle sont requis.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/startups/me/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nom: modalData.nom,
          role: modalData.role,
          linkedin: modalData.linkedin
        })
      });

      if (res.ok) {
        const newMember = await res.json() as FounderMember;
        setTeam([...team, newMember]);
        setModal(null);
        setModalData({});
        showSuccess('Membre ajouté !');
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.message || 'Erreur lors de l’ajout.');
      }
    } catch (err) {
      setError('Erreur réseau.');
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!window.confirm('Supprimer ce membre ?')) return;
    const token = getAuthToken();
    try {
      const res = await fetch(`http://localhost:8080/api/startups/me/team/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTeam(team.filter(m => m.id !== id));
        showSuccess('Membre supprimé.');
      } else {
        setError('Impossible de supprimer.');
      }
    } catch (err) {
      setError('Erreur réseau.');
    }
  };

  const openEditTeam = (member: FounderMember) => {
    setModalData({ ...member });
    setModal('editTeam');
  };

  const handleUpdateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    const { id, nom, role } = modalData;
    if (!nom || !role || !id) return;

    try {
      const res = await fetch(`http://localhost:8080/api/startups/me/team/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nom: modalData.nom,
          role: modalData.role,
          linkedin: modalData.linkedin
        })
      });

      if (res.ok) {
        const updated = await res.json() as FounderMember;
        setTeam(team.map(m => m.id === id ? updated : m));
        setModal(null);
        setModalData({});
        showSuccess('Membre mis à jour !');
      } else {
        setError('Erreur lors de la mise à jour.');
      }
    } catch (err) {
      setError('Erreur réseau.');
    }
  };

  // === Milestones CRUD ===
  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    const { titre } = modalData;
    if (!titre) {
      setError('Le titre est requis.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/startups/me/milestones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titre: modalData.titre,
          description: modalData.description,
          dateEcheance: modalData.dateEcheance,
          statut: modalData.statut || MilestoneStatus.TODO
        })
      });

      if (res.ok) {
        const newMilestone = await res.json() as Milestone;
        setMilestones([...milestones, newMilestone]);
        setModal(null);
        setModalData({});
        showSuccess('Jalon ajouté !');
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.message || 'Erreur lors de l’ajout.');
      }
    } catch (err) {
      setError('Erreur réseau.');
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!window.confirm('Supprimer ce jalon ?')) return;
    const token = getAuthToken();
    try {
      const res = await fetch(`http://localhost:8080/api/startups/me/milestones/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMilestones(milestones.filter(m => m.id !== id));
        showSuccess('Jalon supprimé.');
      }
    } catch (err) {
      setError('Erreur réseau.');
    }
  };

  const openEditMilestone = (milestone: Milestone) => {
    setModalData({ ...milestone });
    setModal('editMilestone');
  };

  const handleUpdateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    const { id, titre } = modalData;
    if (!titre || !id) return;

    try {
      const res = await fetch(`http://localhost:8080/api/startups/me/milestones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titre: modalData.titre,
          description: modalData.description,
          dateEcheance: modalData.dateEcheance,
          statut: modalData.statut
        })
      });

      if (res.ok) {
        const updated = await res.json() as Milestone;
        setMilestones(milestones.map(m => m.id === id ? updated : m));
        setModal(null);
        setModalData({});
        showSuccess('Jalon mis à jour !');
      } else {
        setError('Erreur lors de la mise à jour.');
      }
    } catch (err) {
      setError('Erreur réseau.');
    }
  };

  // === Modal Renderers ===
  const renderModal = () => {
    if (!modal) return null;

    const handleChange = (field: keyof ModalData, value: string) => {
      setModalData(prev => ({ ...prev, [field]: value }));
    };

    const renderForm = (
      fields: { label: string; field: keyof ModalData; type?: string; required?: boolean }[],
      onSave: (e: React.FormEvent) => void,
      title: string
    ) => (
      <div className="modal-overlay" onClick={() => { setModal(null); setModalData({}); }}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="close-btn" onClick={() => { setModal(null); setModalData({}); }}>✕</button>
          </div>
          <form onSubmit={onSave} className="form-content">
            {fields.map(({ label, field, type = 'text', required = false }) => {
              if (field === 'statut') {
                return (
                  <div className="form-group" key="statut">
                    <label>{label}{required && ' *'}</label>
                    <select
                      value={modalData.statut || MilestoneStatus.TODO}
                      onChange={(e) => handleChange('statut', e.target.value as MilestoneStatus)}
                      className="form-control"
                      required
                    >
                      <option value={MilestoneStatus.TODO}>À faire</option>
                      <option value={MilestoneStatus.IN_PROGRESS}>En cours</option>
                      <option value={MilestoneStatus.COMPLETED}>Terminé</option>
                    </select>
                  </div>
                );
              }

              return (
                <div className="form-group" key={String(field)}>
                  <label>{label}{required && ' *'}</label>
                  {type === 'textarea' ? (
                    <textarea
                      value={modalData[field] as string || ''}
                      onChange={(e) => handleChange(field, e.target.value)}
                      rows={3}
                      required={required}
                    />
                  ) : (
                    <input
                      type={type}
                      value={modalData[field] as string || ''}
                      onChange={(e) => handleChange(field, e.target.value)}
                      required={required}
                    />
                  )}
                </div>
              );
            })}
            <div className="form-actions">
              <button type="submit" className="btn-primary">Enregistrer</button>
              <button type="button" className="btn-secondary" onClick={() => { setModal(null); setModalData({}); }}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );

    switch (modal) {
      case 'addTeam':
        return renderForm(
          [
            { label: 'Nom complet', field: 'nom', required: true },
            { label: 'Rôle', field: 'role', required: true },
            { label: 'LinkedIn (optionnel)', field: 'linkedin' }
          ],
          handleAddTeamMember,
          'Ajouter un membre'
        );
      case 'editTeam':
        return renderForm(
          [
            { label: 'Nom complet', field: 'nom', required: true },
            { label: 'Rôle', field: 'role', required: true },
            { label: 'LinkedIn', field: 'linkedin' }
          ],
          handleUpdateTeamMember,
          'Modifier le membre'
        );
      case 'addMilestone':
        return renderForm(
          [
            { label: 'Titre', field: 'titre', required: true },
            { label: 'Description', field: 'description', type: 'textarea' },
            { label: 'Date d’échéance', field: 'dateEcheance', type: 'date' },
            { label: 'Statut', field: 'statut', required: true }
          ],
          handleAddMilestone,
          'Ajouter un jalon'
        );
      case 'editMilestone':
        return renderForm(
          [
            { label: 'Titre', field: 'titre', required: true },
            { label: 'Description', field: 'description', type: 'textarea' },
            { label: 'Date d’échéance', field: 'dateEcheance', type: 'date' },
            { label: 'Statut', field: 'statut', required: true }
          ],
          handleUpdateMilestone,
          'Modifier le jalon'
        );
      default:
        return null;
    }
  };

  // === Loading State ===
  if (mode === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // === Render ===
  return (
    <div className="dashboard">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setIsMobileOpen(true)}>☰</button>
            <div className="header-title">
              <h1>Profil Startup</h1>
              <p>Gérez les informations de votre startup</p>
            </div>
          </div>
          
          <div className="header-right">
            <button className="icon-btn">🔍</button>
            <button className="icon-btn notification-btn">
              🔔
              <span className="notification-badge"></span>
            </button>
            <div className="user-avatar">YH</div>
          </div>
        </header>

        <main className="content-area">
          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">✕</span>
              <span>{error}</span>
            </div>
          )}

          {mode === 'view' && startup ? (
            <div className="profile-view">
              {/* === Existing Profile Header === */}
              <div className="profile-header-card">
                <div className="profile-header-content">
                  <div className="profile-info">
                    <div className="company-avatar">{startup.nom.charAt(0)}</div>
                    <div className="company-details">
                      <h2>{startup.nom}</h2>
                      <p className="company-sector">{startup.secteur || 'Secteur non précisé'}</p>
                      <div className="company-meta">
                        <span>📅</span>
                        <span>Fondée en {startup.dateCreation ? new Date(startup.dateCreation).getFullYear() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => setMode('form')}>
                    Modifier
                  </button>
                </div>

                <div className="completion-section">
                  <div className="completion-header">
                    <span>Score de Complétion</span>
                    <span className="completion-score">{startup.profileCompletion}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${startup.profileCompletion}%` }}></div>
                  </div>
                </div>

                {startup.tags && (
                  <div className="tags-container">
                    {startup.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="tag">{tag.trim()}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* === 1. Informations Générales & Complémentaires === */}
              <div className="info-grid">
                <div className="info-card">
                  <h3>Informations Générales</h3>
                  <div className="form-group">
                    <label>Nom de la startup</label>
                    <input type="text" value={startup.nom} disabled className="input-disabled" />
                  </div>
                  <div className="form-group">
                    <label>Secteur d'activité</label>
                    <input type="text" value={startup.secteur || 'Non précisé'} disabled className="input-disabled" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={startup.description || 'Aucune description'} disabled className="input-disabled" rows={4}></textarea>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Informations Complémentaires</h3>
                  <div className="form-group">
                    <label>🌐 Site web</label>
                    {startup.siteWeb ? (
                      <a href={startup.siteWeb} target="_blank" rel="noreferrer" className="link-input">
                        {startup.siteWeb}
                      </a>
                    ) : (
                      <p className="input-disabled">Non fourni</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>📅 Date de création</label>
                    <input 
                      type="text" 
                      value={startup.dateCreation ? new Date(startup.dateCreation).toLocaleDateString('fr-FR') : 'Non précisée'} 
                      disabled 
                      className="input-disabled" 
                    />
                  </div>
                  <div className="form-group">
                    <label>🏷️ Tags</label>
                    <input type="text" value={startup.tags || 'Aucun tag'} disabled className="input-disabled" />
                  </div>
                </div>
              </div>

              {/* === 2. Équipe Fondatrice === */}
              <div className="info-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3>Équipe Fondatrice</h3>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} 
                    onClick={() => {
                      setModalData({});
                      setModal('addTeam');
                    }}
                  >
                    + Ajouter
                  </button>
                </div>

                {team.length > 0 ? (
                  <div className="info-grid" style={{ gridTemplateColumns: '1fr' }}>
                    {team.map(member => (
                      <div key={member.id} className="info-card" style={{ padding: '1rem', boxShadow: 'none', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0', color: '#111' }}>{member.nom}</h4>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0' }}>{member.role}</p>
                            {member.linkedin && (
                              <a 
                                href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ fontSize: '0.875rem', color: '#6366f1' }}
                              >
                                LinkedIn
                              </a>
                            )}
                          </div>
                          <div>
                            <button 
                              onClick={() => openEditTeam(member)} 
                              className="btn-secondary" 
                              style={{ padding: '0.2rem 0.5rem', marginRight: '0.5rem' }}
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteTeamMember(member.id)} 
                              className="btn-secondary" 
                              style={{ padding: '0.2rem 0.5rem', color: '#ef4444' }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#6b7280' }}>Aucun membre encore ajouté.</p>
                )}
              </div>

              {/* === 3. Suivi des Jalons === */}
              <div className="info-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3>Suivi des Jalons</h3>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} 
                    onClick={() => {
                      setModalData({});
                      setModal('addMilestone');
                    }}
                  >
                    + Ajouter
                  </button>
                </div>

                {milestones.length > 0 ? (
                  <div className="info-grid" style={{ gridTemplateColumns: '1fr' }}>
                    {milestones.map(m => (
                      <div key={m.id} className="info-card" style={{ padding: '1rem', boxShadow: 'none', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, marginRight: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              {/* Status Badge */}
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                backgroundColor: 
                                  m.statut === MilestoneStatus.COMPLETED ? '#dcfce7' :
                                  m.statut === MilestoneStatus.IN_PROGRESS ? '#dbeafe' : '#f3f4f6',
                                color: 
                                  m.statut === MilestoneStatus.COMPLETED ? '#166534' :
                                  m.statut === MilestoneStatus.IN_PROGRESS ? '#1d4ed8' : '#4b5563'
                              }}>
                                {m.statut === MilestoneStatus.TODO ? 'À faire' : 
                                 m.statut === MilestoneStatus.IN_PROGRESS ? 'En cours' : 'Terminé'}
                              </span>
                              <h4 style={{ 
                                margin: 0, 
                                textDecoration: m.statut === MilestoneStatus.COMPLETED ? 'line-through' : 'none',
                                color: m.statut === MilestoneStatus.COMPLETED ? '#6b7280' : '#111'
                              }}>
                                {m.titre}
                              </h4>
                            </div>
                            
                            {m.description && (
                              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0' }}>
                                {m.description}
                              </p>
                            )}
                            
                            <div style={{ 
                              fontSize: '0.8125rem', 
                              color: '#6b7280', 
                              display: 'flex', 
                              gap: '1rem', 
                              marginTop: '0.5rem',
                              flexWrap: 'wrap'
                            }}>
                              {m.dateEcheance && (
                                <span>📅 Échéance : {formatDate(m.dateEcheance)}</span>
                              )}
                              {m.completedAt && (
                                <span>✅ Terminé : {formatDateTime(m.completedAt)}</span>
                              )}
                              <span>🕗 Créé : {formatDateTime(m.createdAt)}</span>
                            </div>
                          </div>
                          
                          <div>
                            <button 
                              onClick={() => openEditMilestone(m)} 
                              className="btn-secondary" 
                              style={{ padding: '0.2rem 0.5rem', marginRight: '0.5rem' }}
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteMilestone(m.id)} 
                              className="btn-secondary" 
                              style={{ padding: '0.2rem 0.5rem', color: '#ef4444' }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#6b7280' }}>Aucun jalon encore défini.</p>
                )}
              </div>
            </div>
          ) : (
            // === Form Mode ===
            <div className="form-container">
              <div className="form-card">
                <h2>{startup ? 'Modifier votre profil' : 'Créer votre profil startup'}</h2>
                <div className="form-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nom de la startup *</label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: GreenTech Solutions"
                      />
                    </div>
                    <div className="form-group">
                      <label>Secteur d'activité</label>
                      <input
                        type="text"
                        name="secteur"
                        value={formData.secteur}
                        onChange={handleInputChange}
                        placeholder="Ex: CleanTech, FinTech, EdTech"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Décrivez votre startup en quelques lignes..."
                    ></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tags (séparés par des virgules)</label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="IoT, Energie, Smart Building"
                      />
                    </div>
                    <div className="form-group">
                      <label>Site web</label>
                      <input
                        type="url"
                        name="siteWeb"
                        value={formData.siteWeb}
                        onChange={handleInputChange}
                        placeholder="https://votresite.com"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Date de création</label>
                    <input
                      type="date"
                      name="dateCreation"
                      value={formData.dateCreation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button onClick={handleSubmit} disabled={loading} className="btn-primary btn-large">
                      {loading ? 'Enregistrement...' : startup ? 'Enregistrer les modifications' : 'Créer mon profil'}
                    </button>
                    {startup && (
                      <button onClick={() => setMode('view')} className="btn-secondary btn-large">
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* === Modal Overlay === */}
        {renderModal()}
        
        {/* Hidden style for form-control (select) */}
        <style>{`
          .form-control {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-family: inherit;
            background-color: white;
            color: #111827;
          }
          .form-control:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          }
        `}</style>
      </div>
    </div>
  );
};

export default StartupProfile;