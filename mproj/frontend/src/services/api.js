import axios from 'axios';

const API_URL = 'http://localhost:1234/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (username, password) => api.post('/auth/signin', { username, password }),
  register: (username, email, password, role) =>
    api.post('/auth/signup', { username, email, password, roles: [role] }),
};

export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getByProducer: (producerId) => api.get(`/products/producer/${producerId}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

export const cartService = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity) => api.post('/cart/items', { productId, quantity }),
  updateQuantity: (itemId, quantity) => api.put(`/cart/items/${itemId}?quantity=${quantity}`),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export const orderService = {
  getOrders: () => api.get('/orders'),
  checkout: () => api.post('/orders/checkout'),
};

export const recommendationService = {
  getRecommendations: () => api.get('/recommendations'),
  rateProduct: (productId, score) => api.post('/recommendations/rate', { productId, score }),
};

export default api;
