import React, { useState } from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const FilterBar = ({ filters, onApply, onReset }) => {
  const [values, setValues] = useState({});

  const handleChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(values);
  };

  const handleReset = () => {
    setValues({});
    if (onReset) onReset();
  };

  return (
    <div className="card animate-fade-in" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.badge}>
          <Filter size={15} color="var(--primary)" />
          <span style={styles.badgeText}>Dataset Filter Criteria</span>
        </div>
      </div>
      
      <div style={styles.controlsRow}>
        {filters.map((filter) => (
          <div key={filter.key} className="input-group" style={{ flex: 1, minWidth: '180px' }}>
            <label className="input-label">{filter.label}</label>
            {filter.type === 'select' ? (
              <select 
                className="form-control"
                value={values[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
              >
                <option value="">All</option>
                {filter.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input 
                type={filter.type || 'text'}
                className="form-control"
                placeholder={filter.placeholder}
                value={values[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
              />
            )}
          </div>
        ))}
        
        <div style={styles.btnGroup}>
          <button className="btn btn-outline" onClick={handleReset} style={styles.btn}>
            <RotateCcw size={14} /> Reset
          </button>
          <button className="btn btn-primary" onClick={handleApply} style={styles.btn}>
            <Filter size={14} /> Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    marginBottom: '1.5rem',
    padding: '1.25rem 1.5rem'
  },
  header: {
    marginBottom: '0.85rem'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  badgeText: {
    color: 'var(--text-secondary)'
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  btnGroup: {
    display: 'flex',
    gap: '0.65rem',
    marginLeft: 'auto'
  },
  btn: {
    padding: '0.58rem 1.15rem'
  }
};

export default FilterBar;
