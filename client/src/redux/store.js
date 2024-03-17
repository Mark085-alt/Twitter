import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../redux/slices/authSlice.js";


export const store = configureStore({
    reducer: {
        auth: authReducer
    }
});