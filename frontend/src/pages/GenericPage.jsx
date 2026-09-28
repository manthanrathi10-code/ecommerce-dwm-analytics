import React, { useState, useEffect } from 'react';
import { LoadingState, ErrorState, EmptyState } from '../components/StateComponents';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import { Database, FileText } from 'lucide-react';

const GenericPage = ({ title, subtitle, fetchApi, columns, filterConfig = [] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  const loadData = async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi(currentFilters);
      if (!res.success) throw new Error(res.message || 'Failed to fetch data');
      
      // Handle different response shapes where data might be an object containing an array
      let actualData = res.data;
      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
        // Find the first array property
        const arrayKey = Object.keys(res.data).find(key => Array.isArray(res.data[key]));
        if (arrayKey) actualData = res.data[arrayKey];
      }
      
      setData(Array.isArray(actualData) ? actualData : []);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(filters);
  }, [filters, fetchApi]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>

        <div className="header-action-pills">
          <span className="badge badge-primary">
            {data.length} {data.length === 1 ? 'Record' : 'Records'}
          </span>
          <div style={styles.sourcePill}>
            <Database size={13} color="var(--text-muted)" />
            <span>Warehouse Star Schema</span>
          </div>
        </div>
      </div>

      {filterConfig.length > 0 && (
        <FilterBar 
          filters={filterConfig} 
          onApply={handleApplyFilters} 
          onReset={() => setFilters({})} 
        />
      )}

      {loading ? (
        <LoadingState message={`Fetching ${title.toLowerCase()} records...`} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadData(filters)} />
      ) : (
        <DataTable 
          columns={columns && columns.length > 0 ? columns : (data.length > 0 ? Object.keys(data[0]).map(k => ({ 
            header: k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' '), 
            accessor: k,
            render: (k.includes('revenue') || k.includes('spend') || k.includes('profit') || k.includes('sales') || k.includes('price')) 
              ? (row) => {
                  const val = row[k];
                  if (typeof val === 'number') {
                    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
                  }
                  return val;
                }
              : undefined
          })) : [])} 
          data={data} 
        />
      )}
    </div>
  );
};

const styles = {
  sourcePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.35rem 0.85rem',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  }
};

export default GenericPage;
