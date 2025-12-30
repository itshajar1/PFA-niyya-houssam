// src/pages/PitchPage.tsx
import React, { useState, useEffect } from 'react';
import './pitchAI.css';
import { Link, useLocation } from 'react-router-dom';

interface PitchRequest {
  probleme: string;
  solution: string;
  cible: string;
  avantage: string;
}

interface Pitch {
  id: string;
  probleme: string;
  solution: string;
  cible: string;
  avantage: string;
  pitchGenere: string;
  type: 'ELEVATOR' | 'DECK' | 'VALUE_PROP';
  rating: number | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PitchStats {
  totalPitchs: number;
  favoritePitchs: number;
  averageRating: number;
}

const Sidebar = ({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean; setIsMobileOpen: (open: boolean) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'profil', label: 'Profil Startup', icon: '🏢', path: '/profile' },
    { id: 'generateur', label: 'Générateur IA', icon: '💡', path: '/generateur' },
    { id: 'investisseurs', label: 'Investisseurs', icon: '📈', path: '/investisseurs' },
    { id: 'analytics', label: 'Calendrier', icon: '📅', path: '/calendar'},
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
              <div className="logo-icon">🚀</div>
              <div className="logo-text">
                <h1>StartupHub</h1>
                <p>AI Platform</p>
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

const PitchPage: React.FC = () => {
  const [pitchRequest, setPitchRequest] = useState<PitchRequest>({
    probleme: '',
    solution: '',
    cible: '',
    avantage: ''
  });

  const [generatedPitch, setGeneratedPitch] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pitchs, setPitchs] = useState<Pitch[]>([]);
  const [stats, setStats] = useState<PitchStats>({
    totalPitchs: 0,
    favoritePitchs: 0,
    averageRating: 0
  });

  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');

  const getAuthToken = () => localStorage.getItem('accessToken');

  useEffect(() => {
    fetchPitchData();
  }, []);

  const fetchPitchData = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Non authentifié.');
      setLoading(false);
      return;
    }

    try {
      const statsRes = await fetch('http://localhost:8080/api/pitchs/me/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      const pitchsRes = await fetch('http://localhost:8080/api/pitchs/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pitchsData = await pitchsRes.json();
      setPitchs(pitchsData);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur lors du chargement des pitchs.');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPitchRequest(prev => ({ ...prev, [name]: value }));
  };
const [pitchType, setPitchType] = useState<'ELEVATOR' | 'DECK' | 'VALUE_PROP'>('ELEVATOR');

const handleGeneratePitch = async () => {
  const token = getAuthToken();
  if (!token) {
    setError('Non authentifié.');
    return;
  }

  if (!pitchRequest.probleme.trim() || !pitchRequest.solution.trim()) {
    setError('Le problème et la solution sont requis.');
    return;
  }

  setIsGenerating(true);
  setError(null);
  setSuccess(null);

  // ✅ Choisis l'endpoint selon le type
  let endpoint = '/api/ai/generate-elevator'; // par défaut
  if (pitchType === 'DECK') {
    endpoint = '/api/ai/generate-deck';
  } else if (pitchType === 'VALUE_PROP') {
    endpoint = '/api/ai/generate-value-prop'; // 👈 à créer ! (voir ci-dessous)
  }

  try {
    const res = await fetch(`http://localhost:8080${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(pitchRequest) // ⚠️ toujours sans "type"
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Échec de la génération');
    }

    const response = await res.json();
    
    // ✅ Mets à jour avec le pitch généré
    setGeneratedPitch(response.pitch);
    setSuccess('Pitch généré avec succès !');
    
    // ✅ Optionnel : sauvegarde automatique via /api/pitchs si besoin
    await fetchPitchData(); // recharge l'historique
  } catch (err: any) {
    setError(err.message || 'Erreur lors de la génération.');
  } finally {
    setIsGenerating(false);
  }
};

  const toggleFavorite = async (pitchId: string) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await fetch(`http://localhost:8080/api/pitchs/${pitchId}/favorite`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchPitchData();
    } catch (err: any) {
      setError('Échec du favori.');
    }
  };

  const ratePitch = async (pitchId: string, rating: number) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await fetch(`http://localhost:8080/api/pitchs/${pitchId}/rate?rating=${rating}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchPitchData();
    } catch (err: any) {
      setError('Échec de la notation.');
    }
  };

  const openDetailModal = (pitch: Pitch) => {
    setSelectedPitch(pitch);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="pitch-page">
        <div className="main-content">
          <div className="loading-screen">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p>Chargement de vos pitchs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pitch-page">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="main-content">
        <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="hero-section">
          <div className="hero-content">
           
            <h1 className="hero-title">Générateur de Pitch IA</h1>
            <p className="hero-subtitle">Transformez votre idée en pitch percutant en quelques secondes</p>
          </div>
          
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">📊</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalPitchs}</div>
                <div className="stat-label">Pitchs générés</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">⭐</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.favoritePitchs}</div>
                <div className="stat-label">Favoris</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">🎯</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                </div>
                <div className="stat-label">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>

        {success && (
          <div className="toast toast-success">
            <span className="toast-icon">✓</span>
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="toast toast-error">
            <span className="toast-icon">✕</span>
            <span>{error}</span>
          </div>
        )}

        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            <span className="tab-icon">✨</span>
            Créer un Pitch
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="tab-icon">📚</span>
            Mes Pitchs ({pitchs.length})
          </button>
        </div>

        <main className="content-area">
          {activeTab === 'generate' ? (
            <div className="generator-container">
              <div className="generator-grid">
                <div className="form-section">
                  <div className="section-title">
                    <h2>📝 Décrivez votre startup</h2>
                    <p>Remplissez les champs pour générer votre pitch</p>
                  </div>
<div className="input-wrapper">
  <label className="input-label">
    <span className="label-icon">🎯</span>
    Type de pitch
  </label>
  
  <div className="pitch-type-pills">
    {[
      { value: 'ELEVATOR', label: 'Elevator', icon: '🎤', desc: '(30s)' },
      { value: 'DECK', label: 'Deck', icon: '📊', desc: '(Présentation)' },
      { value: 'VALUE_PROP', label: 'Proposition', icon: '💎', desc: 'de valeur' }
    ].map((option) => (
      <button
        key={option.value}
        type="button"
        className={`pitch-type-pill ${pitchType === option.value ? 'active' : ''}`}
        onClick={() => setPitchType(option.value as any)}
      >
        <span className="pill-icon">{option.icon}</span>
        <span className="pill-text">
          {option.label} <span className="pill-desc">{option.desc}</span>
        </span>
      </button>
    ))}
  </div>
</div>
                  <div className="form-fields">
                    <div className="input-wrapper">
                      <label className="input-label">
                        <span className="label-icon">❓</span>
                        Quel problème résolvez-vous ?
                        <span className="required">*</span>
                      </label>
                      <textarea
                        name="probleme"
                        value={pitchRequest.probleme}
                        onChange={handleInputChange}
                        placeholder="Ex: Les entrepreneurs perdent du temps à rédiger leurs pitchs..."
                        className="input-field"
                        rows={3}
                      />
                    </div>

                    <div className="input-wrapper">
                      <label className="input-label">
                        <span className="label-icon">💡</span>
                        Quelle est votre solution ?
                        <span className="required">*</span>
                      </label>
                      <textarea
                        name="solution"
                        value={pitchRequest.solution}
                        onChange={handleInputChange}
                        placeholder="Ex: Une plateforme IA qui génère des pitchs professionnels..."
                        className="input-field"
                        rows={3}
                      />
                    </div>

                    <div className="input-wrapper">
                      <label className="input-label">
                        <span className="label-icon">🎯</span>
                        Qui sont vos clients cibles ?
                      </label>
                      <textarea
                        name="cible"
                        value={pitchRequest.cible}
                        onChange={handleInputChange}
                        placeholder="Ex: Startups marocaines en phase d'amorçage..."
                        className="input-field"
                        rows={2}
                      />
                    </div>

                    <div className="input-wrapper">
                      <label className="input-label">
                        <span className="label-icon">⚡</span>
                        Quel est votre avantage concurrentiel ?
                      </label>
                      <textarea
                        name="avantage"
                        value={pitchRequest.avantage}
                        onChange={handleInputChange}
                        placeholder="Ex: Génération automatique en moins de 2 minutes..."
                        className="input-field"
                        rows={2}
                      />
                    </div>

                    <button
                      className="generate-btn"
                      onClick={handleGeneratePitch}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <span className="btn-spinner"></span>
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">🚀</span>
                          Générer mon Pitch IA
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {generatedPitch && (
                  <div className="result-section">
                    <div className="result-header">
                      <h3>✨ Votre Pitch Généré</h3>
                      <button 
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPitch);
                          setSuccess('Pitch copié dans le presse-papier !');
                        }}
                      >
                        📋 Copier
                      </button>
                    </div>
                    <div className="result-content">
                      <p>{generatedPitch}</p>
                    </div>
                    <button
                      className="view-details-btn"
                      onClick={() => {
                        if (pitchs.length > 0) {
                          openDetailModal(pitchs[0]);
                        }
                      }}
                    >
                      Voir les détails complets
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="history-container">
              {pitchs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>Aucun pitch généré</h3>
                  <p>Créez votre premier pitch pour commencer votre collection</p>
                  <button 
                    className="empty-action-btn"
                    onClick={() => setActiveTab('generate')}
                  >
                    Créer mon premier pitch
                  </button>
                </div>
              ) : (
                <div className="pitchs-masonry">
                  {pitchs.map(pitch => (
                    <div key={pitch.id} className="pitch-item">
                      <div className="pitch-item-header">
                        <span className="pitch-type-badge">
                          {pitch.type === 'ELEVATOR' ? '🎤 Elevator' : pitch.type}
                        </span>
                        <button
                          className={`fav-btn ${pitch.isFavorite ? 'active' : ''}`}
                          onClick={() => toggleFavorite(pitch.id)}
                        >
                          {pitch.isFavorite ? '★' : '☆'}
                        </button>
                      </div>

                      <div className="pitch-item-content">
                        <p>{pitch.pitchGenere.substring(0, 180)}...</p>
                      </div>

                      <div className="pitch-item-footer">
                        <div className="pitch-date">
                          📅 {new Date(pitch.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="pitch-rating-stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              className={`rating-star ${star <= (pitch.rating || 0) ? 'filled' : ''}`}
                              onClick={() => ratePitch(pitch.id, star)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        className="pitch-view-btn"
                        onClick={() => openDetailModal(pitch)}
                      >
                        Voir le pitch complet →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {showDetailModal && selectedPitch && (
          <div className="modal-backdrop" onClick={() => setShowDetailModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setShowDetailModal(false)}>
                ✕
              </button>
              
              <div className="modal-header-section">
                <h2>Détails du Pitch</h2>
                <span className="modal-type-badge">
                  {selectedPitch.type === 'ELEVATOR' ? '🎤 Elevator Pitch' : selectedPitch.type}
                </span>
              </div>

              <div className="modal-body-section">
                <div className="modal-pitch-text">
                  <h3>💬 Pitch Généré</h3>
                  <p>{selectedPitch.pitchGenere}</p>
                </div>

                <div className="modal-details-grid">
                  <div className="detail-card">
                    <h4>❓ Problème</h4>
                    <p>{selectedPitch.probleme}</p>
                  </div>
                  <div className="detail-card">
                    <h4>💡 Solution</h4>
                    <p>{selectedPitch.solution}</p>
                  </div>
                  <div className="detail-card">
                    <h4>🎯 Cible</h4>
                    <p>{selectedPitch.cible}</p>
                  </div>
                  <div className="detail-card">
                    <h4>⚡ Avantage</h4>
                    <p>{selectedPitch.avantage}</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer-section">
                <button 
                  className="modal-btn modal-btn-secondary" 
                  onClick={() => setShowDetailModal(false)}
                >
                  Fermer
                </button>
                <button 
                  className="modal-btn modal-btn-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPitch.pitchGenere);
                    setSuccess('Pitch copié !');
                  }}
                >
                  📋 Copier le pitch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchPage;