import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Notification, PaginatedResponse } from '../../api/types'
import { RootState } from '../index'

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
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
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotifications: builder.query<PaginatedResponse<Notification>, { is_read?: boolean; page?: number }>({
            query: (params) => {
                const searchParams = new URLSearchParams()
                if (params.is_read !== undefined) searchParams.append('is_read', params.is_read.toString())
                if (params.page) searchParams.append('page', params.page.toString())
                return `/notifications/?${searchParams.toString()}`
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.results.map(({ id }) => ({ type: 'Notification' as const, id })),
                        { type: 'Notification', id: 'LIST' },
                    ]
                    : [{ type: 'Notification', id: 'LIST' }],
        }),
        markAsRead: builder.mutation<{ message: string }, { notification_ids?: number[]; mark_all?: boolean }>({
            query: (data) => ({
                url: '/notifications/mark_read/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
        }),
        getUnreadCount: builder.query<{ unread_count: number }, void>({
            query: () => '/notifications/unread_count/',
            providesTags: ['Notification'],
        }),
    }),
})

export const {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useGetUnreadCountQuery,
} = notificationsApi