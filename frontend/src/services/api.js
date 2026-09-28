import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format responses
apiClient.interceptors.response.use(
  (response) => {
    // If the backend already wraps in { success, data, message }, return it
    if (response.data && response.data.hasOwnProperty('success')) {
      return response.data;
    }
    // Otherwise wrap it
    return { success: true, data: response.data, message: 'Success' };
  },
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.detail || error.message || 'An error occurred';
    return { success: false, data: null, message };
  }
);

export const dashboardApi = {
  getKpis: () => apiClient.get('/dashboard/kpis'),
  getSalesTrend: () => apiClient.get('/dashboard/sales-trend'),
  getCategorySales: () => apiClient.get('/dashboard/category-sales'),
  getTopProducts: () => apiClient.get('/dashboard/top-products'),
  getTopCustomers: () => apiClient.get('/dashboard/top-customers'),
  getLocationSales: () => apiClient.get('/dashboard/location-sales'),
};

export const productsApi = {
  getAnalytics: (params) => apiClient.get('/products/', { params }),
};

export const customersApi = {
  getAnalytics: (params) => apiClient.get('/customers/', { params }),
};

export const olapApi = {
  rollup: (params) => apiClient.get('/olap/rollup', { params }),
  drilldown: (params) => apiClient.get('/olap/drilldown', { params }),
  slice: (params) => apiClient.get('/olap/slice', { params }),
  dice: (params) => apiClient.get('/olap/dice', { params }),
  pivot: (params) => apiClient.get('/olap/pivot', { params }),
};

export const miningApi = {
  getClusters: (params) => apiClient.get('/mining/clusters', { params }),
  getAssociationRules: (params) => apiClient.get('/mining/association-rules', { params }),
  getClassification: (params) => apiClient.get('/mining/classification', { params }),
  getRegression: (params) => apiClient.get('/mining/regression', { params }),
  getAttributeRelevance: (params) => apiClient.get('/mining/attribute-relevance', { params }),
};

export const etlApi = {
  getStatus: () => apiClient.get('/etl/validate'),
  runEtl: () => apiClient.post('/etl/run'),
};

export default apiClient;
