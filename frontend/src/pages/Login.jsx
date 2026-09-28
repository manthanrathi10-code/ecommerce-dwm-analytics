import React, { useState } from 'react';
import { User, Lock, LogIn, Sparkles, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username.trim() && password.trim()) {
      onLogin({ username: username.trim() });
    } else {
      setError('Please enter your username and password');
    }
  };

  return (
    <div style={styles.container}>
      <div className="card animate-fade-in" style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <Sparkles size={22} color="#FFFFFF" />
          </div>
        </div>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <div style={styles.inputWrapper}>
              <User size={16} color="var(--text-muted)" style={styles.inputIcon} />
              <input
                type="text"
                className="form-control"
                style={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (e.g. admin)"
                required
              />
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '0.85rem' }}>
            <label className="input-label">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} color="var(--text-muted)" style={styles.inputIcon} />
              <input
                type="password"
                className="form-control"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
            <LogIn size={16} /> Sign In
          </button>
        </form>
        
        <div style={styles.demoInfo}>
          <div style={styles.demoTitle}>
            <ShieldCheck size={14} color="var(--primary)" />
            <span>Platform Credentials</span>
          </div>
          <div style={styles.demoRow}>
            <span style={styles.demoLabel}>Demo Access:</span>
            <code style={styles.demoCode}>admin / admin</code>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-app)',
    padding: '2rem'
  },
  loginCard: {
    width: '100%',
    maxWidth: '430px',
    padding: '2.5rem',
    borderRadius: 'var(--radius-2xl)',
    boxShadow: 'var(--shadow-dropdown)',
    border: '1px solid var(--border-color)',
    backgroundColor: '#FFFFFF'
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.75rem'
  },
  logoBadge: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    backgroundColor: 'var(--dark-pill)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    boxShadow: '0 6px 16px rgba(24, 24, 27, 0.18)'
  },
  errorBox: {
    padding: '0.65rem 1rem',
    borderRadius: '12px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#DC2626',
    fontSize: '0.82rem',
    fontWeight: '500',
    marginBottom: '1.25rem',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  input: {
    paddingLeft: '38px',
    width: '100%',
    paddingTop: '0.65rem',
    paddingBottom: '0.65rem'
  },
  submitBtn: {
    marginTop: '1.5rem',
    padding: '0.75rem 1.25rem',
    fontSize: '0.9rem',
    gap: '0.5rem'
  },
  demoInfo: {
    marginTop: '1.75rem',
    padding: '1rem',
    backgroundColor: '#FAF9F6',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    fontSize: '0.8rem'
  },
  demoTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem'
  },
  demoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.35rem'
  },
  demoLabel: {
    color: 'var(--text-muted)'
  },
  demoCode: {
    fontFamily: 'monospace',
    backgroundColor: '#FFFFFF',
    padding: '0.15rem 0.45rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    fontWeight: '600',
    color: 'var(--text-primary)'
  }
};

export default Login;
