// src/components/investor/InvestorProfile.tsx
import React, { useState, useEffect } from 'react';
import './profile-investor.css';
import { Link, useLocation } from 'react-router-dom';

// ===== Interfaces =====
interface InvestorData {
  id: string;
  userId: string;
  nom: string;
  type: 'INDIVIDUAL' | 'ANGEL' | 'VC' | 'CORPORATE' | 'OTHER';
  secteursInterets: string; // comma-separated string like "FinTech,EdTech"
  montantMin: number | null;
  montantMax: number | null;
  description: string;
  localisation: string;
  portfolio: string;
  siteWeb: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Sidebar Component =====
const Sidebar = ({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean; setIsMobileOpen: (open: boolean) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/investor/dashboard' },
    { id: 'profil', label: 'Profil Investisseur', icon: '👤', path: '/investor/profile' },
    { id: 'startups', label: 'Startups', icon: '🏢', path: '/investor/startups' },
    { id: 'analytics', label: 'Calendrier', icon: '📅', path: '/investor-calendar' },
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

// ===== Main Component =====
const InvestorProfile = () => {
  const [investor, setInvestor] = useState<InvestorData | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    type: 'INDIVIDUAL' as InvestorData['type'],
    secteursInterets: '',
    montantMin: '',
    montantMax: '',
    description: '',
    localisation: '',
    portfolio: '',
    siteWeb: '',
    email: '',
  });
  const [mode, setMode] = useState<'loading' | 'view' | 'form'>('loading');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getAuthToken = () => localStorage.getItem('accessToken');

  // Sync formData when investor loads (for edit mode)
  useEffect(() => {
    if (investor) {
      setFormData({
        nom: investor.nom || '',
        type: investor.type || 'INDIVIDUAL',
        secteursInterets: investor.secteursInterets || '',
        montantMin: investor.montantMin !== null ? String(investor.montantMin) : '',
        montantMax: investor.montantMax !== null ? String(investor.montantMax) : '',
        description: investor.description || '',
        localisation: investor.localisation || '',
        portfolio: investor.portfolio || '',
        siteWeb: investor.siteWeb || '',
        email: investor.email || '',
      });
    }
  }, [investor]);

  // Fetch investor profile on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      if (!token) {
        setError('Non authentifié.');
        setMode('form'); // fallback to form (though redirect would be better)
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/investors/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setInvestor(data);
          setMode('view');
        } else if (res.status === 400) {
          // No profile → show creation form
          setMode('form');
          setError(null);
        } else {
          const err = await res.text();
          setError(`Erreur: ${err}`);
        }
      } catch (err: any) {
        console.error(err);
        setError('Erreur lors du chargement du profil.');
        setMode('form');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      setError('Non authentifié.');
      return;
    }

    if (!formData.nom.trim()) {
      setError('Le nom est requis.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      montantMin: formData.montantMin ? parseFloat(formData.montantMin) : null,
      montantMax: formData.montantMax ? parseFloat(formData.montantMax) : null,
    };

    try {
      const url = investor ? 'http://localhost:8080/api/investors/me' : 'http://localhost:8080/api/investors';
      const method = investor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setInvestor(data);
        setMode('view');
        setSuccess(investor ? 'Profil mis à jour avec succès !' : 'Profil créé avec succès !');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Échec de l’opération');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur inconnue est survenue.');
    } finally {
      setLoading(false);
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

  return (
    <div className="dashboard">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setIsMobileOpen(true)}>☰</button>
            <div className="header-title">
              <h1>Profil Investisseur</h1>
              <p>Gérez vos préférences et informations</p>
            </div>
          </div>
          <div className="header-right">
            <button className="icon-btn">🔍</button>
            <button className="icon-btn notification-btn">
              🔔
              <span className="notification-badge"></span>
            </button>
            <div className="user-avatar">IH</div>
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

          {mode === 'view' && investor ? (
            <div className="profile-view">
              <div className="profile-header-card">
                <div className="profile-header-content">
                  <div className="profile-info">
                    <div className="company-avatar">{investor.nom.charAt(0)}</div>
                    <div className="company-details">
                      <h2>{investor.nom}</h2>
                      <p className="company-sector">
                        {investor.type === 'INDIVIDUAL' ? 'Investisseur Individuel' :
                         investor.type === 'ANGEL' ? 'Business Angel' :
                         investor.type === 'VC' ? 'Fonds de Capital-Risque' :
                         investor.type === 'CORPORATE' ? 'Investisseur Corporate' : 'Autre'}
                      </p>
                      <div className="company-meta">
                        <span>📍</span>
                        <span>{investor.localisation || 'Non précisé'}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      // formData is already synced via useEffect, so just switch mode
                      setMode('form');
                    }}
                  >
                    Modifier
                  </button>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-card">
                  <h3>Informations Générales</h3>
                  <div className="form-group">
                    <label>Nom</label>
                    <input type="text" value={investor.nom} disabled className="input-disabled" />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <input
                      type="text"
                      value={
                        investor.type === 'INDIVIDUAL' ? 'Individuel' :
                        investor.type === 'ANGEL' ? 'Business Angel' :
                        investor.type === 'VC' ? 'Capital-Risque' :
                        investor.type === 'CORPORATE' ? 'Corporate' : 'Autre'
                      }
                      disabled
                      className="input-disabled"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="text" value={investor.email || 'Non fourni'} disabled className="input-disabled" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={investor.description || 'Aucune description'} disabled className="input-disabled" rows={3}></textarea>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Préférences d'Investissement</h3>
                  <div className="form-group">
                    <label>Secteurs d’intérêt</label>
                    {investor.secteursInterets ? (
                      <div className="tags-container">
                        {investor.secteursInterets.split(',').map((tag, i) => (
                          <span key={i} className="tag">{tag.trim()}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="input-disabled">Non spécifié</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Montant minimum</label>
                    <input
                      type="text"
                      value={investor.montantMin !== null ? `${investor.montantMin} €` : 'Non précisé'}
                      disabled
                      className="input-disabled"
                    />
                  </div>
                  <div className="form-group">
                    <label>Montant maximum</label>
                    <input
                      type="text"
                      value={investor.montantMax !== null ? `${investor.montantMax} €` : 'Non précisé'}
                      disabled
                      className="input-disabled"
                    />
                  </div>
                  <div className="form-group">
                    <label>Portfolio (liens ou startups)</label>
                    {investor.portfolio ? (
                      <textarea value={investor.portfolio} disabled className="input-disabled" rows={3}></textarea>
                    ) : (
                      <p className="input-disabled">Aucun portfolio</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>🌐 Site web</label>
                    {investor.siteWeb ? (
                      <a href={investor.siteWeb} target="_blank" rel="noreferrer" className="link-input">
                        {investor.siteWeb}
                      </a>
                    ) : (
                      <p className="input-disabled">Non fourni</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="form-container">
              <div className="form-card">
                <h2>
                  {investor ? 'Modifier votre profil investisseur' : 'Créer votre profil investisseur'}
                </h2>
                <form onSubmit={handleSubmit} className="form-content">
                  <div className="form-group">
                    <label>Nom *</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>

                  <div className="form-group">
                    <label>Type d’investisseur *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      <option value="INDIVIDUAL">Individuel</option>
                      <option value="ANGEL">Business Angel</option>
                      <option value="VC">Fonds de Capital-Risque (VC)</option>
                      <option value="CORPORATE">Investisseur Corporate</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jean.dupont@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Décrivez votre expérience ou vos motivations..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Secteurs d’intérêt (séparés par des virgules)</label>
                    <input
                      type="text"
                      name="secteursInterets"
                      value={formData.secteursInterets}
                      onChange={handleInputChange}
                      placeholder="FinTech, CleanTech, HealthTech"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Montant minimum (€)</label>
                      <input
                        type="number"
                        name="montantMin"
                        value={formData.montantMin}
                        onChange={handleInputChange}
                        placeholder="50000"
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Montant maximum (€)</label>
                      <input
                        type="number"
                        name="montantMax"
                        value={formData.montantMax}
                        onChange={handleInputChange}
                        placeholder="2000000"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Portfolio (ex: liste de startups ou liens)</label>
                    <textarea
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="StartupA, StartupB, https://example.com"
                    ></textarea>
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

                  <div className="form-group">
                    <label>Localisation</label>
                    <input
                      type="text"
                      name="localisation"
                      value={formData.localisation}
                      onChange={handleInputChange}
                      placeholder="Paris, France"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-primary btn-large">
                      {loading
                        ? 'Enregistrement...'
                        : investor
                        ? 'Enregistrer les modifications'
                        : 'Créer mon profil'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (investor) {
                          setMode('view');
                        } else {
                          // If creating and cancel → maybe go back or stay
                          // For now, reset form and stay
                          setFormData({
                            nom: '',
                            type: 'INDIVIDUAL',
                            secteursInterets: '',
                            montantMin: '',
                            montantMax: '',
                            description: '',
                            localisation: '',
                            portfolio: '',
                            siteWeb: '',
                            email: '',
                          });
                        }
                      }}
                      className="btn-secondary btn-large"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InvestorProfile;