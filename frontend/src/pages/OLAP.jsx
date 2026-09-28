import React, { useState, useEffect } from 'react';
import { olapApi } from '../services/api';
import DataTable from '../components/DataTable';
import { LoadingState, ErrorState } from '../components/StateComponents';
import { 
  Layers, 
  Scissors, 
  Grid, 
  Rotate3d, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Filter, 
  RotateCcw,
  Sparkles,
  Database
} from 'lucide-react';

const OPERATIONS = [
  {
    id: 'slice',
    label: 'Slice',
    tag: '1D Filter',
    icon: Scissors,
    description: 'Selects a single sub-dimension slice across the data cube (e.g. Dimension = "Location", Value = "Mumbai").',
    defaultFilters: { dimension: 'Location', value: 'Mumbai' },
    quickSuggestions: [
      { dim: 'Location', val: 'Mumbai' },
      { dim: 'Location', val: 'Delhi' },
      { dim: 'Category', val: 'Electronics' },
      { dim: 'Category', val: 'Fashion' },
      { dim: 'Payment Method', val: 'UPI' }
    ]
  },
  {
    id: 'dice',
    label: 'Dice',
    tag: '2D Sub-Cube',
    icon: Grid,
    description: 'Defines a sub-cube by applying filtering predicates across two separate dimensions simultaneously.',
    defaultFilters: { dimension1: 'Location', value1: 'Mumbai', dimension2: 'Category', value2: 'Electronics' },
    quickSuggestions: [
      { d1: 'Location', v1: 'Mumbai', d2: 'Category', v2: 'Electronics' },
      { d1: 'Location', v1: 'Delhi', d2: 'Category', v2: 'Fashion' },
      { d1: 'Location', v1: 'Bengaluru', d2: 'Payment Method', v2: 'Credit Card' }
    ]
  },
  {
    id: 'pivot',
    label: 'Pivot',
    tag: 'Matrix Rotate',
    icon: Rotate3d,
    description: 'Rotates data cube axes to generate a cross-tabulated multi-dimensional matrix layout.',
    defaultFilters: { dimensions: 'Location, Time' },
    quickSuggestions: [
      { label: 'Location × Time', dims: 'Location, Time' },
      { label: 'Category × Time', dims: 'Category, Time' },
      { label: 'Location × Category', dims: 'Location, Category' }
    ]
  },
  {
    id: 'rollup',
    label: 'Roll-Up',
    tag: 'Aggregate Up',
    icon: ArrowUpCircle,
    description: 'Aggregates data upwards along hierarchical dimensions using SQL ROLLUP grouping sets.',
    defaultFilters: { dimension: 'location' },
    options: [
      { label: 'Location Hierarchy (State, City)', value: 'location' },
      { label: 'Product Hierarchy (Category, Product Name)', value: 'product' },
      { label: 'Time Hierarchy (Year, Month)', value: 'time' }
    ]
  },
  {
    id: 'drilldown',
    label: 'Drill-Down',
    tag: 'Decompose Down',
    icon: ArrowDownCircle,
    description: 'Navigates from higher-level summary data to lower-level detailed dimensions (Year → Quarter → Month).',
    defaultFilters: {}
  }
];

