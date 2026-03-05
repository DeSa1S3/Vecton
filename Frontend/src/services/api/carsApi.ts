import { apiClient } from './apiClients';
import {
    Car,
    CarFilters,
    CarCreateData,
    Brand,
    CarModel,
    CarImage
} from '../../types';
import { API_ENDPOINTS } from '../../utils/constants';
import { getQueryString } from '../../utils/helpers';
import { PaginatedResponse } from '@/types/api.types';

export const carsApi = {
    getCars: (params?: CarFilters & { page?: number; page_size?: number }) => {
        const query = params ? `?${getQueryString(params)}` : '';
        return apiClient.get<PaginatedResponse<Car>>(`${API_ENDPOINTS.CARS.LIST}${query}`);
    },

    getCar: (id: number) =>
        apiClient.get<Car>(API_ENDPOINTS.CARS.DETAIL(id)),

    getSimilar: (id: number) =>
        apiClient.get<Car[]>(API_ENDPOINTS.CARS.SIMILAR(id)),

    createCar: (data: CarCreateData) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'images' && Array.isArray(value)) {
                    value.forEach(file => formData.append('images', file));
                } else if (typeof value === 'object' && !(value instanceof File)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        return apiClient.post<Car>(API_ENDPOINTS.CARS.LIST, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    updateCar: (id: number, data: Partial<CarCreateData>) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'images' && Array.isArray(value)) {
                    value.forEach(file => formData.append('images', file));
                } else if (typeof value === 'object' && !(value instanceof File)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        return apiClient.put<Car>(API_ENDPOINTS.CARS.DETAIL(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    deleteCar: (id: number) =>
        apiClient.delete<void>(API_ENDPOINTS.CARS.DETAIL(id)),

    incrementViews: (id: number) =>
        apiClient.post<{ views_count: number }>(API_ENDPOINTS.CARS.INCREMENT_VIEWS(id)),

    uploadImages: (id: number, images: File[]) => {
        const formData = new FormData();
        images.forEach(file => formData.append('images', file));

        return apiClient.post<CarImage[]>(API_ENDPOINTS.CARS.UPLOAD_IMAGES(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getBrands: () =>
        apiClient.get<Brand[]>('/brands/'),

    getModels: (brandId?: number) => {
        const query = brandId ? `?brand=${brandId}` : '';
        return apiClient.get<CarModel[]>(`/models/${query}`);
    },
};