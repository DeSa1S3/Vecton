import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardApi } from '../../services/api';
import {
    DashboardStats,
    PopularCar,
    RecentOrder,
    RevenueStats,
    DashboardState
} from '../../types/dashboard.types';
import toast from 'react-hot-toast';

const initialState: DashboardState = {
    stats: null,
    popularCars: [],
    recentOrders: [],
    revenue: null,
    isLoading: false,
    error: null,
};

export const fetchStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dashboardApi.getStats();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Ошибка загрузки статистики');
        }
    }
);

export const fetchPopularCars = createAsyncThunk(
    'dashboard/fetchPopularCars',
    async (limit: number = 10, { rejectWithValue }) => {
        try {
            const response = await dashboardApi.getPopularCars(limit);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Ошибка загрузки популярных автомобилей');
        }
    }
);

export const fetchRecentOrders = createAsyncThunk(
    'dashboard/fetchRecentOrders',
    async (limit: number = 10, { rejectWithValue }) => {
        try {
            const response = await dashboardApi.getRecentOrders(limit);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Ошибка загрузки последних заказов');
        }
    }
);

export const fetchRevenue = createAsyncThunk(
    'dashboard/fetchRevenue',
    async (period: 'day' | 'week' | 'month' | 'year' = 'month', { rejectWithValue }) => {
        try {
            const response = await dashboardApi.getRevenue(period);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Ошибка загрузки данных о выручке');
        }
    }
);

export const refreshDashboard = createAsyncThunk(
    'dashboard/refreshDashboard',
    async (_, { dispatch }) => {
        await Promise.all([
            dispatch(fetchStats()),
            dispatch(fetchPopularCars(5)),
            dispatch(fetchRecentOrders(10)),
            dispatch(fetchRevenue('month'))
        ]);
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        },
        resetDashboard: () => initialState,
        updateStats: (state, action: PayloadAction<Partial<DashboardStats>>) => {
            if (state.stats) {
                state.stats = { ...state.stats, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchStats.fulfilled, (state, action: PayloadAction<DashboardStats>) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })

            .addCase(fetchPopularCars.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPopularCars.fulfilled, (state, action: PayloadAction<PopularCar[]>) => {
                state.isLoading = false;
                state.popularCars = action.payload;
            })
            .addCase(fetchPopularCars.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchRecentOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRecentOrders.fulfilled, (state, action: PayloadAction<RecentOrder[]>) => {
                state.isLoading = false;
                state.recentOrders = action.payload;
            })
            .addCase(fetchRecentOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchRevenue.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRevenue.fulfilled, (state, action: PayloadAction<RevenueStats>) => {
                state.isLoading = false;
                state.revenue = action.payload;
            })
            .addCase(fetchRevenue.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearDashboardError, resetDashboard, updateStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;