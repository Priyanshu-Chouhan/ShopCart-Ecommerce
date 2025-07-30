import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['user/authError'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.error', 'payload.config', 'payload.request'],
                // Ignore these paths in the state
                ignoredPaths: ['user.error'],
            },
        }),
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
    const state = store.getState();
    // Save user data
    if (state.user.currentUser) {
        localStorage.setItem('user', JSON.stringify(state.user.currentUser));
    }
    // Save product data
    if (state.user.productData && state.user.productData.length > 0) {
        localStorage.setItem('productData', JSON.stringify(state.user.productData));
    }
});

export default store;