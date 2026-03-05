import { apiClient } from './apiClients';
import {
    Order,
    OrderDetail,
    OrderCreateData,
    Review,
} from '../../types';
import { API_ENDPOINTS } from '../../utils/constants';
import { getQueryString } from '../../utils/helpers';
import { PaginatedResponse } from '@/types/api.types';

export const ordersApi = {
    getOrders: (params?: { page?: number; page_size?: number }) => {
        const query = params ? `?${getQueryString(params)}` : '';
        return apiClient.get<PaginatedResponse<Order>>(`${API_ENDPOINTS.ORDERS.LIST}${query}`);
    },

    getOrder: (id: number) =>
        apiClient.get<OrderDetail>(API_ENDPOINTS.ORDERS.DETAIL(id)),

    createOrder: (data: OrderCreateData) =>
        apiClient.post<Order>(API_ENDPOINTS.ORDERS.LIST, data),

    cancelOrder: (id: number) =>
        apiClient.post<{ status: string }>(API_ENDPOINTS.ORDERS.CANCEL(id)),

    addReview: (id: number, data: Partial<Review>) =>
        apiClient.post<Review>(API_ENDPOINTS.ORDERS.ADD_REVIEW(id), data),

    getStatistics: () =>
        apiClient.get<any>(API_ENDPOINTS.ORDERS.STATISTICS),
};