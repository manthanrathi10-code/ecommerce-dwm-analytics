import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCcw } from 'lucide-react';

export const LoadingState = ({ message = 'Loading analytics intelligence...' }) => (
  <div style={styles.container}>
    <div style={styles.spinnerPill}>
      <Loader2 size={24} className="animate-spin text-primary" />
    </div>
    <h3 style={styles.title}>{message}</h3>
    <p style={styles.subtitle}>Connecting to Supabase PostgreSQL Data Warehouse</p>
  </div>
);

export const ErrorState = ({ message = 'Unable to complete analytics request.', onRetry }) => (
  <div style={{ ...styles.container, backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}>
    <div style={styles.errorIconBox}>
      <AlertCircle size={26} color="var(--danger)" />
    </div>
    <h3 style={{ ...styles.title, color: '#991B1B' }}>Request Failed</h3>
    <p style={{ ...styles.message, color: '#B91C1C' }}>{message}</p>
    {onRetry && (
      <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={onRetry}>
        <RefreshCcw size={14} /> Try Again
      </button>
    )}
  </div>
);

export const EmptyState = ({ 
  title = 'No Records Found', 
  message = 'No data was returned for this multidimensional query. Try adjusting your parameters.',
  actionLabel,
  onAction
}) => (
  <div style={styles.container}>
    <div style={styles.emptyIconBox}>
      <Inbox size={26} color="var(--text-muted)" />
    </div>
    <h3 style={styles.title}>{title}</h3>
    <p style={styles.message}>{message}</p>
    {actionLabel && onAction && (
      <button className="btn btn-outline" style={{ marginTop: '1.25rem' }} onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3.5rem 2rem',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-card)',
    minHeight: '320px'
  },
  spinnerPill: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem'
  },
  errorIconBox: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: '#FEE2E2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem'
  },
  emptyIconBox: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: '#FAF9F6',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem'
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: '700',
    marginBottom: '0.35rem',
    color: 'var(--text-primary)',
    letterSpacing: '-0.015em'
  },
  subtitle: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)'
  },
  message: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    maxWidth: '460px',
    lineHeight: 1.5
  }
};
