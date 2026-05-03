import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import showToast from '../../../utils/showToast';
import './RegisterAndLogin.css';

const RegisterAndLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/admin/login');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(location.pathname === '/admin/login');
  }, [location.pathname]);

  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Validate register form
  const validateRegisterForm = () => {
    if (!registerEmail || !registerPassword || !registerConfirmPassword) {
      showToast('All fields are required', 'warning');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)) {
      showToast('Please enter a valid email address', 'warning');
      return false;
    }

    if (registerPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return false;
    }

    if (registerPassword !== registerConfirmPassword) {
      showToast('Passwords do not match', 'warning');
      return false;
    }

    return true;
  };

  // Validate login form
  const validateLoginForm = () => {
    if (!loginEmail || !loginPassword) {
      showToast('Email and password are required', 'warning');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      showToast('Please enter a valid email address', 'warning');
      return false;
    }

    return true;
  };

  // Handle register submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/admin/register', {
        email: registerEmail,
        password: registerPassword,
      });

      showToast('Registration successful! Redirecting to login...', 'success');
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Reset form and switch to login
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setTimeout(() => setIsLogin(true), 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Registration failed. Please try again.';
      showToast(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/admin/login', {
        email: loginEmail,
        password: loginPassword,
      });

      showToast('Login successful!', 'success');
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Reset form and redirect
      setLoginEmail('');
      setLoginPassword('');
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      showToast(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Toggle Buttons */}
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => navigate('/admin/login')}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => navigate('/admin/register')}
          >
            Register
          </button>
        </div>

        {/* Forms Container */}
        <div className="auth-forms-container">
          {/* Login Form */}
          {isLogin && (
            <div className="auth-form-wrapper fade-in">
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Sign in to your admin account</p>

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <p className="auth-footer">
                Don't have an account?{' '}
                <button
                  className="toggle-link"
                  onClick={() => navigate('/admin/register')}
                >
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* Register Form */}
          {!isLogin && (
            <div className="auth-form-wrapper fade-in">
              <h2 className="auth-title">Create Admin Account</h2>
              <p className="auth-subtitle">Sign up to get started</p>

              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="register-email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    name="password"
                    className="form-control"
                    placeholder="Enter password (min 6 characters)"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-confirm-password" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="register-confirm-password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p className="auth-footer">
                Already have an account?{' '}
                <button
                  className="toggle-link"
                  onClick={() => navigate('/admin/login')}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterAndLogin;
