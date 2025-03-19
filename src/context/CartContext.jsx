"use client"

import { createContext, useContext, useReducer, useEffect } from "react"

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
}

// Create context
const CartContext = createContext(initialState)

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(
        (item) => item.eventId === action.payload.eventId && item.seatType === action.payload.seatType,
      )

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        }
        return { ...state, items: updatedItems }
      } else {
        // Add new item
        return { ...state, items: [...state.items, action.payload] }
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.eventId === action.payload.eventId && item.seatType === action.payload.seatType),
        ),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.eventId === action.payload.eventId && item.seatType === action.payload.seatType
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }

    case "CLEAR_CART":
      return { ...state, items: [] }

    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload }

    default:
      return state
  }
}

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (parsedCart && Array.isArray(parsedCart)) {
          parsedCart.forEach((item) => {
            dispatch({ type: "ADD_ITEM", payload: item })
          })
        }
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items))
  }, [state.items])

  // API functions (mock or real)
  const api = {
    async addToCart(item) {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Check if .NET endpoint is available
        const endpointAvailable = false // Set to true when endpoint is ready

        if (endpointAvailable) {
          const response = await fetch("/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          })

          if (!response.ok) throw new Error("Failed to add item to cart")
          const data = await response.json()
          dispatch({ type: "ADD_ITEM", payload: data })
        } else {
          // Mock implementation
          dispatch({ type: "ADD_ITEM", payload: item })
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },

    async removeFromCart(item) {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const endpointAvailable = false // Set to true when endpoint is ready

        if (endpointAvailable) {
          const response = await fetch("/api/cart/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          })

          if (!response.ok) throw new Error("Failed to remove item from cart")
          dispatch({ type: "REMOVE_ITEM", payload: item })
        } else {
          // Mock implementation
          dispatch({ type: "REMOVE_ITEM", payload: item })
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },

    async checkout() {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const endpointAvailable = false // Set to true when endpoint is ready

        if (endpointAvailable) {
          const response = await fetch("/api/cart/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: state.items }),
          })

          if (!response.ok) throw new Error("Checkout failed")
          const data = await response.json()
          dispatch({ type: "CLEAR_CART" })
          return data
        } else {
          // Mock implementation
          return new Promise((resolve) => {
            setTimeout(() => {
              dispatch({ type: "CLEAR_CART" })
              resolve({ success: true, orderId: "mock-" + Date.now() })
            }, 1000)
          })
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message })
        throw error
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
  }

  return <CartContext.Provider value={{ ...state, ...api }}>{children}</CartContext.Provider>
}

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

