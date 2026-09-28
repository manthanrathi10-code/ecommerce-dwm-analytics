import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';
import KPI from '../components/KPI';
import ChartCard from '../components/ChartCard';
import { LoadingState, ErrorState } from '../components/StateComponents';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Wallet, 
  CircleDollarSign, 
  Calendar, 
  Share2, 
  Download, 
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const PALETTE = ['#7C3AED', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'];

// Custom Dark Tooltip matching reference image
const CustomTooltip = ({ active, payload, label, prefix = '₹', formatter }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const formatted = formatter 
      ? formatter(val) 
      : `${prefix}${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(val)}`;

    return (
      <div style={styles.tooltipBox}>
        <div style={styles.tooltipLabel}>{label || payload[0].name}</div>
        <div style={styles.tooltipValRow}>
          <span style={styles.tooltipDot}></span>
          <span style={styles.tooltipVal}>{formatted}</span>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    kpis: null,
    salesTrend: null,
    categorySales: null,
    topProducts: null,
    locationSales: null
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpisRes, trendRes, catRes, prodRes, locRes] = await Promise.all([
        dashboardApi.getKpis(),
        dashboardApi.getSalesTrend(),
        dashboardApi.getCategorySales(),
        dashboardApi.getTopProducts(),
        dashboardApi.getLocationSales()
      ]);

      if (!kpisRes.success) throw new Error(kpisRes.message || 'Failed to fetch dashboard data');

      setData({
        kpis: kpisRes.data,
        salesTrend: trendRes.data || [],
        categorySales: catRes.data || [],
        topProducts: prodRes.data || [],
        locationSales: locRes.data || []
      });
    } catch (err) {
      setError(err.message || 'An error occurred while fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading executive intelligence metrics..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  
  const { kpis, salesTrend, categorySales, topProducts, locationSales } = data;

  const aov = kpis?.total_orders ? (kpis.total_revenue / kpis.total_orders) : 0;
  const profitMargin = kpis?.total_revenue ? ((kpis.total_profit / kpis.total_revenue) * 100).toFixed(1) : 0;

  return (
    <div className="animate-fade-in">
      {/* Editorial Hero Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Executive Overview</h1>
          <p className="page-subtitle">
            Real-time intelligence across sales, customers, products and locations.
          </p>
        </div>

        {/* Action pills inspired by reference image */}
        <div className="header-action-pills">
          <div style={styles.datePill}>
            <Calendar size={14} color="var(--text-muted)" />
            <span>2023 – 2025 (Full Star Schema)</span>
          </div>
          <button className="btn btn-outline" style={styles.actionBtn} title="Download Report">
            <Download size={15} />
            <span>Export</span>
          </button>
          <button className="btn btn-dark" style={styles.actionBtn}>
            <Sparkles size={14} color="#A78BFA" />
            <span>DWM Insights</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {kpis && (
        <div className="grid-kpi">
          {/* Signature Dark Highlight Card for Total Revenue (inspired by reference image) */}
          <KPI 
            title="Total Revenue" 
            value={kpis.total_revenue || 0} 
            prefix="₹" 
            theme="dark"
            icon={CircleDollarSign}
            accentBadge="Gross Sales"
            contextText="₹140.5M All-Time"
          />

          {/* Total Profit */}
          <KPI 
            title="Total Profit" 
            value={kpis.total_profit || 0} 
            prefix="₹" 
            icon={TrendingUp}
            color="var(--success)"
            accentBadge={`${profitMargin}% Margin`}
            contextText="Net Earnings"
          />

          {/* Total Orders */}
          <KPI 
            title="Total Orders" 
            value={kpis.total_orders || 0} 
            icon={ShoppingCart}
            color="var(--warning)"
            accentBadge="Invoices"
            contextText="Completed Purchases"
          />

          {/* Total Customers */}
          <KPI 
            title="Total Customers" 
            value={kpis.total_customers || 0} 
            icon={Users}
            color="var(--primary)"
            accentBadge="Active"
            contextText="Unique Buyer Cohort"
          />

          {/* Average Order Value */}
          <KPI 
            title="Avg Order Value" 
            value={aov} 
            prefix="₹" 
            icon={Wallet}
            color="#3B82F6"
            accentBadge="AOV"
            contextText="Spend per Transaction"
          />
        </div>
      )}

      {/* Visualizations Grid */}
      <div className="grid-charts">
        {/* Large Primary Revenue Trend Area Chart */}
        <div className="col-8">
          <ChartCard 
            title="Revenue Trajectory (Monthly Breakdown)" 
            subtitle="Continuous multi-year trend aggregated across fact sales records"
            minHeight="350px"
            action={
              <span className="badge badge-primary">
                {salesTrend?.length || 0} Reporting Cycles
              </span>
            }
          >
            <AreaChart data={salesTrend} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.28}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#A1A1AA" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(m) => `M${m}`}
              />
              <YAxis 
                stroke="#A1A1AA" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(val)} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#7C3AED" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#revenueGlow)" 
                activeDot={{ r: 6, fill: '#7C3AED', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartCard>
        </div>

        {/* Regional Donut Chart */}
        <div className="col-4">
          <ChartCard 
            title="Sales by Region" 
            subtitle="Geographical distribution across metro hubs"
            minHeight="350px"
            action={<span className="badge badge-dark">20 Cities</span>}
          >
            <PieChart>
              <Pie
                data={locationSales?.slice(0, 6)}
                cx="50%"
                cy="46%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="revenue"
                nameKey="city"
              >
                {locationSales?.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={40} 
                iconType="circle" 
                formatter={(val) => <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{val}</span>} 
              />
            </PieChart>
          </ChartCard>
        </div>

        {/* Category Performance Bar Chart */}
        <div className="col-7">
          <ChartCard 
            title="Revenue by Product Category" 
            subtitle="Comparative contribution across inventory verticals"
            minHeight="310px"
          >
            <BarChart 
              data={categorySales} 
              layout="vertical" 
              margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#A1A1AA" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(val)} 
              />
              <YAxis 
                dataKey="category" 
                type="category" 
                stroke="var(--text-secondary)" 
                fontSize={12} 
                fontWeight={500}
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="#7C3AED" 
                radius={[0, 8, 8, 0]} 
                barSize={20} 
              />
            </BarChart>
          </ChartCard>
        </div>

        {/* Top Product Highlights Card */}
        <div className="col-5">
          <div className="card animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Top Grossing Products</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Highest revenue contributors
                </p>
              </div>
              <span className="card-badge">Top 5</span>
            </div>

            <div style={styles.productList}>
              {topProducts?.map((p, idx) => (
                <div key={idx} style={styles.productRow}>
                  <div style={styles.productRank}>0{idx + 1}</div>
                  <div style={styles.productInfo}>
                    <span style={styles.productName}>{p.product_name}</span>
                    <span style={styles.productRevenue}>
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  datePill: {
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
  actionBtn: {
    padding: '0.45rem 0.95rem',
    fontSize: '0.8rem',
    gap: '0.45rem'
  },
  tooltipBox: {
    backgroundColor: '#121217',
    color: '#FFFFFF',
    padding: '0.65rem 0.95rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  tooltipLabel: {
    fontSize: '0.72rem',
    color: '#A1A1AA',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '0.2rem'
  },
  tooltipValRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  tooltipDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#A78BFA'
  },
  tooltipVal: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#FFFFFF'
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem',
    flex: 1,
    justifyContent: 'space-around'
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.65rem 0.85rem',
    borderRadius: 'var(--radius-md)',
    backgroundColor: '#FAF9F6',
    border: '1px solid var(--border-color)',
    transition: 'transform var(--transition-fast)'
  },
  productRank: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: 'var(--primary)',
    width: '24px'
  },
  productInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  productName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  productRevenue: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-secondary)'
  }
};

export default Dashboard;
