import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GenericPage from './pages/GenericPage';
import ETLStatus from './pages/ETLStatus';
import OLAP from './pages/OLAP';
import Classification from './pages/Classification';
import SalesPrediction from './pages/SalesPrediction';
import AttributeRelevance from './pages/AttributeRelevance';
import CustomerSegmentation from './pages/CustomerSegmentation';
import Login from './pages/Login';
import { productsApi, customersApi, miningApi, dashboardApi } from './services/api';

const formatCurrency = (val) => val != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val) : '-';
const formatNumber = (val) => val != null ? Number(val).toLocaleString() : '-';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
        <Route index element={<Dashboard />} />
        
        {/* Analytics */}
        <Route path="analytics/sales" element={
          <GenericPage 
            title="Sales Analytics" 
            fetchApi={dashboardApi.getSalesTrend} 
            columns={[
              { header: 'Month', accessor: 'month' },
              { header: 'Year', accessor: 'year' },
              { header: 'Revenue', accessor: 'revenue', render: (row) => formatCurrency(row.revenue) }
            ]}
          />
        } />
        
        <Route path="analytics/products" element={
          <GenericPage 
            title="Product Analytics" 
            fetchApi={productsApi.getAnalytics} 
            filterConfig={[
              { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Electronics, Fashion, Books' }
            ]}
            columns={[
              { header: 'Product ID', accessor: 'product_id' },
              { header: 'Product Name', accessor: 'product_name' },
              { header: 'Category', accessor: 'category' },
              { header: 'Quantity Sold', accessor: 'quantity_sold' },
              { header: 'Revenue', accessor: 'revenue', render: (row) => formatCurrency(row.revenue) },
              { header: 'Profit', accessor: 'profit', render: (row) => formatCurrency(row.profit) },
              { header: 'Avg Selling Price', accessor: 'avg_selling_price', render: (row) => formatCurrency(row.avg_selling_price) },
              { header: 'Order Count', accessor: 'order_count' }
            ]}
          />
        } />
        
        <Route path="analytics/customers" element={
          <GenericPage 
            title="Customer Analytics" 
            fetchApi={customersApi.getAnalytics} 
            columns={[
              { header: 'Customer ID', accessor: 'customer_id' },
              { header: 'Customer Name', accessor: 'customer_name' },
              { header: 'Order Count', accessor: 'order_count' },
              { header: 'Total Spending', accessor: 'total_spending', render: (row) => formatCurrency(row.total_spending) },
              { header: 'Avg Order Value', accessor: 'avg_order_value', render: (row) => formatCurrency(row.avg_order_value) },
              { header: 'Quantity', accessor: 'quantity' },
              { header: 'First Purchase', accessor: 'first_purchase' },
              { header: 'Latest Purchase', accessor: 'latest_purchase' }
            ]}
          />
        } />
        
        <Route path="analytics/locations" element={
          <GenericPage 
            title="Location Analytics" 
            fetchApi={dashboardApi.getLocationSales} 
            columns={[
              { header: 'City', accessor: 'city' },
              { header: 'Revenue', accessor: 'revenue', render: (row) => formatCurrency(row.revenue) }
            ]}
          />
        } />
        
        {/* Data Mining */}
        <Route path="mining/segmentation" element={<CustomerSegmentation />} />
        
        <Route path="mining/association" element={
          <GenericPage 
            title="Association Rules" 
            fetchApi={miningApi.getAssociationRules} 
            filterConfig={[
              { key: 'min_support', label: 'Min Support', type: 'text', placeholder: 'e.g. 0.01 (1%)' },
              { key: 'min_confidence', label: 'Min Confidence', type: 'text', placeholder: 'e.g. 0.5 (50%)' }
            ]}
            columns={[
              { header: 'Antecedent', accessor: 'antecedents', render: (row) => row.antecedents?.join(', ') },
              { header: 'Consequent', accessor: 'consequents', render: (row) => row.consequents?.join(', ') },
              { header: 'Support', accessor: 'support', render: (row) => Number(row.support).toFixed(4) },
              { header: 'Confidence', accessor: 'confidence', render: (row) => Number(row.confidence).toFixed(4) },
              { header: 'Lift', accessor: 'lift', render: (row) => Number(row.lift).toFixed(4) }
            ]}
          />
        } />
        
        <Route path="mining/classification" element={<Classification />} />
        <Route path="mining/prediction" element={<SalesPrediction />} />
        <Route path="mining/relevance" element={<AttributeRelevance />} />
        <Route path="olap" element={<OLAP />} />
        <Route path="system/etl" element={<ETLStatus />} />
        <Route path="system/reports" element={<GenericPage title="System Reports" fetchApi={(p) => dashboardApi.getKpis()} columns={[]} />} />
      </Route>
    </Routes>
  );
};

export default App;
