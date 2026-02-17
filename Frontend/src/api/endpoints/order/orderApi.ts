import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Order, OrderCreate, Review, PaginatedResponse } from '../../api/types'
import { RootState } from '../index'

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
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
    tagTypes: ['Order', 'Orders'],
    endpoints: (builder) => ({
        getOrders: builder.query<PaginatedResponse<Order>, { status?: string; page?: number }>({
            query: (params) => {
                const searchParams = new URLSearchParams()
                if (params.status) searchParams.append('status', params.status)
                if (params.page) searchParams.append('page', params.page.toString())
                return `/orders/?${searchParams.toString()}`
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.results.map(({ id }) => ({ type: 'Order' as const, id })),
                        { type: 'Orders', id: 'LIST' },
                    ]
                    : [{ type: 'Orders', id: 'LIST' }],
        }),
        getOrder: builder.query<Order, number>({
            query: (id) => `/orders/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        createOrder: builder.mutation<Order, OrderCreate>({
            query: (orderData) => ({
                url: '/orders/',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
        }),
        updateOrderStatus: builder.mutation<Order, { id: number; status: string; manager_comment?: string }>({
            query: ({ id, ...data }) => ({
                url: `/orders/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Order', id },
                { type: 'Orders', id: 'LIST' },
            ],
        }),
        cancelOrder: builder.mutation<{ status: string }, number>({
            query: (id) => ({
                url: `/orders/${id}/cancel/`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Order', id },
                { type: 'Orders', id: 'LIST' },
            ],
        }),
        addReview: builder.mutation<Review, { orderId: number; data: Partial<Review> }>({
            query: ({ orderId, data }) => ({
                url: `/orders/${orderId}/add_review/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
        }),
        getOrderStatistics: builder.query<any, void>({
            query: () => '/orders/statistics/',
        }),
    }),
})

export const {
    useGetOrdersQuery,
    useGetOrderQuery,
    useCreateOrderMutation,
    useUpdateOrderStatusMutation,
    useCancelOrderMutation,
    useAddReviewMutation,
    useGetOrderStatisticsQuery,
} = ordersApi