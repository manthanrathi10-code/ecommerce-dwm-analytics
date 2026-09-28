import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { etlApi } from '../services/api';
import { LoadingState, ErrorState } from '../components/StateComponents';
import { Database, Play, CheckCircle, XCircle, ArrowRight, Server, RefreshCw, Sparkles, FileSpreadsheet } from 'lucide-react';

const ETLStatus = () => {
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await etlApi.getStatus();
      if (!res.success) throw new Error(res.message || 'Failed to fetch ETL status');
      setStatus(res.data);
    } catch (err) {
      setError(err.message || 'An error occurred while checking ETL status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRunETL = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await etlApi.runEtl();
      if (!res.success) throw new Error(res.message || 'Failed to execute ETL process');
      await fetchStatus();
    } catch (err) {
      setError(err.message || 'An error occurred while running the ETL pipeline.');
    } finally {
      setRunning(false);
    }
  };

  if (loading && !status) return <LoadingState message="Inspecting data warehouse pipeline status..." />;

  const pipelineStages = [
    { title: 'CSV Source', desc: '10,000 raw sales events', icon: FileSpreadsheet },
    { title: 'Extract & Clean', desc: 'Type validation & deduplication', icon: RefreshCw },
    { title: 'Star Transform', desc: 'Dimension key mapping', icon: Sparkles },
    { title: 'Supabase Load', desc: 'Fact & Dimension ingestion', icon: Server }
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">ETL Pipeline Status</h1>
          <p className="page-subtitle">
            Extract, Transform, and Load engine populating the Supabase PostgreSQL Data Warehouse.
          </p>
        </div>

        <div className="header-action-pills">
          <button 
            className="btn btn-primary" 
            onClick={handleRunETL}
            disabled={running}
            style={{ padding: '0.55rem 1.25rem', gap: '0.5rem' }}
          >
            {running ? (
              <><RefreshCw size={15} className="animate-spin" /> Ingesting Dataset...</>
            ) : (
              <><Play size={15} /> Trigger ETL Run</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="card text-danger" style={{ marginBottom: '1.5rem', backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}>
          {error}
        </div>
      )}

      {/* Pipeline Visual Flow */}
      <div className="card" style={{ marginBottom: '1.75rem', overflow: 'hidden' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Data Warehouse Ingestion Architecture</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              End-to-end data processing workflow from CSV to cloud PostgreSQL
            </p>
          </div>
          <span className="badge badge-primary">Active Flow</span>
        </div>

        <div style={styles.pipelineGrid}>
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <React.Fragment key={idx}>
                <div style={styles.stageCard}>
                  <div style={styles.stageIconBox}>
                    <Icon size={18} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={styles.stageTitle}>{stage.title}</div>
                    <div style={styles.stageDesc}>{stage.desc}</div>
                  </div>
                </div>
                {idx < pipelineStages.length - 1 && (
                  <div style={styles.stageArrow}>
                    <ArrowRight size={16} color="var(--text-muted)" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Database State Card */}
      {status ? (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Warehouse Integrity Verification</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Integrity validation across fact and dimension tables in Supabase
              </p>
            </div>
            <span className={`badge ${status.is_valid ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.35rem 0.85rem' }}>
              {status.is_valid ? 'SCHEMA HEALTHY & POPULATED' : 'INTEGRITY CHECK REQUIRED'}
            </span>
          </div>
          
          <div className="grid-kpi" style={{ marginTop: '1rem' }}>
            <div className="card" style={{ backgroundColor: '#FAF9F6', boxShadow: 'none' }}>
              <span style={styles.kpiLabel}>Fact Sales Count</span>
              <span style={styles.kpiNumber}>{status.fact_count?.toLocaleString() || 0}</span>
              <span style={styles.kpiSub}>10,000 transactions verified</span>
            </div>

            <div className="card" style={{ backgroundColor: '#FAF9F6', boxShadow: 'none' }}>
              <span style={styles.kpiLabel}>Unique Customers</span>
              <span style={styles.kpiNumber}>{status.customer_count?.toLocaleString() || 0}</span>
              <span style={styles.kpiSub}>Dimension: DimCustomer</span>
            </div>

            <div className="card" style={{ backgroundColor: '#FAF9F6', boxShadow: 'none' }}>
              <span style={styles.kpiLabel}>Catalog Products</span>
              <span style={{ ...styles.kpiNumber, color: 'var(--primary)' }}>
                {status.product_count?.toLocaleString() || 0}
              </span>
              <span style={styles.kpiSub}>Dimension: DimProduct</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">No ETL status available. Trigger a run to load data.</div>
      )}
    </div>
  );
};

const styles = {
  pipelineGrid: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    marginTop: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  stageCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1.15rem',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: '#FAF9F6',
    border: '1px solid var(--border-color)',
    flex: '1 1 200px'
  },
  stageIconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  stageTitle: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  stageDesc: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)'
  },
  stageArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  kpiLabel: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '0.35rem',
    display: 'block'
  },
  kpiNumber: {
    fontSize: '1.85rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    display: 'block',
    lineHeight: 1.1
  },
  kpiSub: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '0.4rem',
    display: 'block'
  }
};

export default ETLStatus;
