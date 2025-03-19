import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import './Cart.css';

const Cart = () => {
  const { items, loading, error, checkout, addToCart } = useCart();
  const navigate = useNavigate();
  
  // Add mock data when component mounts
  useEffect(() => {
    if (items.length === 0) {
      // Add some mock items for testing
      const mockItems = [
        {
          eventId: '1',
          eventName: 'Summer Music Festival',
          seatType: 'VIP',
          quantity: 2,
          price: 149.99
        },
        {
          eventId: '2',
          eventName: 'Basketball Championship',
          seatType: 'Standard',
          quantity: 3,
          price: 79.99
        },
        {
          eventId: '3',
          eventName: 'Comedy Night',
          seatType: 'Front Row',
          quantity: 1,
          price: 59.99
        }
      ];
      
      // Add each mock item to cart
      mockItems.forEach(item => {
        addToCart(item);
      });
    }
  }, [items.length, addToCart]);
  
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleCheckout = async () => {
    try {
      await checkout();
      navigate('/cart/confirmation');
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };
  
  if (loading) {
    return <div className="cart-loading">Loading cart...</div>;
  }
  
  if (error) {
    return <div className="cart-error">Error: {error}</div>;
  }
  
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any tickets yet.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1> Cart</h1>
      
      <div className="cart-items">
        {items.map((item, index) => (
          <CartItem key={`${item.eventId}-${item.seatType}-${index}`} item={item} />
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total</h3>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
        
        <button 
          className="checkout-button" 
          onClick={handleCheckout}
          disabled={items.length === 0 || loading}
        >
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
};

export default Cart;