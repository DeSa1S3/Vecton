import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Favorite } from '../../api/types'
import { RootState } from '../index'

export const favoritesApi = createApi({
    reducerPath: 'favoritesApi',
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
    tagTypes: ['Favorite'],
    endpoints: (builder) => ({
        getFavorites: builder.query<Favorite[], void>({
            query: () => '/favorites/',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Favorite' as const, id })),
                        { type: 'Favorite', id: 'LIST' },
                    ]
                    : [{ type: 'Favorite', id: 'LIST' }],
        }),
        addToFavorites: builder.mutation<{ message: string }, { car: number }>({
            query: (data) => ({
                url: '/favorites/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Favorite', id: 'LIST' }],
        }),
        removeFromFavorites: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/favorites/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Favorite', id },
                { type: 'Favorite', id: 'LIST' },
            ],
        }),
        clearFavorites: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/favorites/clear/',
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Favorite', id: 'LIST' }],
        }),
        checkInFavorites: builder.query<{ in_favorites: boolean }, number>({
            query: (carId) => `/favorites/check/?car_id=${carId}`,
        }),
    }),
})

export const {
    useGetFavoritesQuery,
    useAddToFavoritesMutation,
    useRemoveFromFavoritesMutation,
    useClearFavoritesMutation,
    useCheckInFavoritesQuery,
} = favoritesApi