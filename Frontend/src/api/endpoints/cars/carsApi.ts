import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Car, CarFilters, PaginatedResponse } from '../../api/types'
import { RootState } from '../index'

export const carsApi = createApi({
    reducerPath: 'carsApi',
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
    tagTypes: ['Car', 'Cars'],
    endpoints: (builder) => ({
        getCars: builder.query<PaginatedResponse<Car>, CarFilters>({
            query: (filters) => {
                const params = new URLSearchParams()
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (Array.isArray(value)) {
                            value.forEach(v => params.append(key, v.toString()))
                        } else {
                            params.append(key, value.toString())
                        }
                    }
                })
                return `/cars/?${params.toString()}`
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.results.map(({ id }) => ({ type: 'Car' as const, id })),
                        { type: 'Cars', id: 'LIST' },
                    ]
                    : [{ type: 'Cars', id: 'LIST' }],
        }),
        getCar: builder.query<Car, number>({
            query: (id) => `/cars/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Car', id }],
        }),
        createCar: builder.mutation<Car, FormData>({
            query: (carData) => ({
                url: '/cars/',
                method: 'POST',
                body: carData,
            }),
            invalidatesTags: [{ type: 'Cars', id: 'LIST' }],
        }),
        updateCar: builder.mutation<Car, { id: number; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/cars/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Car', id },
                { type: 'Cars', id: 'LIST' },
            ],
        }),
        deleteCar: builder.mutation<void, number>({
            query: (id) => ({
                url: `/cars/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Cars', id: 'LIST' }],
        }),
        incrementViews: builder.mutation<{ views_count: number }, number>({
            query: (id) => ({
                url: `/cars/${id}/increment_views/`,
                method: 'POST',
            }),
        }),
        getSimilarCars: builder.query<Car[], number>({
            query: (id) => `/cars/${id}/similar/`,
        }),
        uploadCarImages: builder.mutation<Car[], { id: number; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/cars/${id}/images/`,
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Car', id }],
        }),
        getBrands: builder.query<{ id: number; name: string; logo?: string }[], void>({
            query: () => '/brands/',
        }),
        getModels: builder.query<{ id: number; brand: number; name: string }[], { brand?: number }>({
            query: ({ brand }) => {
                const params = brand ? `?brand=${brand}` : ''
                return `/models/${params}`
            },
        }),
    }),
})

export const {
    useGetCarsQuery,
    useGetCarQuery,
    useCreateCarMutation,
    useUpdateCarMutation,
    useDeleteCarMutation,
    useIncrementViewsMutation,
    useGetSimilarCarsQuery,
    useUploadCarImagesMutation,
    useGetBrandsQuery,
    useGetModelsQuery,
} = carsApi