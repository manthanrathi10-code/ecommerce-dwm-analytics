import React, { useState, useEffect } from 'react';
import { miningApi } from '../services/api';
import { LoadingState, ErrorState } from '../components/StateComponents';
import ChartCard from '../components/ChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sliders, Sparkles, Target, Layers } from 'lucide-react';

const AttributeRelevance = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await miningApi.getAttributeRelevance();
      if (!res.success) throw new Error(res.message || 'Failed to fetch relevance metrics');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'An error occurred while evaluating attribute relevance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Computing information gain and attribute relevance..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!data) return null;

  const relevanceFormatted = data.relevance?.map(item => ({
    ...item,
    formatted_name: item.attribute_name.replace(/_/g, ' ')
  }));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Attribute Relevance Analysis</h1>
          <p className="page-subtitle">
            Feature evaluation quantifying the predictive influence of schema dimensions on sales outcomes.
          </p>
        </div>

        <div className="header-action-pills">
          <span className="badge badge-primary">
            <Sliders size={13} /> {data.method || 'Information Gain / Correlation'}
          </span>
          <span className="badge badge-dark">
            <Target size={13} /> Target: {data.target || 'Total Amount'}
          </span>
        </div>
      </div>

      <div className="grid-charts">
        <div className="col-12">
          <ChartCard 
            title="Attribute Relevance Weights" 
            subtitle="Normalized correlation scores between schema attributes and target metric"
            minHeight="380px"
          >
            <BarChart 
              data={relevanceFormatted} 
              layout="vertical" 
              margin={{ left: 50, right: 30, top: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#A1A1AA" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => val.toFixed(2)} 
              />
              <YAxis 
                dataKey="formatted_name" 
                type="category" 
                stroke="var(--text-secondary)" 
                fontSize={12} 
                fontWeight={500}
                tickLine={false} 
                axisLine={false} 
                width={130} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121217', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#FFFFFF' }}
                cursor={{ fill: 'rgba(124, 58, 237, 0.04)' }}
                formatter={(value) => [Number(value).toFixed(4), 'Relevance Weight']}
              />
              <Bar dataKey="relevance_score" fill="#7C3AED" radius={[0, 8, 8, 0]} barSize={26} />
            </BarChart>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default AttributeRelevance;
