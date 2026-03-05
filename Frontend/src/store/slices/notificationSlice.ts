import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notificationsApi } from '../../services/api';
import { Notification } from '../../types/notification.types';
import toast from 'react-hot-toast';

interface NotificationsState {
    items: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: NotificationsState = {
    items: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
};

interface FetchNotificationsParams {
    is_read?: boolean;
    page?: number;
}

interface MarkAsReadResponse {
    notificationIds?: number[];
    response: any;
}

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (params: FetchNotificationsParams | undefined, { rejectWithValue }) => {
        try {
            const response = await notificationsApi.getNotifications(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Ошибка загрузки уведомлений');
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationIds: number[] | undefined, { rejectWithValue }) => {
        try {
            const response = await notificationsApi.markAsRead(notificationIds);
            return { notificationIds, response };
        } catch (error: any) {
            toast.error(error.detail || 'Ошибка при обновлении уведомлений');
            return rejectWithValue(error);
        }
    }
);

export const markAsRead_v2 = createAsyncThunk(
    'notifications/markAsRead',
    async ({ notificationIds }: { notificationIds?: number[] }, { rejectWithValue }) => {
        try {
            const response = await notificationsApi.markAsRead(notificationIds);
            return { notificationIds, response };
        } catch (error: any) {
            toast.error(error.detail || 'Ошибка при обновлении уведомлений');
            return rejectWithValue(error);
        }
    }
);

export const markAllAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            const response = await notificationsApi.markAllAsRead();
            toast.success('Все уведомления отмечены как прочитанные');
            return response;
        } catch (error: any) {
            toast.error(error.detail || 'Ошибка при обновлении уведомлений');
            return rejectWithValue(error);
        }
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearNotificationsError: (state) => {
            state.error = null;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.items.unshift(action.payload);
            if (!action.payload.is_read) {
                state.unreadCount += 1;
            }
        },
        removeNotification: (state, action: PayloadAction<number>) => {
            const index = state.items.findIndex(n => n.id === action.payload);
            if (index !== -1) {
                if (!state.items[index].is_read) {
                    state.unreadCount -= 1;
                }
                state.items.splice(index, 1);
            }
        },
        resetNotifications: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
                state.unreadCount = action.payload.filter((n: Notification) => !n.is_read).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(markAsRead.fulfilled, (state, action) => {
                const { notificationIds } = action.payload;

                if (notificationIds) {
                    state.items = state.items.map(notification =>
                        notificationIds.includes(notification.id)
                            ? { ...notification, is_read: true }
                            : notification
                    );
                }

                state.unreadCount = state.items.filter(n => !n.is_read).length;
            })

            .addCase(markAllAsRead.fulfilled, (state) => {
                state.items = state.items.map(notification => ({
                    ...notification,
                    is_read: true,
                }));
                state.unreadCount = 0;
            });
    },
});

export const {
    clearNotificationsError,
    addNotification,
    removeNotification,
    resetNotifications
} = notificationsSlice.actions;

export default notificationsSlice.reducer;