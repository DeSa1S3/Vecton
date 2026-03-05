export type UserRole = 'client' | 'manager' | 'admin';
export type NotificationMethod = 'email' | 'sms' | 'telegram';

export interface User {
    id: number;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    patronymic: string;
    full_name: string;
    avatar: string | null;
    avatar_url: string | null;
    role: UserRole;
    company_name: string;
    preferred_notification: NotificationMethod;
    date_joined: string;
    last_activity: string;
    is_active: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface RegisterRequest {
    email: string;
    phone: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    patronymic?: string;
    company_name?: string;
    agreed_to_terms: boolean;
}

export interface RegisterResponse {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface TokenRefreshResponse {
    access: string;
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
    new_password2: string;
}