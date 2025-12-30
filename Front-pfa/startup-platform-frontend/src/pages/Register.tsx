import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Rocket, User, CheckCircle } from 'lucide-react';
import './Register.css';
import authService from '../api/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STARTUP'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');

    // Calculer la force du mot de passe
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthLabel = () => {
    const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    return labels[passwordStrength];
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#059669'];
    return colors[passwordStrength];
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer un email valide');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      try {
  const data = await authService.register({
    email: formData.email,
    password: formData.password,
    role: formData.role
  });

  console.log('Inscription réussie:', data);

  // Redirect to login
  window.location.href = '/login';

} catch (err: any) {
  setError(err || "Erreur lors de l'inscription");
}

    } catch (err) {
      setError('Erreur de connexion au serveur. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Left Side - Branding */}
      <div className="register-left">
        <div className="branding">
          <div className="logo">
            <Rocket className="logo-icon" />
            <h1>StartupHub</h1>
          </div>
          <p className="tagline">
            Rejoignez l'écosystème entrepreneurial marocain
          </p>
          
          <div className="benefits">
            <h3>Pourquoi nous rejoindre ?</h3>
            <div className="benefit-list">
              <div className="benefit-item">
                <CheckCircle className="check-icon" />
                <span>Génération de pitchs professionnels avec l'IA</span>
              </div>
              <div className="benefit-item">
                <CheckCircle className="check-icon" />
                <span>Matching intelligent avec des investisseurs</span>
              </div>
              <div className="benefit-item">
                <CheckCircle className="check-icon" />
                <span>Suivi de votre progression en temps réel</span>
              </div>
              <div className="benefit-item">
                <CheckCircle className="check-icon" />
                <span>Connexion avec l'écosystème startup</span>
              </div>
              <div className="benefit-item">
                <CheckCircle className="check-icon" />
                <span>Outils de gestion d'équipe et milestones</span>
              </div>
            </div>
          </div>

          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Start-ups inscrites</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Investisseurs actifs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2000+</div>
              <div className="stat-label">Pitchs générés</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="register-right">
        <div className="register-form-container">
          <div className="form-header">
            <h2>Créer un compte</h2>
            <p>Commencez votre aventure entrepreneuriale</p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="register-form">
            {/* Role Selection */}
            <div className="role-selection">
              <label>Je suis :</label>
              <div className="role-buttons">
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'STARTUP' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'STARTUP' })}
                >
                  <Rocket size={20} />
                  <div>
                    <div className="role-title">Start-up</div>
                    <div className="role-desc">Je cherche des investisseurs</div>
                  </div>
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'INVESTOR' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'INVESTOR' })}
                >
                  <User size={20} />
                  <div>
                    <div className="role-title">Investisseur</div>
                    <div className="role-desc">Je recherche des opportunités</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ 
                        width: `${(passwordStrength / 4) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <span 
                    className="strength-label"
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    {getPasswordStrengthLabel()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le Mot de Passe</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="terms-checkbox">
              <input type="checkbox" required />
              <span>
                J'accepte les <a href="/terms">conditions d'utilisation</a> et la{' '}
                <a href="/privacy">politique de confidentialité</a>
              </span>
            </label>

            <button
              type="button"
              className="submit-btn"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </div>

          <div className="form-footer">
            <p>
              Vous avez déjà un compte ?{' '}
              <a href="/login">Se connecter</a>
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
              S'inscrire avec Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;