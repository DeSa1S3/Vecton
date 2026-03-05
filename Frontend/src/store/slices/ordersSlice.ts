import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ordersApi } from '../../services/api';
import {
    Order,
    OrderDetail,
    OrderCreateData,
} from '../../types';
import toast from 'react-hot-toast';
import { PaginatedResponse } from '@/types/api.types';

interface OrdersState {
    items: Order[];
    currentOrder: OrderDetail | null;
    totalCount: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    items: [],
    currentOrder: null,
    totalCount: 0,
    isLoading: false,
    error: null,
};

interface FetchOrdersParams {
    page?: number;
    page_size?: number;
}

interface CancelOrderResponse {
    id: number;
    response: any;
}

interface AddReviewParams {
    id: number;
    data: any;
}

interface AddReviewResponse {
    id: number;
    review: any;
}

export const fetchOrders = createAsyncThunk<PaginatedResponse<Order>, FetchOrdersParams | undefined>(
    'orders/fetchOrders',
    async (params, { rejectWithValue }) => {
        try {
            const response = await ordersApi.getOrders(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Ошибка загрузки заказов');
        }
    }
);

export const fetchOrderById = createAsyncThunk<OrderDetail, number>(
    'orders/fetchOrderById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ordersApi.getOrder(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Ошибка загрузки заказа');
        }
    }
);

export const createOrder = createAsyncThunk<Order, OrderCreateData>(
    'orders/createOrder',
    async (data, { rejectWithValue }) => {
        try {
            const response = await ordersApi.createOrder(data);
            toast.success('Заявка успешно создана');
            return response;
        } catch (error: any) {
            const errorMessage = error.detail || 'Ошибка при создании заявки';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const cancelOrder = createAsyncThunk<CancelOrderResponse, number>(
    'orders/cancelOrder',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ordersApi.cancelOrder(id);
            toast.success('Заказ отменен');
            return { id, response };
        } catch (error: any) {
            const errorMessage = error.detail || 'Ошибка при отмене заказа';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const addReview = createAsyncThunk<AddReviewResponse, AddReviewParams>(
    'orders/addReview',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await ordersApi.addReview(id, data);
            toast.success('Спасибо за отзыв!');
            return { id, review: response };
        } catch (error: any) {
            const errorMessage = error.detail || 'Ошибка при отправке отзыва';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchOrderStatistics = createAsyncThunk<any, void>(
    'orders/fetchOrderStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await ordersApi.getStatistics();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Ошибка загрузки статистики');
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearCurrentOrder: (state: OrdersState) => {
            state.currentOrder = null;
        },
        clearOrdersError: (state: OrdersState) => {
            state.error = null;
        },
        updateOrderStatus: (state: OrdersState, action: PayloadAction<{ id: number; status: string }>) => {
            const { id, status } = action.payload;
            const order = state.items.find(o => o.id === id);
            if (order) {
                order.status = status as any;
            }
            if (state.currentOrder?.id === id) {
                state.currentOrder.status = status as any;
            }
        },
        addOrderItem: (state: OrdersState, action: PayloadAction<{ orderId: number; item: any }>) => {
            if (state.currentOrder?.id === action.payload.orderId) {
                if (!state.currentOrder.items) {
                    state.currentOrder.items = [];
                }
                state.currentOrder.items.push(action.payload.item);
            }
        },
        resetOrders: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state: OrdersState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state: OrdersState, action: PayloadAction<PaginatedResponse<Order>>) => {
                state.isLoading = false;
                state.items = action.payload.results;
                state.totalCount = action.payload.count;
            })
            .addCase(fetchOrders.rejected, (state: OrdersState, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchOrderById.pending, (state: OrdersState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state: OrdersState, action: PayloadAction<OrderDetail>) => {
                state.isLoading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state: OrdersState, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(createOrder.fulfilled, (state: OrdersState, action: PayloadAction<Order>) => {
                state.items.unshift(action.payload);
                state.totalCount += 1;
            })

            .addCase(cancelOrder.fulfilled, (state: OrdersState, action: PayloadAction<CancelOrderResponse>) => {
                const { id } = action.payload;
                const index = state.items.findIndex(order => order.id === id);
                if (index !== -1) {
                    state.items[index].status = 'cancelled';
                }
                if (state.currentOrder?.id === id) {
                    state.currentOrder.status = 'cancelled';
                }
            })

            .addCase(addReview.fulfilled, (state: OrdersState, action: PayloadAction<AddReviewResponse>) => {
                const { id, review } = action.payload;
                if (state.currentOrder?.id === id) {
                    state.currentOrder.review = review;
                }
            })
    },
});

export const {
    clearCurrentOrder,
    clearOrdersError,
    updateOrderStatus,
    addOrderItem,
    resetOrders
} = ordersSlice.actions;

export default ordersSlice.reducer;