export const tokenManager = {
    getAccessToken: (): string | null => {
        return localStorage.getItem('accessToken');
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem('refreshToken');
    },

    setTokens: (access: string, refresh?: string) => {
        localStorage.setItem('accessToken', access);
        if (refresh) {
            localStorage.setItem('refreshToken', refresh);
        }
    },

    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    // Для обратной совместимости
    getAuthHeader: (): Record<string, string> => {
        const token = localStorage.getItem('accessToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
};
