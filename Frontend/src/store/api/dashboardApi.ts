import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { DashboardStats, PopularCar, RecentOrder } from '../../api/types'
import type { RootState } from '../index'

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.tokens?.access
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['Dashboard'],
    endpoints: (builder) => ({
        getDashboardStats: builder.query<DashboardStats, void>({
            query: () => '/dashboard/stats/',
            providesTags: ['Dashboard'],
        }),
        getPopularCars: builder.query<PopularCar[], { limit?: number }>({
            query: ({ limit = 10 }) => `/dashboard/popular-cars/?limit=${limit}`,
            providesTags: ['Dashboard'],
        }),
        getRecentOrders: builder.query<RecentOrder[], { limit?: number }>({
            query: ({ limit = 10 }) => `/dashboard/recent-orders/?limit=${limit}`,
            providesTags: ['Dashboard'],
        }),
        getRevenueStats: builder.query<any, { period?: string }>({
            query: ({ period = 'month' }) => `/dashboard/revenue/?period=${period}`,
            providesTags: ['Dashboard'],
        }),
    }),
})

export const {
    useGetDashboardStatsQuery,
    useGetPopularCarsQuery,
    useGetRecentOrdersQuery,
    useGetRevenueStatsQuery,
} = dashboardApi