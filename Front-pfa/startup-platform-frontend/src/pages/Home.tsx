// HomePage.tsx
import React from 'react';
import './Home.css';

const HomePage: React.FC = () => {
  const handleGetStarted = () => {
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">StartupIA</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transformez votre idée en 
              <span className="gradient-text"> pitch gagnant</span>
            </h1>
            <p className="hero-subtitle">
              La première plateforme marocaine qui utilise l'Intelligence Artificielle 
              pour générer des pitchs professionnels et connecter les start-ups avec les investisseurs.
            </p>
            <div className="hero-buttons">
              <button onClick={handleGetStarted} className="btn-primary">
                Commencer gratuitement
                <span className="btn-icon">→</span>
              </button>
              <button className="btn-secondary">
                <span className="play-icon">▶</span>
                Voir la démo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Start-ups</div>
              </div>
              <div className="stat">
                <div className="stat-number">200+</div>
                <div className="stat-label">Investisseurs</div>
              </div>
              <div className="stat">
                <div className="stat-number">85%</div>
                <div className="stat-label">Taux de matching</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">💡</div>
              <div className="card-text">Votre idée</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🤖</div>
              <div className="card-text">IA Gemini</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">📊</div>
              <div className="card-text">Pitch Pro</div>
            </div>
            <div className="floating-card card-4">
              <div className="card-icon">💰</div>
              <div className="card-text">Investisseurs</div>
            </div>
            <div className="center-glow"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2 className="section-title">Pourquoi choisir StartupIA ?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3 className="feature-title">Génération IA</h3>
            <p className="feature-description">
              Créez des pitchs professionnels en 2 minutes grâce à Google Gemini AI
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Matching Intelligent</h3>
            <p className="feature-description">
              Connectez-vous automatiquement avec les investisseurs compatibles à votre secteur
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Tableau de Bord</h3>
            <p className="feature-description">
              Suivez votre progression et optimisez votre profil avec des analytics détaillés
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3 className="feature-title">Networking</h3>
            <p className="feature-description">
              Établissez des connexions directes avec des business angels et VCs
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Prêt à lancer votre start-up ?</h2>
          <p className="cta-text">
            Rejoignez des centaines d'entrepreneurs marocains qui font déjà confiance à StartupIA
          </p>
          <button onClick={handleGetStarted} className="btn-cta">
            Créer mon profil maintenant
          </button>
        </div>
        <div className="cta-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">StartupIA</span>
          </div>
          <div className="footer-text">
            © 2024 StartupIA. Plateforme d'incubation pour start-ups marocaines.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;