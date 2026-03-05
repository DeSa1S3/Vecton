import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Car, CarFilters } from '../../types';
import { carsApi } from '../../services/api';
import { PaginatedResponse } from '@/types/api.types';

interface CarsState {
    cars: Car[];
    currentCar: Car | null;
    similarCars: Car[];
    totalCount: number;
    isLoading: boolean;
    error: string | null;
    filters: CarFilters;
    pagination: {
        page: number;
        pageSize: number;
    };
    sort: string;
}

const initialState: CarsState = {
    cars: [],
    currentCar: null,
    similarCars: [],
    totalCount: 0,
    isLoading: false,
    error: null,
    filters: {},
    pagination: {
        page: 1,
        pageSize: 12,
    },
    sort: '-created_at',
};

interface FetchCarsParams {
    page?: number;
    pageSize?: number;
    filters?: CarFilters;
    sort?: string;
}

interface UpdateCarParams {
    id: number;
    data: any;
}

export const fetchCars = createAsyncThunk<PaginatedResponse<Car>, FetchCarsParams | undefined>(
    'cars/fetchCars',
    async (params) => {
        const response = await carsApi.getCars({
            page: params?.page,
            page_size: params?.pageSize,
            ...params?.filters,
        });
        return response;
    }
);

export const fetchCarById = createAsyncThunk<Car, number>(
    'cars/fetchCarById',
    async (id) => {
        const response = await carsApi.getCar(id);
        return response;
    }
);

export const fetchSimilarCars = createAsyncThunk<Car[], number>(
    'cars/fetchSimilarCars',
    async (id) => {
        const response = await carsApi.getSimilar(id);
        return response;
    }
);

export const createCar = createAsyncThunk<Car, any>(
    'cars/createCar',
    async (carData) => {
        const response = await carsApi.createCar(carData);
        return response;
    }
);

export const updateCar = createAsyncThunk<Car, UpdateCarParams>(
    'cars/updateCar',
    async ({ id, data }) => {
        const response = await carsApi.updateCar(id, data);
        return response;
    }
);

export const deleteCar = createAsyncThunk<number, number>(
    'cars/deleteCar',
    async (id) => {
        await carsApi.deleteCar(id);
        return id;
    }
);

const carsSlice = createSlice({
    name: 'cars',
    initialState,
    reducers: {
        setFilters: (state: CarsState, action: PayloadAction<CarFilters>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 1;
        },
        resetFilters: (state: CarsState) => {
            state.filters = {};
            state.pagination.page = 1;
        },
        setPage: (state: CarsState, action: PayloadAction<number>) => {
            state.pagination.page = action.payload;
        },
        setSort: (state: CarsState, action: PayloadAction<string>) => {
            state.sort = action.payload;
        },
        clearCurrentCar: (state: CarsState) => {
            state.currentCar = null;
            state.similarCars = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCars.pending, (state: CarsState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCars.fulfilled, (state: CarsState, action: PayloadAction<PaginatedResponse<Car>>) => {
                state.isLoading = false;
                state.cars = action.payload.results;
                state.totalCount = action.payload.count;
            })
            .addCase(fetchCars.rejected, (state: CarsState, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка загрузки автомобилей';
            })

            .addCase(fetchCarById.pending, (state: CarsState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCarById.fulfilled, (state: CarsState, action: PayloadAction<Car>) => {
                state.isLoading = false;
                state.currentCar = action.payload;
            })
            .addCase(fetchCarById.rejected, (state: CarsState, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка загрузки автомобиля';
            })

            .addCase(fetchSimilarCars.fulfilled, (state: CarsState, action: PayloadAction<Car[]>) => {
                state.similarCars = action.payload;
            })

            .addCase(createCar.fulfilled, (state: CarsState, action: PayloadAction<Car>) => {
                state.cars.unshift(action.payload);
                state.totalCount += 1;
            })

            .addCase(updateCar.fulfilled, (state: CarsState, action: PayloadAction<Car>) => {
                const index = state.cars.findIndex((car) => car.id === action.payload.id);
                if (index !== -1) {
                    state.cars[index] = action.payload;
                }
                if (state.currentCar?.id === action.payload.id) {
                    state.currentCar = action.payload;
                }
            })

            .addCase(deleteCar.fulfilled, (state: CarsState, action: PayloadAction<number>) => {
                state.cars = state.cars.filter((car) => car.id !== action.payload);
                state.totalCount -= 1;
                if (state.currentCar?.id === action.payload) {
                    state.currentCar = null;
                }
            });
    },
});

export const { setFilters, resetFilters, setPage, setSort, clearCurrentCar } = carsSlice.actions;
export default carsSlice.reducer;