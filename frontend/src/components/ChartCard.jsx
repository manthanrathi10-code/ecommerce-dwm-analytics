import React from 'react';
import { ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, subtitle, action, children, minHeight = '320px' }) => {
  return (
    <div className="card animate-fade-in" style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>{title}</h3>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div style={styles.action}>{action}</div>}
      </div>
      <div style={{ ...styles.chartWrapper, minHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
    gap: '1rem'
  },
  title: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '-0.015em'
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '0.15rem'
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  chartWrapper: {
    flex: 1,
    width: '100%'
  }
};

export default ChartCard;
