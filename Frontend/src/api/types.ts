// User types
export interface User {
    id: number
    email: string
    phone: string
    first_name: string
    last_name: string
    patronymic?: string
    full_name: string
    avatar?: string
    avatar_url?: string
    role: 'client' | 'manager' | 'admin'
    company_name?: string
    date_joined: string
    last_activity: string
    is_active: boolean
}

export interface Tokens {
    access: string
    refresh: string
}

// Car types
export interface CarImage {
    id: number
    image: string
    image_url: string
    is_primary: boolean
    order: number
    uploaded_at: string
}

export interface Car {
    id: number
    brand: string
    model: string
    year: number
    price: number
    formatted_price: string
    mileage?: number
    formatted_mileage?: string
    vin?: string
    color?: string
    engine_volume?: number
    engine_power?: number
    fuel_type?: string
    transmission?: string
    drive?: string
    body_type?: string
    description?: string
    equipment?: Record<string, any>
    status: 'in_stock' | 'sold' | 'reserved' | 'expected'
    views_count: number
    images: CarImage[]
    main_image?: string
    images_count: number
    created_at: string
    updated_at: string
}

export interface CarFilters {
    brand?: string[]
    model?: string
    price_min?: number
    price_max?: number
    year_min?: number
    year_max?: number
    transmission?: string[]
    drive?: string[]
    fuel_type?: string[]
    body_type?: string[]
    mileage_max?: number
    status?: string
    search?: string
    ordering?: string
    page?: number
    page_size?: number
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    total_pages: number
    current_page: number
    results: T[]
}

// Order types
export interface Order {
    id: number
    user: User
    car: Car
    assigned_to?: User
    order_type: 'test_drive' | 'purchase' | 'trade_in' | 'consultation'
    status: 'new' | 'in_progress' | 'completed' | 'cancelled'
    total_price?: number
    customer_comment?: string
    manager_comment?: string
    desired_date?: string
    created_at: string
    updated_at: string
    user_name?: string
    car_info?: string
    car_image?: string
    assigned_to_name?: string
}

export interface OrderCreate {
    car: number
    order_type: string
    customer_comment?: string
    desired_date?: string
}

// Review types
export interface Review {
    id: number
    user: number
    user_name: string
    car: number
    car_info: string
    rating: number
    comment: string
    pros?: string
    cons?: string
    is_verified: boolean
    created_at: string
}

// Favorite types
export interface Favorite {
    id: number
    user: number
    car: Car
    created_at: string
}

// Notification types
export interface Notification {
    id: number
    type: 'email' | 'sms' | 'push' | 'telegram'
    title: string
    message: string
    is_read: boolean
    data?: Record<string, any>
    created_at: string
}

// Auth types
export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    phone: string
    password: string
    password2: string
    first_name: string
    last_name: string
    patronymic?: string
    company_name?: string
    agreed_to_terms: boolean
}

export interface AuthResponse {
    user: User
    tokens: Tokens
}

// Dashboard types
export interface DashboardStats {
    cars: {
        total: number
        in_stock: number
        sold: number
        reserved: number
        added_today: number
        added_week: number
        added_month: number
        total_views: number
    }
    orders: {
        total: number
        new: number
        in_progress: number
        completed: number
        cancelled: number
        today: number
        week: number
        month: number
    }
    users: {
        total: number
        clients: number
        managers: number
        new_today: number
        new_week: number
        new_month: number
    }
}

export interface PopularCar {
    id: number
    brand: string
    model: string
    year: number
    orders_count: number
    views_count: number
}

export interface RecentOrder {
    id: number
    user: {
        id: number
        full_name: string
        email: string
    }
    car: {
        id: number
        brand: string
        model: string
        year: number
    }
    order_type: string
    status: string
    total_price?: number
    created_at: string
}

export interface RevenueStats {
    total_revenue: number
    avg_order_value: number
    orders_count: number
    period: string
    start_date: string
    end_date: string
}