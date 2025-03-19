import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Confirmation from './pages/Confirmation';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/cart" replace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart/confirmation" element={<Confirmation />} />
            </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;