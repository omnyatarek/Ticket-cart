"use client"
import { useCart } from "../context/CartContext"
import "./CartItem.css"

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart()

  const handleRemove = () => {
    removeFromCart({
      eventId: item.eventId,
      seatType: item.seatType,
    })
  }

  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <h3 className="event-name">{item.eventName}</h3>
        <p className="seat-type">Seat Type: {item.seatType}</p>
      </div>
      <div className="cart-item-quantity">
        <span>Qty: {item.quantity}</span>
      </div>
      <div className="cart-item-price">
        <p className="price">${item.price.toFixed(2)}</p>
        <p className="total-price">Total: ${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <button className="remove-button" onClick={() => handleRemove(item.eventId)}>
  <img src="elements.png" alt="Remove" className="remove-icon" />
</button>

    </div>
  )
}

export default CartItem

