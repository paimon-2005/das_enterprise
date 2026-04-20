import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            state.totalQuantity++;
            
            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    quantity: 1,
                    image: newItem.image,
                    totalPrice: newItem.price
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price;
            }
            state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
        },
        removeItem: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            
            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.items = state.items.filter(item => item.id !== id);
                state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
            }
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            
            if (existingItem && quantity >= 1) {
                state.totalQuantity += (quantity - existingItem.quantity);
                existingItem.quantity = quantity;
                existingItem.totalPrice = existingItem.price * quantity;
                state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        }
    }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectTotalQuantity = (state) => state.cart.totalQuantity;
export const selectTotalAmount = (state) => state.cart.totalAmount;

export default cartSlice.reducer;
