import React, { useState, useEffect } from 'react';
import { miningApi } from '../services/api';
import { LoadingState, ErrorState } from '../components/StateComponents';
import KPI from '../components/KPI';
import ChartCard from '../components/ChartCard';
import { TrendingUp, BarChart2, CheckSquare, LineChart as LineIcon, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesPrediction = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await miningApi.getRegression();
      if (!res.success) throw new Error(res.message || 'Failed to fetch regression metrics');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'An error occurred while evaluating regression model.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Training sales regression forecasting model..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!data) return null;

  const featureNames = ['Quantity Sold', 'Unit Price', 'Customer Age', 'Order Velocity', 'Discount Rate'];
  const coefData = data.coefficients?.map((coef, idx) => ({
    name: featureNames[idx] || `Param ${idx + 1}`,
    value: Number(coef)
  }));

  const r2Formatted = typeof data.r2_score === 'number' ? data.r2_score.toFixed(4) : data.r2_score;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Sales Prediction & Regression</h1>
          <p className="page-subtitle">Linear regression modeling for revenue forecasting and price elasticity estimation.</p>
        </div>

        <div className="header-action-pills">
          <span className="badge badge-success">
            <CheckSquare size={13} /> R² = {r2Formatted}
          </span>
          <span className="badge badge-primary">
            <LineIcon size={13} /> Multivariate OLS
          </span>
        </div>
      </div>

      <div className="grid-kpi">
        <KPI 
          title="R² Fit Score" 
          value={r2Formatted} 
          icon={CheckSquare}
          color="var(--success)"
          accentBadge="Goodness of Fit"
          contextText="Explained Variance"
        />
        <KPI 
          title="Model Intercept" 
          value={typeof data.intercept === 'number' ? data.intercept.toFixed(2) : data.intercept} 
          icon={TrendingUp}
          color="var(--primary)"
          accentBadge="β₀ Base"
          contextText="Baseline Constant"
        />
        <KPI 
          title="Primary Coefficient" 
          value={data.coefficients?.[0] ? Number(data.coefficients[0]).toFixed(3) : '—'} 
          icon={BarChart2}
          color="var(--warning)"
          accentBadge="β₁"
          contextText="Quantity Slope"
        />
        <KPI 
          title="Secondary Coefficient" 
          value={data.coefficients?.[1] ? Number(data.coefficients[1]).toFixed(3) : '—'} 
          icon={BarChart2}
          color="#3B82F6"
          accentBadge="β₂"
          contextText="Unit Price Slope"
        />
      </div>

      <div className="grid-charts">
        <div className="col-12">
          <ChartCard 
            title="Regression Feature Slopes (Coefficients)" 
            subtitle="Impact magnitude of independent variables on predicted revenue"
            minHeight="340px"
          >
            <BarChart data={coefData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" vertical={false} />
              <XAxis dataKey="name" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121217', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#FFFFFF' }}
                cursor={{ fill: 'rgba(124, 58, 237, 0.04)' }}
                formatter={(value) => [Number(value).toFixed(4), 'Coefficient (β)']}
              />
              <Bar dataKey="value" fill="#7C3AED" radius={[6, 6, 0, 0]} barSize={42} />
            </BarChart>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default SalesPrediction;
