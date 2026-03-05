import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosResponse
} from 'axios';
import { ApiError } from '../../types/api.types';
import { store } from '../../store';
import { logout, refreshToken } from '../../store/slices/authSlice';
import { API_ENDPOINTS } from '../../utils/constants';

class ApiClient {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = store.getState().auth.accessToken;
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: AxiosError) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError<ApiError>) => {
                const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshTokenValue = store.getState().auth.refreshToken;
                        const baseURL = process.env.REACT_APP_API_URL;

                        const response = await axios.post(
                            `${baseURL}${API_ENDPOINTS.AUTH.REFRESH}`,
                            { refresh: refreshTokenValue }
                        );

                        store.dispatch(refreshToken(response.data));

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        }

                        return this.instance(originalRequest);
                    } catch (refreshError) {
                        store.dispatch(logout());
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error.response?.data || error);
            }
        );
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.get<T>(url, config);
        return response.data;
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.post<T>(url, data, config);
        return response.data;
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.put<T>(url, data, config);
        return response.data;
    }

    public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.patch<T>(url, data, config);
        return response.data;
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.delete<T>(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();