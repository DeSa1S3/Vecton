import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import authReducer from './slices/authSlice.ts'
import carReducer from './slices/carSlice'
import uiReducer from './slices/uiSlice'
import { authApi } from './api/authApi'
import { carsApi } from './api/carsApi'
import { ordersApi } from './api/ordersApi'
import { favoritesApi } from './api/favoritesApi'
import { notificationsApi } from './api/notificationsApi'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cars: carReducer,
        ui: uiReducer,
        [authApi.reducerPath]: authApi.reducer,
        [carsApi.reducerPath]: carsApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
        [favoritesApi.reducerPath]: favoritesApi.reducer,
        [notificationsApi.reducerPath]: notificationsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            carsApi.middleware,
            ordersApi.middleware,
            favoritesApi.middleware,
            notificationsApi.middleware
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector