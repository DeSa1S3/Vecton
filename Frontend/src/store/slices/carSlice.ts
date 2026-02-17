import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CarFilters } from '../../api/types'

interface CarState {
    filters: CarFilters
    selectedCarId: number | null
    favorites: number[]
    comparison: number[]
}

const initialState: CarState = {
    filters: {},
    selectedCarId: null,
    favorites: [],
    comparison: [],
}

const carSlice = createSlice({
    name: 'cars',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<CarFilters>) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        clearFilters: (state) => {
            state.filters = {}
        },
        removeFilter: (state, action: PayloadAction<keyof CarFilters>) => {
            delete state.filters[action.payload]
        },
        setSelectedCar: (state, action: PayloadAction<number | null>) => {
            state.selectedCarId = action.payload
        },
        addToFavorites: (state, action: PayloadAction<number>) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload)
            }
        },
        removeFromFavorites: (state, action: PayloadAction<number>) => {
            state.favorites = state.favorites.filter(id => id !== action.payload)
        },
        clearFavorites: (state) => {
            state.favorites = []
        },
        addToComparison: (state, action: PayloadAction<number>) => {
            if (!state.comparison.includes(action.payload) && state.comparison.length < 3) {
                state.comparison.push(action.payload)
            }
        },
        removeFromComparison: (state, action: PayloadAction<number>) => {
            state.comparison = state.comparison.filter(id => id !== action.payload)
        },
        clearComparison: (state) => {
            state.comparison = []
        },
    },
})

export const {
    setFilters,
    clearFilters,
    removeFilter,
    setSelectedCar,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    addToComparison,
    removeFromComparison,
    clearComparison,
} = carSlice.actions

export default carSlice.reducer