import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Rocket } from 'lucide-react';
import './Login.css';
import authService from '../api/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  // Validation basique
  if (!formData.email || !formData.password) {
    setError('Veuillez remplir tous les champs');
    setIsLoading(false);
    return;
  }

  try {
    const data = await authService.login({
      email: formData.email,
      password: formData.password
    });

    console.log('Connexion réussie:', data);

    // Stocker l'utilisateur et le token dans localStorage
    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('user', JSON.stringify({
      userId: data.userId,
      email: data.email,
      role: data.role
    }));

    // Rediriger selon le rôle
    if (data.role === 'STARTUP') {
      window.location.href = '/dashboard';
    } else if (data.role === 'INVESTOR') {
      window.location.href = '/investor-dashboard';
    } else {
      window.location.href = '/admin';
    }

  } catch (err: any) {
    console.log(err); // pour debug
    setError(err || 'Email ou mot de passe incorrect');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="login-container">
      {/* Left Side - Branding */}
      <div className="login-left">
        <div className="branding">
          <div className="logo">
            <Rocket className="logo-icon" />
            <h1>StartupHub</h1>
          </div>
          <p className="tagline">
            Transformez votre vision entrepreneuriale en réalité avec l'IA
          </p>
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <div>
                <h3>Pitchs IA</h3>
                <p>Générez des pitchs professionnels en quelques secondes</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <div>
                <h3>Matching Investisseurs</h3>
                <p>Connectez-vous avec les bons investisseurs</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div>
                <h3>Tableau de Bord</h3>
                <p>Suivez votre progression en temps réel</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="form-header">
            <h2>Bienvenue !</h2>
            <p>Connectez-vous pour accéder à votre espace</p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="login-form">
            <div className="form-group">
              <label htmlFor="email">Adresse Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="exemple@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de Passe</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Se souvenir de moi</span>
              </label>
              <a href="/forgot-password" className="forgot-password">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="button"
              className="submit-btn"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Se Connecter'
              )}
            </button>
          </div>

          <div className="form-footer">
            <p>
              Vous n'avez pas de compte ?{' '}
              <a href="/register">Créer un compte</a>
            </p>
          </div>

          <div className="divider">
            <span>OU</span>
          </div>

          <div className="social-login">
            <button className="social-btn google">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;