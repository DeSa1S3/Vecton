import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginRequest, RegisterRequest } from '../../types';
import { authApi } from '../../services/api';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { tokenManager } from '../../services/api/tokenmanager';
import toast from 'react-hot-toast';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    accessToken: tokenManager.getAccessToken(),
    refreshToken: tokenManager.getRefreshToken(),
    isLoading: false,
    error: null,
    isAuthenticated: !!tokenManager.getAccessToken(),
};

interface AuthResponse {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

interface MessageResponse {
    message: string;
}

export const login = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Ошибка входа');
        }
    }
);

export const register = createAsyncThunk<AuthResponse, RegisterRequest, { rejectValue: string }>(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authApi.register(userData);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Ошибка регистрации');
        }
    }
);

export const getMe = createAsyncThunk<User, void, { rejectValue: string }>(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getMe();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.detail);
        }
    }
);

export const updateProfile = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
    'auth/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authApi.updateMe(userData);
            toast.success('Профиль обновлен');
            return response;
        } catch (error: any) {
            toast.error('Ошибка обновления профиля');
            return rejectWithValue(error.detail);
        }
    }
);

export const changePassword = createAsyncThunk<MessageResponse, any, { rejectValue: string }>(
    'auth/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await authApi.changePassword(passwordData);
            toast.success('Пароль изменен');
            return response;
        } catch (error: any) {
            toast.error('Ошибка изменения пароля');
            return rejectWithValue(error.detail);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state: AuthState) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            tokenManager.clearTokens();
            localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
            toast.success('Выход выполнен');
        },
        refreshToken: (state: AuthState, action: PayloadAction<{ access: string }>) => {
            state.accessToken = action.payload.access;
            tokenManager.setTokens(action.payload.access);
        },
        clearError: (state: AuthState) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state: AuthState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state: AuthState, action: PayloadAction<AuthResponse>) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.tokens.access;
                state.refreshToken = action.payload.tokens.refresh;
                state.isAuthenticated = true;

                tokenManager.setTokens(action.payload.tokens.access, action.payload.tokens.refresh);
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(action.payload.user));

                toast.success('Вход выполнен успешно');
            })
            .addCase(login.rejected, (state: AuthState, action: PayloadAction<string | undefined>) => {
                state.isLoading = false;
                state.error = action.payload || 'Ошибка входа';
                toast.error(action.payload || 'Ошибка входа');
            })

            // Register
            .addCase(register.pending, (state: AuthState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state: AuthState, action: PayloadAction<AuthResponse>) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.tokens.access;
                state.refreshToken = action.payload.tokens.refresh;
                state.isAuthenticated = true;

                tokenManager.setTokens(action.payload.tokens.access, action.payload.tokens.refresh);
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(action.payload.user));

                toast.success('Регистрация успешна');
            })
            .addCase(register.rejected, (state: AuthState, action: PayloadAction<string | undefined>) => {
                state.isLoading = false;
                state.error = action.payload || 'Ошибка регистрации';
                toast.error(action.payload || 'Ошибка регистрации');
            })

            // Get Me
            .addCase(getMe.pending, (state: AuthState) => {
                state.isLoading = true;
            })
            .addCase(getMe.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(action.payload));
            })
            .addCase(getMe.rejected, (state: AuthState) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;

                tokenManager.clearTokens();
                localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
            })

            // Update Profile
            .addCase(updateProfile.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
                state.user = action.payload;
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(action.payload));
            });
    },
});

export const { logout, refreshToken, clearError } = authSlice.actions;
export default authSlice.reducer;