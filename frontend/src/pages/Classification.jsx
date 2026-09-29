import React, { useState, useEffect } from 'react';
import { miningApi } from '../services/api';
import { LoadingState, ErrorState } from '../components/StateComponents';
import KPI from '../components/KPI';
import ChartCard from '../components/ChartCard';
import { Target, CheckCircle, Percent, AlertCircle, Cpu, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#121217',
        color: '#FFFFFF',
        padding: '0.65rem 0.95rem',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase' }}>
          {payload[0].payload.name}
        </div>
        <div style={{ fontSize: '0.92rem', fontWeight: '700', marginTop: '0.2rem' }}>
          Weight: {(payload[0].value * 100).toFixed(2)}%
        </div>
      </div>
    );
  }
  return null;
};

const Classification = () => {
  const [algorithm, setAlgorithm] = useState('random_forest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await miningApi.getClassification({ algorithm });
      if (!res.success) throw new Error(res.message || 'Failed to fetch classification metrics');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'An error occurred while evaluating classification model.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [algorithm]);

  if (loading) return <LoadingState message="Training and evaluating classification model..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!data) return null;

  // Prepare feature importance data (Top 10 most influential features)
  const featureData = data.feature_names?.map((name, idx) => ({
    name: name.replace(/_/g, ' '),
    importance: data.feature_importances[idx]
  })).sort((a, b) => b.importance - a.importance).slice(0, 10);

  const accuracyPct = (data.accuracy * 100).toFixed(1);
  const precisionPct = (data.precision * 100).toFixed(1);
  const recallPct = (data.recall * 100).toFixed(1);
  const f1Pct = (data.f1_score * 100).toFixed(1);
  const cvPct = data.cv_score ? (data.cv_score * 100).toFixed(1) : null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Customer Churn Classification</h1>
          <p className="page-subtitle">
            Supervised machine learning evaluation and feature weighting for predictive retention.
          </p>
        </div>

        <div className="header-action-pills">
          <select 
            className="badge badge-neutral" 
            style={{ backgroundColor: '#F3F4F6', color: '#374151', border: 'none', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={loading}
          >
            <option value="random_forest">Random Forest</option>
            <option value="decision_tree">Decision Tree</option>
            <option value="logistic_regression">Logistic Regression</option>
            <option value="knn">KNN</option>
            <option value="svm">SVM</option>
            <option value="naive_bayes">Naive Bayes</option>
          </select>
          <span className="badge badge-primary">
            <Cpu size={13} /> {data.model_name || "Classifier"}
          </span>
          {cvPct && (
            <span className="badge badge-neutral" style={{ backgroundColor: '#F3F4F6', color: '#374151' }}>
              <Percent size={13} /> {cvPct}% 5-Fold CV
            </span>
          )}
          <span className="badge badge-success">
            <Award size={13} /> {accuracyPct}% Accuracy
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid-kpi">
        <KPI 
          title="Overall Accuracy" 
          value={`${accuracyPct}%`} 
          icon={Target}
          color="var(--primary)"
          accentBadge="Top Metric"
          contextText="Correct Classifications"
        />
        <KPI 
          title="Precision" 
          value={`${precisionPct}%`} 
          icon={CheckCircle}
          color="var(--success)"
          accentBadge="True Positives"
          contextText="Positive Predictive Value"
        />
        <KPI 
          title="Recall Rate" 
          value={`${recallPct}%`} 
          icon={AlertCircle}
          color="var(--warning)"
          accentBadge="Sensitivity"
          contextText="Identified Churners"
        />
        <KPI 
          title="F1 Score" 
          value={`${f1Pct}%`} 
          icon={Percent}
          color="#3B82F6"
          accentBadge="Harmonic Mean"
          contextText="Precision & Recall Balance"
        />
      </div>

      {/* Charts & Confusion Matrix */}
      <div className="grid-charts">
        {/* Confusion Matrix Card */}
        <div className="col-5">
          <div className="card animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Confusion Matrix</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Observed vs. predicted outcomes
                </p>
              </div>
              <span className="card-badge">Binary</span>
            </div>

            <div className="table-container" style={{ marginTop: '0.5rem', flex: 1 }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: '#FAF9F6' }}>Ground Truth</th>
                    <th style={{ textAlign: 'center' }}>Pred Negative</th>
                    <th style={{ textAlign: 'center' }}>Pred Positive</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Actual Negative</td>
                    <td style={{ textAlign: 'center', backgroundColor: '#ECFDF5', fontWeight: '800', color: '#059669', borderRadius: '8px' }}>
                      {data.confusion_matrix[0][0]}
                    </td>
                    <td style={{ textAlign: 'center', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '8px' }}>
                      {data.confusion_matrix[0][1]}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Actual Positive</td>
                    <td style={{ textAlign: 'center', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '8px' }}>
                      {data.confusion_matrix[1][0]}
                    </td>
                    <td style={{ textAlign: 'center', backgroundColor: '#ECFDF5', fontWeight: '800', color: '#059669', borderRadius: '8px' }}>
                      {data.confusion_matrix[1][1]}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#FAF9F6', borderRadius: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Green cells denote correctly classified true negatives and true positives.
            </div>
          </div>
        </div>

        {/* Feature Importance Bar Chart */}
        <div className="col-7">
          <ChartCard 
            title="Feature Importance Ranking" 
            subtitle="Relative contribution of customer attributes to churn predictions"
            minHeight="340px"
          >
            <BarChart data={featureData} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#A1A1AA" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="var(--text-secondary)" 
                fontSize={12} 
                fontWeight={500}
                tickLine={false} 
                axisLine={false} 
                width={135} 
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar 
                dataKey="importance" 
                fill="#7C3AED" 
                radius={[0, 8, 8, 0]} 
                barSize={20} 
              />
            </BarChart>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Classification;
