'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define the initial state
const initialState = {
  items: [],
  total: 0,
};

// Create the context
const CartContext = createContext();

// Define action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      // ... (rest of the reducer logic remains the same)
    case REMOVE_FROM_CART:
      // ... (rest of the reducer logic remains the same)
    case UPDATE_QUANTITY:
      // ... (rest of the reducer logic remains the same)
    case CLEAR_CART:
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'INITIALIZE_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (item) => dispatch({ type: ADD_TO_CART, payload: item });
  const removeFromCart = (itemId) => dispatch({ type: REMOVE_FROM_CART, payload: itemId });
  const updateQuantity = (itemId, quantity) => dispatch({ type: UPDATE_QUANTITY, payload: { id: itemId, quantity } });
  const clearCart = () => dispatch({ type: CLEAR_CART });

  return (
    <CartContext.Provider value={{ 
      cart: state.items, 
      total: state.total, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
