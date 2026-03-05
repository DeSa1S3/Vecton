import { apiClient } from './apiClients';
import { DashboardStats, PopularCar, RecentOrder, RevenueStats } from '../../types/dashboard.types';
import { API_ENDPOINTS } from '../../utils/constants';

export const dashboardApi = {
    getStats: () =>
        apiClient.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS),

    getPopularCars: (limit?: number) => {
        const query = limit ? `?limit=${limit}` : '';
        return apiClient.get<PopularCar[]>(`${API_ENDPOINTS.DASHBOARD.POPULAR_CARS}${query}`);
    },

    getRecentOrders: (limit?: number) => {
        const query = limit ? `?limit=${limit}` : '';
        return apiClient.get<RecentOrder[]>(`${API_ENDPOINTS.DASHBOARD.RECENT_ORDERS}${query}`);
    },

    getRevenue: (period: 'day' | 'week' | 'month' | 'year' = 'month') =>
        apiClient.get<RevenueStats>(`${API_ENDPOINTS.DASHBOARD.REVENUE}?period=${period}`),
};