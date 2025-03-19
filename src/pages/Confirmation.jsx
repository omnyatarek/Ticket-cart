import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Confirmation.css";

const Confirmation = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Controls visibility
  const orderId = "ORD-" + Math.floor(Math.random() * 10000);

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(true); // Show confirmation after delay
    }, 3000);
  }, []);

  return (
    <div className="confirmation-container">
      {isVisible && showMessage ? (
        <div className="confirmation-card">
          <div className="confirmation-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase.</p>
          <p className="order-id">Order ID: {orderId}</p>
          <p>Your tickets have been reserved and will be sent to your email shortly.</p>
          <button className="back-button" onClick={() => navigate("/cart")}>
            Return to Cart
          </button>
          
        </div>
      ) : (
        <p className="loading-spinner">⏳ Processing your order...</p>
      )}
    </div>
  );
};

export default Confirmation;
