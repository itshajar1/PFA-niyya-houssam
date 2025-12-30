// src/pages/InvestorsPage.tsx
import React, { useState, useEffect } from 'react';
import './InvestorsPage.css';
import { Link, useLocation } from 'react-router-dom';

// ===== MatchingInvestor Interface (aligned with backend) ====
interface MatchingInvestor {
  investorId: string;
  nom?: string;
  type: 'VC' | 'BUSINESS_ANGEL' | 'INCUBATOR' | 'CORPORATE_VC';
  secteursInterets: string[]; // now always an array
  montantMin: number | null;
  montantMax: number | null;
  description: string;
  localisation: string;
  portfolio: string;
  siteWeb: string;
  email: string;
  matchScore: number;
}
interface MatchingApiResponse {
  matchId: string;
  investor: InvestorData;
  score: number;
  criteria: {
    secteurMatch: boolean;
    montantCompatible: boolean;
    localisationMatch: boolean;
    details: string;
  };
  isViewed: boolean;
}
interface InvestorData {
  id: string;
  userId: string;
  nom: string;
  type: 'VC' | 'BUSINESS_ANGEL' | 'INCUBATOR' | 'CORPORATE_VC';
  secteursInterets: string; // comma-separated string
  montantMin: number;
  montantMax: number;
  description: string;
  localisation: string;
  portfolio: string;
  siteWeb: string;
  email: string;
  createdAt: string;
}
// ===== Sidebar Component ====
const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
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