const OLAP = () => {
  const [activeOp, setActiveOp] = useState('slice');
  const [filterValues, setFilterValues] = useState(OPERATIONS[0].defaultFilters);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentOpConfig = OPERATIONS.find(op => op.id === activeOp) || OPERATIONS[0];

  const fetchData = async (filtersToApply) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (activeOp === 'slice') {
        res = await olapApi.slice(filtersToApply);
      } else if (activeOp === 'dice') {
        res = await olapApi.dice(filtersToApply);
      } else if (activeOp === 'pivot') {
        res = await olapApi.pivot(filtersToApply);
      } else if (activeOp === 'rollup') {
        res = await olapApi.rollup(filtersToApply);
      } else if (activeOp === 'drilldown') {
        res = await olapApi.drilldown();
      }

      if (!res.success) throw new Error(res.message || 'OLAP query execution failed');
      
      let actualData = res.data;
      if (actualData && typeof actualData === 'object' && !Array.isArray(actualData)) {
        const arrayKey = Object.keys(actualData).find(k => Array.isArray(actualData[k]));
        if (arrayKey) actualData = actualData[arrayKey];
      }

      setData(Array.isArray(actualData) ? actualData : []);
    } catch (err) {
      setError(err.message || 'An error occurred while evaluating the OLAP cube query.');
    } finally {
      setLoading(false);
    }
  };

  // Switch operations and reset to defaults
  const handleTabChange = (opId) => {
    setActiveOp(opId);
    const op = OPERATIONS.find(o => o.id === opId);
    const defaults = op?.defaultFilters || {};
    setFilterValues(defaults);
  };

  useEffect(() => {
    fetchData(filterValues);
  }, [activeOp]);

  const handleApply = () => {
    fetchData(filterValues);
  };

  const handleReset = () => {
    const defaults = currentOpConfig.defaultFilters || {};
    setFilterValues(defaults);
    fetchData(defaults);
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">OLAP Analytics</h1>
          <p className="page-subtitle">
            Explore multidimensional sales data across time, location, product and customer dimensions.
          </p>
        </div>

        <div className="header-action-pills">
          <div style={styles.cubeStatusPill}>
            <Layers size={15} color="var(--primary)" />
            <span>Multi-Dimensional Data Cube</span>
          </div>
        </div>
      </div>

      {/* Operation Switcher Tabs */}
      <div style={styles.tabsContainer}>
        {OPERATIONS.map((op) => {
          const Icon = op.icon;
          const isActive = activeOp === op.id;
          return (
            <button
              key={op.id}
              onClick={() => handleTabChange(op.id)}
              style={{
                ...styles.tabButton,
                ...(isActive ? styles.tabButtonActive : {})
              }}
            >
              <div style={{
                ...styles.tabIconBox,
                backgroundColor: isActive ? 'var(--primary)' : '#FAF9F6',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)'
              }}>
                <Icon size={16} />
              </div>
              <div style={styles.tabContent}>
                <div style={styles.tabLabelRow}>
                  <span style={styles.tabLabel}>{op.label}</span>
                  <span style={{
                    ...styles.tabTag,
                    backgroundColor: isActive ? 'rgba(124, 58, 237, 0.12)' : '#FAF9F6',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)'
                  }}>
                    {op.tag}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Control Panel Card */}
      <div className="card" style={styles.controlCard}>
        <div style={styles.controlHeader}>
          <div style={styles.controlTitleGroup}>
            <h2 style={styles.controlTitle}>{currentOpConfig.label} Operation Controls</h2>
            <p style={styles.controlDesc}>{currentOpConfig.description}</p>
          </div>
          <span className="badge badge-dark">
            Dimension Engine
          </span>
        </div>

        {/* Dynamic Controls based on Operation */}
        <div style={styles.inputsGrid}>
          {activeOp === 'slice' && (
            <>
              <div className="input-group" style={{ flex: 1, minWidth: '220px' }}>
                <label className="input-label">Dimension</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Location, Category, Time, Payment Method"
                  value={filterValues.dimension || ''}
                  onChange={(e) => setFilterValues(prev => ({ ...prev, dimension: e.target.value }))}
                />
              </div>

              <div className="input-group" style={{ flex: 1, minWidth: '220px' }}>
                <label className="input-label">Filter Value</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mumbai, Electronics, 2024, UPI"
                  value={filterValues.value || ''}
                  onChange={(e) => setFilterValues(prev => ({ ...prev, value: e.target.value }))}
                />
              </div>
            </>
          )}

          {activeOp === 'dice' && (
            <>
              <div className="input-group" style={{ flex: 1, minWidth: '180px' }}>
                <label className="input-label">Primary Dimension</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Location"
                  value={filterValues.dimension1 || ''}
                  onChange={(e) => setFilterValues(prev => ({ ...prev, dimension1: e.target.value }))}
                />
              </div>

              <div className="input-group" style={{ flex: 1, minWidth: '180px' }}>
                <label className="input-label">Value 1</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mumbai"
                  value={filterValues.value1 || ''}
                  onChange={(e) => setFilterValues(prev => ({ ...prev, value1: e.target.value }))}
                />
              </div>

              <div className="input-group" style={{ flex: 1, minWidth: '180px' }}>
                <label className="input-label">Secondary Dimension</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Category"
                  value={filterValues.dimension2 || ''}
                  onChange={(e) => setFilterValues(prev => ({ ...prev, dimension2: e.target.value }))}
                />
              </div>

              <div className="input-group" style={{ flex: 1, minWidth: '180px' }}>
                <label className="input-label">Value 2</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Electronics"
                  value={filterValues.value2 || ''}
                  onChange={(e) => setFilterValues(prev => ({ ...prev, value2: e.target.value }))}
                />
              </div>
            </>
          )}

          {activeOp === 'pivot' && (
            <div className="input-group" style={{ flex: 1, minWidth: '280px' }}>
              <label className="input-label">Dimensions (Comma Separated)</label>
              <input 
                type="text"
                className="form-control"
                placeholder="e.g. Location, Time"
                value={filterValues.dimensions || ''}
                onChange={(e) => setFilterValues(prev => ({ ...prev, dimensions: e.target.value }))}
              />
            </div>
          )}

          {activeOp === 'rollup' && (
            <div className="input-group" style={{ flex: 1, minWidth: '280px' }}>
              <label className="input-label">Hierarchy Dimension</label>
              <select 
                className="form-control"
                value={filterValues.dimension || 'location'}
                onChange={(e) => setFilterValues(prev => ({ ...prev, dimension: e.target.value }))}
              >
                {currentOpConfig.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {activeOp === 'drilldown' && (
            <div style={styles.drilldownNotice}>
              <Sparkles size={16} color="var(--primary)" />
              <span>
                Standard Temporal Drill-Down: Decomposing annual revenue across quarters and monthly cycles.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.controlButtons}>
            <button className="btn btn-outline" onClick={handleReset} style={styles.resetBtn}>
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
            <button className="btn btn-primary" onClick={handleApply} style={styles.applyBtn}>
              <Filter size={14} />
              <span>Execute Query</span>
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        {currentOpConfig.quickSuggestions && (
          <div style={styles.suggestionsRow}>
            <span style={styles.suggestionLabel}>Presets:</span>
            {activeOp === 'slice' && currentOpConfig.quickSuggestions.map((s, idx) => (
              <button 
                key={idx} 
                style={styles.suggestionPill}
                onClick={() => {
                  const newF = { dimension: s.dim, value: s.val };
                  setFilterValues(newF);
                  fetchData(newF);
                }}
              >
                {s.dim}: {s.val}
              </button>
            ))}

            {activeOp === 'dice' && currentOpConfig.quickSuggestions.map((s, idx) => (
              <button 
                key={idx} 
                style={styles.suggestionPill}
                onClick={() => {
                  const newF = { dimension1: s.d1, value1: s.v1, dimension2: s.d2, value2: s.v2 };
                  setFilterValues(newF);
                  fetchData(newF);
                }}
              >
                {s.v1} + {s.v2}
              </button>
            ))}

            {activeOp === 'pivot' && currentOpConfig.quickSuggestions.map((s, idx) => (
              <button 
                key={idx} 
                style={styles.suggestionPill}
                onClick={() => {
                  const newF = { dimensions: s.dims };
                  setFilterValues(newF);
                  fetchData(newF);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div style={styles.resultsMetaRow}>
        <div style={styles.resultsCountBox}>
          <span style={styles.resultsCountLabel}>Query Results:</span>
          <span className="badge badge-primary">{data.length} records returned</span>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <LoadingState message="Executing multi-dimensional OLAP query against Supabase..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchData(filterValues)} />
      ) : (
        <DataTable 
          data={data}
          columns={data.length > 0 ? Object.keys(data[0]).map(k => ({
            header: k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' '),
            accessor: k,
            render: (k.includes('revenue') || k.includes('spend') || k.includes('profit') || k.includes('sales') || !isNaN(Number(k))) 
              ? (row) => {
                  const val = row[k];
                  if (typeof val === 'number') {
                    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
                  }
                  return val;
                }
              : undefined
          })) : []}
        />
      )}
    </div>
  );
};

const styles = {
  cubeStatusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.45rem 1rem',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  },
  tabsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.85rem',
    marginBottom: '1.5rem'
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.9rem 1rem',
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    textAlign: 'left',
    transition: 'all var(--transition-fast)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
  },
  tabButtonActive: {
    borderColor: 'var(--primary)',
    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.12)',
    backgroundColor: '#FAF7FF'
  },
  tabIconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  tabContent: {
    flex: 1
  },
  tabLabelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.35rem'
  },
  tabLabel: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  tabTag: {
    fontSize: '0.68rem',
    fontWeight: '700',
    padding: '0.15rem 0.45rem',
    borderRadius: 'var(--radius-pill)'
  },
  controlCard: {
    marginBottom: '1.5rem'
  },
  controlHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  controlTitleGroup: {
    maxWidth: '700px'
  },
  controlTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.2rem'
  },
  controlDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  },
  inputsGrid: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  drilldownNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#FAF9F6',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    flex: 1
  },
  controlButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    marginLeft: 'auto'
  },
  resetBtn: {
    padding: '0.6rem 1rem'
  },
  applyBtn: {
    padding: '0.6rem 1.25rem'
  },
  suggestionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '1.25rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-color)',
    flexWrap: 'wrap'
  },
  suggestionLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  suggestionPill: {
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.25rem 0.65rem',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: '#FAF9F6',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    transition: 'all var(--transition-fast)'
  },
  resultsMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.85rem',
    padding: '0 0.25rem'
  },
  resultsCountBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  resultsCountLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  }
};

export default OLAP;
