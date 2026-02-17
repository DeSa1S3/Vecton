import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User, LoginRequest, RegisterRequest, AuthResponse, Tokens } from '../../api/types'
import { RootState } from '../index'

export const authApi = createApi({
    reducerPath: 'authApi',
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
    tagTypes: ['User'],
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login/',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/auth/register/',
                method: 'POST',
                body: userData,
            }),
        }),
        refreshToken: builder.mutation<{ access: string }, { refresh: string }>({
            query: (data) => ({
                url: '/auth/refresh/',
                method: 'POST',
                body: data,
            }),
        }),
        getProfile: builder.query<User, void>({
            query: () => '/users/me/',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation<User, Partial<User>>({
            query: (userData) => ({
                url: '/users/me/',
                method: 'PATCH',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
        changePassword: builder.mutation<{ message: string }, { old_password: string; new_password: string; new_password2: string }>({
            query: (data) => ({
                url: '/users/me/change_password/',
                method: 'POST',
                body: data,
            }),
        }),
        checkAuth: builder.query<User, void>({
            query: () => '/users/me/',
            providesTags: ['User'],
        }),
    }),
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useCheckAuthQuery,
} = authApi