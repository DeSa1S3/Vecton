export type NotificationType = 'email' | 'sms' | 'push' | 'telegram';

export interface Notification {
    id: number;
    user: number;
    type: NotificationType;
    title: string;
    message: string;
    is_read: boolean;
    data: NotificationData;
    created_at: string;
    sent_at?: string | null;
}

export interface NotificationData {
    order_id?: number;
    car_id?: number;
    user_id?: number;
    [key: string]: any;
}

export interface NotificationCreateData {
    user: number;
    type: NotificationType;
    title: string;
    message: string;
    data?: NotificationData;
}

export interface NotificationMarkReadData {
    notification_ids?: number[];
    mark_all?: boolean;
}

export interface NotificationMarkReadResponse {
    message: string;
    count?: number;
}

export interface NotificationState {
    items: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
}

export interface NotificationFilters {
    is_read?: boolean;
    page?: number;
    page_size?: number;
}

export interface NotificationStats {
    total: number;
    unread: number;
    by_type: Record<NotificationType, number>;
}