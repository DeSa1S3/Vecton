import { OrderStatus, OrderType } from "./order.types";

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface ApiError {
    status_code?: number;
    error?: string;
    detail?: string;
    [key: string]: any;
}

export interface DashboardStats {
    cars: {
        total: number;
        in_stock: number;
        sold: number;
        reserved: number;
        added_today: number;
        added_week: number;
        added_month: number;
        total_views: number;
    };
    orders: {
        total: number;
        new: number;
        in_progress: number;
        completed: number;
        cancelled: number;
        today: number;
        week: number;
        month: number;
    };
    users: {
        total: number;
        clients: number;
        managers: number;
        new_today: number;
        new_week: number;
        new_month: number;
    };
}

export interface PopularCar {
    id: number;
    brand: string;
    model: string;
    year: number;
    orders_count: number;
    views_count: number;
}

export interface RecentOrder {
    id: number;
    user: {
        id: number;
        full_name: string;
        email: string;
    };
    car: {
        id: number;
        brand: string;
        model: string;
        year: number;
    };
    order_type: OrderType;
    status: OrderStatus;
    total_price: number | null;
    created_at: string;
}

export interface RevenueStats {
    total_revenue: number;
    avg_order_value: number;
    orders_count: number;
    period: string;
    start_date: string;
    end_date: string;
}