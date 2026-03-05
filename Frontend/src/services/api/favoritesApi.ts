import { apiClient } from './apiClients';
import { API_ENDPOINTS } from '../../utils/constants';
import { getQueryString } from '../../utils/helpers';
import { Car } from '@/types/car.types';

export interface Favorite {
    id: number;
    user: number;
    car: Car;
    created_at: string;
}

export const favoritesApi = {
    getFavorites: () =>
        apiClient.get<Favorite[]>(API_ENDPOINTS.FAVORITES.LIST),

    addToFavorites: (carId: number) =>
        apiClient.post<Favorite>(API_ENDPOINTS.FAVORITES.LIST, { car: carId }),

    removeFromFavorites: (id: number) =>
        apiClient.delete<void>(`${API_ENDPOINTS.FAVORITES.LIST}${id}/`),

    checkFavorite: (carId: number) =>
        apiClient.get<{ in_favorites: boolean }>(
            `${API_ENDPOINTS.FAVORITES.CHECK}?car_id=${carId}`
        ),

    clearFavorites: () =>
        apiClient.delete<{ message: string }>(API_ENDPOINTS.FAVORITES.CLEAR),
};