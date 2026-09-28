import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const KPI = ({ 
  title, 
  value, 
  prefix = '', 
  suffix = '', 
  contextText, 
  icon: Icon, 
  theme = 'light', // 'light' or 'dark'
  color = 'var(--primary)',
  accentBadge
}) => {
  // Format numbers with Indian notation (e.g., Lakhs, Crores, K)
  const formatValue = (val) => {
    if (typeof val !== 'number') return val;
    // For large currency numbers >= 1 Crore (10 Million)
    if (val >= 10000000) {
      const cr = val / 10000000;
      return `${cr.toFixed(2)} Cr`;
    }
    // For numbers >= 1 Lakh (100k)
    if (val >= 100000) {
      const lakh = val / 100000;
      return `${lakh.toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(val);
  };

  const formattedValue = typeof value === 'number' ? formatValue(value) : value;

  if (theme === 'dark') {
    return (
      <div className="animate-fade-in" style={styles.darkCard}>
        {/* Subtle decorative purple wave gradient background */}
        <div style={styles.darkGlow}></div>
        <div style={styles.darkWave}></div>

        <div style={styles.darkHeader}>
          <div style={styles.darkIconBadge}>
            {Icon && <Icon size={18} color="#FFFFFF" />}
          </div>
          <span style={styles.darkTitle}>{title}</span>
          {accentBadge && (
            <span style={styles.darkBadge}>{accentBadge}</span>
          )}
        </div>

        <div style={styles.darkBody}>
          <div style={styles.valueRow}>
            <span style={styles.darkPrefix}>{prefix}</span>
            <span style={styles.darkValue}>{formattedValue}</span>
            {suffix && <span style={styles.darkSuffix}>{suffix}</span>}
          </div>
          {contextText && (
            <div style={styles.darkContextPill}>
              <ArrowUpRight size={12} color="#A78BFA" />
              <span>{contextText}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in" style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.headerLeft}>
          <div style={{ ...styles.iconBox, backgroundColor: `${color}14`, color: color }}>
            {Icon && <Icon size={18} />}
          </div>
          <span style={styles.title}>{title}</span>
        </div>
        {accentBadge && (
          <span style={styles.lightBadge}>{accentBadge}</span>
        )}
      </div>

      <div style={styles.body}>
        <div style={styles.valueRow}>
          {prefix && <span style={styles.prefix}>{prefix}</span>}
          <span style={styles.value}>{formattedValue}</span>
          {suffix && <span style={styles.suffix}>{suffix}</span>}
        </div>
        {contextText && (
          <div style={styles.contextText}>
            <span style={styles.contextDot}></span>
            <span>{contextText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  // Dark Signature Card (inspired by reference image)
  darkCard: {
    backgroundColor: '#121217',
    borderRadius: 'var(--radius-xl)',
    padding: '1.6rem',
    position: 'relative',
    overflow: 'hidden',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '175px',
    boxShadow: '0 8px 30px rgba(18, 18, 23, 0.16)'
  },
  darkGlow: {
    position: 'absolute',
    top: '-40px',
    right: '-40px',
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(18, 18, 23, 0) 70%)',
    pointerEvents: 'none'
  },
  darkWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65px',
    background: 'linear-gradient(180deg, rgba(124, 58, 237, 0) 0%, rgba(124, 58, 237, 0.22) 100%)',
    borderBottomLeftRadius: 'var(--radius-xl)',
    borderBottomRightRadius: 'var(--radius-xl)',
    pointerEvents: 'none'
  },
  darkHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.6rem',
    zIndex: 2
  },
  darkIconBadge: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  darkTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#D4D4D8',
    letterSpacing: '-0.01em',
    marginRight: 'auto',
    marginLeft: '0.25rem'
  },
  darkBadge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '0.2rem 0.55rem',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: '#E4E4E7'
  },
  darkBody: {
    zIndex: 2,
    marginTop: '1.25rem'
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.15rem'
  },
  darkPrefix: {
    fontSize: '1.35rem',
    fontWeight: '600',
    color: '#A78BFA'
  },
  darkValue: {
    fontSize: '2.15rem',
    fontWeight: '800',
    letterSpacing: '-0.035em',
    color: '#FFFFFF',
    lineHeight: 1
  },
  darkSuffix: {
    fontSize: '0.9rem',
    color: '#A1A1AA',
    marginLeft: '0.2rem'
  },
  darkContextPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.75rem',
    color: '#E4E4E7',
    marginTop: '0.75rem',
    padding: '0.2rem 0.6rem',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },

  // Light Card
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '175px'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  iconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    letterSpacing: '-0.01em'
  },
  lightBadge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '0.2rem 0.55rem',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: '#FAF9F6',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)'
  },
  body: {
    marginTop: 'auto'
  },
  prefix: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  },
  value: {
    fontSize: '2rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
    lineHeight: 1.1
  },
  suffix: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginLeft: '0.2rem'
  },
  contextText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
    marginTop: '0.65rem'
  },
  contextDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: 'var(--text-muted)'
  }
};

export default KPI;
