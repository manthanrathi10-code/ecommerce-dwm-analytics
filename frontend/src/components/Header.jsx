import React, { useState } from 'react';
import { Bell, Search, LogOut, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  const [searchVal, setSearchVal] = useState('');

  return (
    <header style={styles.header}>
      {/* Search pill */}
      <div style={styles.searchContainer}>
        <Search size={16} color="var(--text-muted)" style={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search metrics, products, dimensions..." 
          style={styles.searchInput}
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <span style={styles.searchKbd}>⌘K</span>
      </div>
      
      {/* Right Action Group */}
      <div style={styles.actions}>
        {/* Quick Insights pill */}
        <div style={styles.insightBadge}>
          <Sparkles size={14} color="var(--primary)" />
          <span style={styles.insightText}>DWM Engine Active</span>
        </div>

        {/* Notification Icon */}
        <button style={styles.iconBtn} title="Notifications">
          <Bell size={18} />
          <span style={styles.notificationDot}></span>
        </button>

        <div style={styles.divider}></div>

        {/* User Profile Pill */}
        <div style={styles.userProfilePill}>
          <div style={styles.avatar}>
            {(user?.username || 'U')[0].toUpperCase()}
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.username || 'Analytics User'}</span>
            <span style={styles.userRole}>
              <ShieldCheck size={11} color="var(--success)" style={{ marginRight: '3px' }} />
              Active Session
            </span>
          </div>
        </div>

        {/* Logout Pill Button */}
        <button 
          className="btn btn-outline" 
          style={styles.logoutBtn} 
          onClick={onLogout}
          title="Sign Out"
        >
          <LogOut size={14} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: '74px',
    backgroundColor: 'var(--bg-header)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 20
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-pill)',
    padding: '0.45rem 1rem',
    width: '380px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
    transition: 'border-color var(--transition-fast)'
  },
  searchIcon: {
    marginRight: '0.65rem',
    flexShrink: 0
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  searchKbd: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    backgroundColor: '#FAF9F6',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    padding: '0.15rem 0.4rem',
    flexShrink: 0
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem'
  },
  insightBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.85rem',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  },
  insightText: {
    letterSpacing: '-0.01em'
  },
  iconBtn: {
    color: 'var(--text-secondary)',
    position: 'relative',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)'
  },
  notificationDot: {
    position: 'absolute',
    top: '9px',
    right: '9px',
    width: '7px',
    height: '7px',
    backgroundColor: 'var(--primary)',
    borderRadius: '50%',
    border: '1.5px solid #FFFFFF'
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'var(--border-color)',
    margin: '0 0.2rem'
  },
  userProfilePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.3rem 0.85rem 0.3rem 0.35rem',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--dark-pill)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '700'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: 1.2
  },
  userRole: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center'
  },
  logoutBtn: {
    padding: '0.45rem 0.9rem',
    fontSize: '0.78rem',
    borderRadius: 'var(--radius-pill)',
    gap: '0.4rem',
    backgroundColor: '#FFFFFF',
    color: 'var(--text-secondary)'
  }
};

export default Header;
