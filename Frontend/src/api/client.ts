import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { store } from '../store'
import { logout, refreshToken } from '../store/slices/authSlice.ts'
import Cookies from 'js-cookie'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

class ApiClient {
    private instance: AxiosInstance

    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        this.instance.interceptors.request.use(
            (config: CustomAxiosRequestConfig) => {
                const token = store.getState().auth.tokens?.access
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }

                if (config.method && !['get', 'head', 'options'].includes(config.method)) {
                    const csrfToken = Cookies.get('csrftoken')
                    if (csrfToken) {
                        config.headers['X-CSRFToken'] = csrfToken
                    }
                }

                return config
            },
            (error) => Promise.reject(error)
        )

        // Response interceptor
        this.instance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as CustomAxiosRequestConfig

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true

                    try {
                        const refreshTokenValue = store.getState().auth.tokens?.refresh
                        if (!refreshTokenValue) {
                            throw new Error('No refresh token')
                        }

                        const response = await this.instance.post('/auth/refresh/', {
                            refresh: refreshTokenValue,
                        })

                        const { access } = response.data
                        store.dispatch(refreshToken(access))

                        originalRequest.headers.Authorization = `Bearer ${access}`
                        return this.instance(originalRequest)
                    } catch (refreshError) {
                        store.dispatch(logout())
                        window.location.href = '/login'
                        return Promise.reject(refreshError)
                    }
                }

                return Promise.reject(error)
            }
        )
    }

    get instance() {
        return this.instance
    }
}

export const apiClient = new ApiClient().instance