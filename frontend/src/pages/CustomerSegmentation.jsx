import React, { useState, useEffect, useMemo } from 'react';
import { miningApi } from '../services/api';
import { LoadingState, ErrorState } from '../components/StateComponents';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import { Network, Users, PieChart as PieIcon, Layers } from 'lucide-react';

const CustomerSegmentation = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const loadData = async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await miningApi.getClusters(currentFilters);
      if (!res.success) throw new Error(res.message || 'Failed to fetch cluster segmentation');
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'An error occurred while running customer segmentation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(filters);
  }, [filters]);

  const summaryData = useMemo(() => {
    if (!data.length) return [];
    const clusters = {};
    data.forEach(item => {
      const c = item.cluster;
      if (!clusters[c]) clusters[c] = { cluster: c, count: 0, total_spent: 0, order_count: 0 };
      clusters[c].count += 1;
      clusters[c].total_spent += item.total_spent;
      clusters[c].order_count += item.order_count;
    });
    
    return Object.values(clusters).map(c => ({
      cluster_id: `Cluster ${c.cluster}`,
      count: c.count,
      avg_spent: c.total_spent / c.count,
      avg_orders: (c.order_count / c.count).toFixed(1),
      characteristics: `Avg Spend: ${formatCurrency(c.total_spent / c.count)} • ${(c.order_count / c.count).toFixed(1)} Orders`
    }));
  }, [data]);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Customer Segmentation</h1>
          <p className="page-subtitle">Unsupervised K-Means clustering across customer spending patterns and order velocity.</p>
        </div>

        <div className="header-action-pills">
          <span className="badge badge-primary">
            <Network size={13} /> K-Means Model
          </span>
          <span className="badge badge-dark">
            {summaryData.length} Active Cohorts
          </span>
        </div>
      </div>

      <FilterBar 
        filters={[
          { key: 'n_clusters', label: 'Cluster Count (k)', type: 'select', options: [{label: '2 Cohorts', value: '2'}, {label: '3 Cohorts', value: '3'}, {label: '4 Cohorts', value: '4'}, {label: '5 Cohorts', value: '5'}] }
        ]}
        onApply={setFilters} 
        onReset={() => setFilters({})} 
      />

      {loading ? (
        <LoadingState message="Calculating customer centroids and distance metrics..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadData(filters)} />
      ) : (
        <>
          <div className="card" style={{ marginBottom: '1.75rem' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Cluster Profile Synthesis</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Aggregated centroids and behavioral attributes per cohort
                </p>
              </div>
              <span className="badge badge-primary">Cohort Centroids</span>
            </div>
            <DataTable 
              columns={[
                { 
                  header: 'Cluster Cohort', 
                  accessor: 'cluster_id',
                  render: (row) => (
                    <span className="badge badge-primary" style={{ fontWeight: '700' }}>
                      {row.cluster_id}
                    </span>
                  )
                },
                { 
                  header: 'Customer Count', 
                  accessor: 'count',
                  render: (row) => (
                    <span style={{ fontWeight: '700' }}>
                      {row.count} customers ({((row.count / (data.length || 1)) * 100).toFixed(1)}%)
                    </span>
                  )
                },
                { header: 'Average Spent', accessor: 'avg_spent', render: (row) => formatCurrency(row.avg_spent) },
                { header: 'Average Orders', accessor: 'avg_orders' },
                { header: 'Summary Profile', accessor: 'characteristics' }
              ]} 
              data={summaryData} 
            />
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Customer-Level Cluster Assignments</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Granular cluster classification per customer ID
                </p>
              </div>
              <span className="badge badge-dark">{data.length} Customers</span>
            </div>
            <DataTable 
              columns={[
                { header: 'Customer ID', accessor: 'customer_id' },
                { header: 'Total Spent', accessor: 'total_spent', render: (row) => formatCurrency(row.total_spent) },
                { header: 'Order Count', accessor: 'order_count' },
                { 
                  header: 'Assigned Cluster', 
                  accessor: 'cluster',
                  render: (row) => (
                    <span className="badge badge-primary">
                      Cluster {row.cluster}
                    </span>
                  )
                }
              ]} 
              data={data} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerSegmentation;
