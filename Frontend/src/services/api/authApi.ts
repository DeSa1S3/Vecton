import { apiClient } from './apiClients';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    TokenRefreshResponse,
    ChangePasswordRequest,
    User
} from '../../types';
import { API_ENDPOINTS } from '../../utils/constants';

export const authApi = {
    login: (data: LoginRequest) =>
        apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data),

    register: (data: RegisterRequest) =>
        apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data),

    refresh: (refresh: string) =>
        apiClient.post<TokenRefreshResponse>(API_ENDPOINTS.AUTH.REFRESH, { refresh }),

    getMe: () =>
        apiClient.get<User>(API_ENDPOINTS.AUTH.ME),

    updateMe: (data: Partial<User>) =>
        apiClient.patch<User>(API_ENDPOINTS.AUTH.UPDATE_ME, data),

    changePassword: (data: ChangePasswordRequest) =>
        apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
};