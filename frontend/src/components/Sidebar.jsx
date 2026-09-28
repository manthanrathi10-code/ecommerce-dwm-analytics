import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  Users, 
  MapPin, 
  Network, 
  Activity, 
  Target, 
  TrendingDown,
  LineChart,
  Layers,
  Database,
  FileText,
  Sparkles,
  Server
} from 'lucide-react';

const Sidebar = () => {
  const navSections = [
    {
      title: null,
      items: [
        { label: 'Executive Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { label: 'Sales Analytics', path: '/analytics/sales', icon: <TrendingUp size={18} /> },
        { label: 'Product Analytics', path: '/analytics/products', icon: <Package size={18} /> },
        { label: 'Customer Analytics', path: '/analytics/customers', icon: <Users size={18} /> },
        { label: 'Location Analytics', path: '/analytics/locations', icon: <MapPin size={18} /> },
      ]
    },
    {
      title: 'DATA MINING',
      items: [
        { label: 'Customer Segmentation', path: '/mining/segmentation', icon: <Network size={18} /> },
        { label: 'Association Rules', path: '/mining/association', icon: <Activity size={18} /> },
        { label: 'Classification', path: '/mining/classification', icon: <Target size={18} /> },
        { label: 'Sales Prediction', path: '/mining/prediction', icon: <TrendingDown size={18} /> },
        { label: 'Attribute Relevance', path: '/mining/relevance', icon: <LineChart size={18} /> },
      ]
    },
    {
      title: 'ADVANCED DWM',
      items: [
        { label: 'OLAP Operations', path: '/olap', icon: <Layers size={18} />, badge: 'Cube' },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'ETL Pipeline', path: '/system/etl', icon: <Database size={18} /> },
        { label: 'Reports', path: '/system/reports', icon: <FileText size={18} /> },
      ]
    }
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.logoContainer}>
        <div style={styles.logoBadge}>
          <Sparkles size={18} color="#FFFFFF" />
        </div>
      </div>
      
      {/* Nav List */}
      <nav style={styles.nav}>
        {navSections.map((section, sIdx) => (
          <div key={sIdx} style={styles.sectionGroup}>
            {section.title && (
              <div style={styles.sectionHeader}>
                {section.title}
              </div>
            )}
            {section.items.map((item, iIdx) => (
              <NavLink 
                key={iIdx} 
                to={item.path} 
                end={item.path === '/'}
                style={({ isActive }) => ({
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {})
                })}
              >
                {({ isActive }) => (
                  <>
                    <span style={{
                      ...styles.iconWrapper,
                      color: isActive ? 'var(--primary)' : 'var(--text-muted)'
                    }}>
                      {item.icon}
                    </span>
                    <span style={styles.navLabel}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        ...styles.navBadge,
                        backgroundColor: isActive ? 'var(--primary)' : '#FAF9F6',
                        color: isActive ? '#FFFFFF' : 'var(--text-secondary)'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer System Status */}
      <div style={styles.footer}>
        <div style={styles.statusPill}>
          <div style={styles.statusDot}></div>
          <Server size={14} color="var(--text-muted)" />
          <span style={styles.statusText}>Supabase Connected</span>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '270px',
    backgroundColor: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    userSelect: 'none'
  },
  logoContainer: {
    padding: '1.25rem 1.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 10
  },
  logoBadge: {
    backgroundColor: 'var(--dark-pill)',
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(24, 24, 27, 0.15)'
  },
  nav: {
    padding: '1.25rem 0.9rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    flex: 1
  },
  sectionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  sectionHeader: {
    fontSize: '0.68rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    fontWeight: '700',
    paddingLeft: '0.85rem',
    paddingBottom: '0.35rem'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.62rem 0.85rem',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontSize: '0.86rem',
    fontWeight: '500',
    transition: 'all var(--transition-fast)',
    textDecoration: 'none'
  },
  navItemActive: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    fontWeight: '600'
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color var(--transition-fast)'
  },
  navLabel: {
    flex: 1
  },
  navBadge: {
    fontSize: '0.68rem',
    fontWeight: '700',
    padding: '0.15rem 0.45rem',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--border-color)'
  },
  footer: {
    padding: '1.2rem 1.4rem',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: '#FFFFFF'
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.45rem 0.75rem',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: '#FAF9F6',
    border: '1px solid var(--border-color)'
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: 'var(--success)'
  },
  statusText: {
    fontSize: '0.72rem',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  }
};

export default Sidebar;
