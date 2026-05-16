import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ProducerLayout from './pages/producer/ProducerLayout';
import ProducerDashboard from './pages/producer/ProducerDashboard';
import ProductForm from './pages/producer/ProductForm';
import ConsumerLayout from './pages/consumer/ConsumerLayout';
import ConsumerDashboard from './pages/consumer/ConsumerDashboard';
import ConsumerCart from './pages/consumer/ConsumerCart';
import ConsumerOrders from './pages/consumer/ConsumerOrders';
import ConsumerRecommendations from './pages/consumer/ConsumerRecommendations';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/producer" element={
              <ProtectedRoute allowedRoles={['ROLE_PRODUCER']}>
                <ProducerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ProducerDashboard />} />
              <Route path="add-product" element={<ProductForm />} />
              <Route path="edit-product/:id" element={<ProductForm />} />
            </Route>

            <Route path="/consumer" element={
              <ProtectedRoute allowedRoles={['ROLE_CONSUMER']}>
                <ConsumerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ConsumerDashboard />} />
              <Route path="recommendations" element={<ConsumerRecommendations />} />
              <Route path="cart" element={<ConsumerCart />} />
              <Route path="orders" element={<ConsumerOrders />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