// ===== Main Component ====
const InvestorsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('investisseurs');
 const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investors, setInvestors] = useState<MatchingInvestor[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<MatchingInvestor[]>([]);

  // Filters
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<MatchingInvestor | null>(null);
  const [connectionMessage, setConnectionMessage] = useState('');

  const getAuthToken = () => localStorage.getItem('accessToken');

  // Fetch matching investors
  useEffect(() => {
    const fetchInvestors = async () => {
      const token = getAuthToken();
      if (!token) {
        setError('Non authentifié.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/matching/for-me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Échec du chargement');
        }
       const data: MatchingApiResponse[] = await res.json();

         const parsedInvestors = data.map(inv => ({
      ...inv,
      investorId: inv.investor.id,
      nom: inv.investor.nom,
      type: inv.investor.type,
      secteursInterets: inv.investor.secteursInterets
        ? inv.investor.secteursInterets
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0)
        : [],
      montantMin: inv.investor.montantMin,
      montantMax: inv.investor.montantMax,
      description: inv.investor.description,
      localisation: inv.investor.localisation,
      portfolio: inv.investor.portfolio,
      siteWeb: inv.investor.siteWeb,
      email: inv.investor.email,
      matchScore: inv.score
    }));
        setInvestors(parsedInvestors);
    setFilteredInvestors(parsedInvestors);
    setLoading(false);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Erreur réseau');
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = investors;

    if (selectedSector !== 'all') {
      result = result.filter(inv =>
        Array.isArray(inv.secteursInterets) &&
        inv.secteursInterets.includes(selectedSector)
      );
    }

    if (selectedType !== 'all') {
      result = result.filter(inv => inv.type === selectedType);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        inv =>
          (inv.nom && inv.nom.toLowerCase().includes(q)) ||
          inv.description.toLowerCase().includes(q)
      );
    }

    setFilteredInvestors(result);
  }, [selectedSector, selectedType, searchQuery, investors]);

  // Handle connection
  const handleConnectionRequest = (investor: MatchingInvestor) => {
    setSelectedInvestor(investor);
    setShowConnectionModal(true);
  };

  const sendConnectionRequest = async () => {
    const token = getAuthToken();
    if (!token || !selectedInvestor) return;

    try {
      const response = await fetch('http://localhost:8080/api/connections/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          investorId: selectedInvestor.investorId,
          message: connectionMessage.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert(`Demande envoyée à ${selectedInvestor.nom || 'cet investisseur'} !`);
      setShowConnectionModal(false);
      setConnectionMessage('');
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  // Helpers
  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      VC: 'Venture Capital',
      BUSINESS_ANGEL: 'Business Angel',
      INCUBATOR: 'Incubateur',
      CORPORATE_VC: 'Corporate VC',
    };
    return labels[type] || type;
  };

  const formatAmount = (amount: number | null): string => {
    if (amount == null) return 'Non précisé';
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMatchScoreColor = (score: number): string => {
    if (score >= 85) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  };

  // === Render ===
  if (loading) {
    return (
      <div className="investors-page-container">
               <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
        <div className="main-content">
          <div className="loading-screen">
            <div className="loading-content">
              <div className="spinner"></div>
              <p>Chargement des investisseurs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="investors-page-container">
        <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Header */}
      <header className="investors-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Trouvez Vos Investisseurs</h1>
            <p className="page-subtitle">
              {investors.length} investisseurs compatibles avec votre profil
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-number">{filteredInvestors.length}</div>
                <div className="stat-label">Matchs trouvés</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✉️</div>
              <div className="stat-info">
                <div className="stat-number">3</div>
                <div className="stat-label">Demandes envoyées</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filtres */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un investisseur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Secteur</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les secteurs</option>
              <option value="FinTech">FinTech</option>
              <option value="EdTech">EdTech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="E-commerce">E-commerce</option>
              <option value="AgriTech">AgriTech</option>
              <option value="CleanTech">CleanTech</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les types</option>
              <option value="VC">Venture Capital</option>
              <option value="BUSINESS_ANGEL">Business Angel</option>
              <option value="INCUBATOR">Incubateur</option>
              <option value="CORPORATE_VC">Corporate VC</option>
            </select>
          </div>
        </div>
      </section>
        {/* Investors List */}
        <section className="investors-list">
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">✕</span>
              <span>{error}</span>
            </div>
          )}

          <div className="investors-grid">
            {filteredInvestors.map((investor) => (
              <div key={investor.investorId} className="investor-card">
                <div className="investor-header">
                  <div className="investor-avatar">
                    <span className="avatar-placeholder">
                      {investor.nom?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="investor-info">
                    <h3 className="investor-name">{investor.nom || 'Nom inconnu'}</h3>
                    <span className="investor-type">{getTypeLabel(investor.type)}</span>
                  </div>
                  <div className={`match-score ${getMatchScoreColor(investor.matchScore)}`}>
                    <span className="score-label">Match</span>
                    <span className="score-value">{investor.matchScore}%</span>
                  </div>
                </div>

                <div className="investor-body">
                  <p className="investor-description">{investor.description}</p>

                  <div className="investor-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{investor.localisation}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span className="detail-text">
                        {formatAmount(investor.montantMin)} – {formatAmount(investor.montantMax)}
                      </span>
                    </div>
                  </div>

                  <div className="investor-sectors">
                    {(Array.isArray(investor.secteursInterets)
                      ? investor.secteursInterets
                      : []
                    ).map((secteur, idx) => (
                      <span key={idx} className="sector-tag">{secteur}</span>
                    ))}
                  </div>

                  <div className="investor-portfolio">
                    <strong>Portfolio:</strong> {investor.portfolio}
                  </div>
                </div>

                <div className="investor-footer">
                  {investor.siteWeb && investor.siteWeb.trim() && (
                    <a
                      href={investor.siteWeb.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary-inv"
                    >
                      Voir le site
                    </a>
                  )}
                  <button
                    onClick={() => handleConnectionRequest(investor)}
                    className="btn-primary-inv"
                  >
                    Demander une connexion
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredInvestors.length === 0 && !error && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>Aucun investisseur trouvé</h3>
              <p>Essayez de modifier vos filtres de recherche</p>
            </div>
          )}
        </section>

        {/* Connection Modal */}
        {showConnectionModal && selectedInvestor && (
          <div className="modal-overlay" onClick={() => setShowConnectionModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Demande de Connexion</h2>
                <button className="modal-close" onClick={() => setShowConnectionModal(false)}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-investor-info">
                  <div className="modal-avatar">
                    {selectedInvestor.nom?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3>{selectedInvestor.nom || 'Investisseur inconnu'}</h3>
                    <p>{getTypeLabel(selectedInvestor.type)}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message personnalisé</label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Présentez votre projet et expliquez pourquoi vous souhaitez vous connecter..."
                    value={connectionMessage}
                    onChange={(e) => setConnectionMessage(e.target.value)}
                    className="message-textarea"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowConnectionModal(false)}>
                  Annuler
                </button>
                <button
                  className="btn-send"
                  onClick={sendConnectionRequest}
                  disabled={!connectionMessage.trim()}
                >
                  Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
   
  );
};
export default InvestorsPage;