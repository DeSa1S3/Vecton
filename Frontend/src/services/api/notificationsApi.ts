import { apiClient } from './apiClients';
import {
    Notification,
    NotificationMarkReadResponse,
    NotificationFilters,
    NotificationStats
} from '../../types/notification.types';
import { API_ENDPOINTS } from '../../utils/constants';
import { getQueryString } from '../../utils/helpers';

export const notificationsApi = {
    getNotifications: (params?: NotificationFilters) => {
        const query = params ? `?${getQueryString(params)}` : '';
        return apiClient.get<Notification[]>(`${API_ENDPOINTS.NOTIFICATIONS.LIST}${query}`);
    },

    getNotification: (id: number) =>
        apiClient.get<Notification>(`${API_ENDPOINTS.NOTIFICATIONS.LIST}${id}/`),

    markAsRead: (notificationIds?: number[]) =>
        apiClient.post<NotificationMarkReadResponse>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ, {
            notification_ids: notificationIds,
            mark_all: !notificationIds
        }),

    markAllAsRead: () =>
        apiClient.post<NotificationMarkReadResponse>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ, {
            mark_all: true
        }),

    deleteNotification: (id: number) =>
        apiClient.delete<void>(`${API_ENDPOINTS.NOTIFICATIONS.LIST}${id}/`),

    deleteReadNotifications: () =>
        apiClient.delete<{ message: string }>(`${API_ENDPOINTS.NOTIFICATIONS.LIST}delete_read/`),

    getNotificationStats: () =>
        apiClient.get<NotificationStats>(`${API_ENDPOINTS.NOTIFICATIONS.LIST}stats/`),
};