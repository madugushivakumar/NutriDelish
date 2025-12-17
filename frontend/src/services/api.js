import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout for AI image generation
});

// Restaurants
export const getRestaurants = () => api.get('/restaurants');
export const getRestaurant = (id) => api.get(`/restaurants/${id}`);
export const searchRestaurants = (query) => api.get(`/restaurants/search/${query}`);

// Dishes
export const getDishes = (params) => api.get('/dishes', { params });
export const getDish = (id) => api.get(`/dishes/${id}`);

// Orders
export const getUserOrders = (userId) => api.get(`/orders/user/${userId}`);
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (orderData) => api.post('/orders', orderData);
export const updateOrderStatus = (id, status) => 
  api.patch(`/orders/${id}/status`, { status });

// Users
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, userData) => api.patch(`/users/${id}`, userData);
export const addMoneyToWallet = (id, amount, method) => 
  api.post(`/users/${id}/wallet/add`, { amount, method });
export const getUserTransactions = (id) => api.get(`/users/${id}/transactions`);

// Payments
export const validateCoupon = (code, subtotal) => 
  api.post('/payments/coupon/validate', { code, subtotal });
export const getCoupons = () => api.get('/payments/coupons');
export const createTransaction = (transactionData) => 
  api.post('/payments/transaction', transactionData);

// AI
export const getFoodRecommendation = (data) => 
  api.post('/ai/recommend', data);

export const generateDishFromQuery = (query) => 
  api.post('/ai/generate-dish', { query });

export const generateDishImage = (dishName, description, tags) => 
  api.post('/ai/generate-image', { dishName, description, tags });

export default api;

