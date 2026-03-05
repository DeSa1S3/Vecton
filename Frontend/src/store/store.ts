import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import carsReducer from './slices/carsSlice';
import favoritesReducer from './slices/favoritesSlice';
import notificationsReducer from './slices/notificationSlice';
import ordersReducer from './slices/ordersSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cars: carsReducer,
        favorites: favoritesReducer,
        notifications: notificationsReducer,
        orders: ordersReducer,
        dashboard: dashboardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;