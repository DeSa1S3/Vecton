import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { favoritesApi } from '../../services/api';
import toast from 'react-hot-toast';

export interface Favorite {
    id: number;
    user: number;
    car: {
        id: number;
        brand: string;
        model: string;
        year: number;
        price: number;
        main_image: string | null;
    };
    created_at: string;
}

interface FavoritesState {
    items: Favorite[];
    favoriteIds: number[];
    isLoading: boolean;
    error: string | null;
}

const initialState: FavoritesState = {
    items: [],
    favoriteIds: [],
    isLoading: false,
    error: null,
};

interface CheckFavoriteResponse {
    in_favorites: boolean;
}

interface ClearFavoritesResponse {
    message: string;
}

export const fetchFavorites = createAsyncThunk<Favorite[]>(
    'favorites/fetchFavorites',
    async () => {
        const response = await favoritesApi.getFavorites();
        return response;
    }
);

export const addToFavorites = createAsyncThunk<Favorite, number>(
    'favorites/addToFavorites',
    async (carId) => {
        const response = await favoritesApi.addToFavorites(carId);
        return response;
    }
);

export const removeFromFavorites = createAsyncThunk<number, number>(
    'favorites/removeFromFavorites',
    async (id) => {
        await favoritesApi.removeFromFavorites(id);
        return id;
    }
);

export const checkFavorite = createAsyncThunk<{ carId: number; inFavorites: boolean }, number>(
    'favorites/checkFavorite',
    async (carId) => {
        const response = await favoritesApi.checkFavorite(carId);
        return { carId, inFavorites: response.in_favorites };
    }
);

export const clearFavorites = createAsyncThunk<ClearFavoritesResponse>(
    'favorites/clearFavorites',
    async () => {
        const response = await favoritesApi.clearFavorites();
        return response;
    }
);

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        clearFavoritesState: (state: FavoritesState) => {
            state.items = [];
            state.favoriteIds = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state: FavoritesState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state: FavoritesState, action: PayloadAction<Favorite[]>) => {
                state.isLoading = false;
                state.items = action.payload;
                state.favoriteIds = action.payload.map(item => item.car.id);
            })
            .addCase(fetchFavorites.rejected, (state: FavoritesState, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка загрузки избранного';
            })

            .addCase(addToFavorites.fulfilled, (state: FavoritesState, action: PayloadAction<Favorite>) => {
                state.items.push(action.payload);
                state.favoriteIds.push(action.payload.car.id);
                toast.success('Добавлено в избранное');
            })

            .addCase(removeFromFavorites.fulfilled, (state: FavoritesState, action: PayloadAction<number>) => {
                const removedItem = state.items.find(item => item.id === action.payload);
                state.items = state.items.filter(item => item.id !== action.payload);
                if (removedItem) {
                    state.favoriteIds = state.favoriteIds.filter(id => id !== removedItem.car.id);
                }
                toast.success('Удалено из избранного');
            })

            .addCase(checkFavorite.fulfilled, (state: FavoritesState, action: PayloadAction<{ carId: number; inFavorites: boolean }>) => {
                const { carId, inFavorites } = action.payload;
                if (inFavorites && !state.favoriteIds.includes(carId)) {
                    state.favoriteIds.push(carId);
                } else if (!inFavorites) {
                    state.favoriteIds = state.favoriteIds.filter(id => id !== carId);
                }
            })

            .addCase(clearFavorites.fulfilled, (state: FavoritesState) => {
                state.items = [];
                state.favoriteIds = [];
                toast.success('Избранное очищено');
            });
    },
});

export const { clearFavoritesState } = favoritesSlice.actions;
export default favoritesSlice.reducer;