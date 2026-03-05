import {
    CarStatus,
    FuelType,
    Transmission,
    Drive,
    BodyType,
    OrderType,
    OrderStatus,
    UserRole
} from '../types';

export const CAR_STATUSES: Record<CarStatus, { label: string; color: string }> = {
    in_stock: { label: 'В наличии', color: '#10b981' },
    sold: { label: 'Продан', color: '#ef4444' },
    reserved: { label: 'В резерве', color: '#f59e0b' },
    expected: { label: 'Ожидается', color: '#3b82f6' }
};

export const FUEL_TYPES: Record<FuelType, string> = {
    petrol: 'Бензин',
    diesel: 'Дизель',
    electric: 'Электро',
    hybrid: 'Гибрид'
};

export const TRANSMISSIONS: Record<Transmission, string> = {
    automatic: 'Автомат',
    manual: 'Механика',
    robot: 'Робот'
};

export const DRIVES: Record<Drive, string> = {
    front: 'Передний',
    rear: 'Задний',
    awd: 'Полный (постоянный)',
    '4wd': 'Подключаемый полный'
};

export const BODY_TYPES: Record<BodyType, string> = {
    sedan: 'Седан',
    hatchback: 'Хэтчбек',
    suv: 'Внедорожник',
    coupe: 'Купе',
    wagon: 'Универсал',
    minivan: 'Минивэн',
    pickup: 'Пикап',
    van: 'Фургон',
    cabrio: 'Кабриолет'
};

export const ORDER_TYPES: Record<OrderType, string> = {
    test_drive: 'Тест-драйв',
    purchase: 'Покупка',
    trade_in: 'Trade-in',
    consultation: 'Консультация'
};

export const ORDER_STATUSES: Record<OrderStatus, { label: string; color: string }> = {
    new: { label: 'Новая', color: '#3b82f6' },
    in_progress: { label: 'В обработке', color: '#f59e0b' },
    completed: { label: 'Завершена', color: '#10b981' },
    cancelled: { label: 'Отменена', color: '#ef4444' }
};

export const USER_ROLES: Record<UserRole, string> = {
    client: 'Клиент',
    manager: 'Менеджер',
    admin: 'Администратор'
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login/',
        REGISTER: '/auth/register/',
        REFRESH: '/auth/refresh/',
        ME: '/auth/me/',
        UPDATE_ME: '/auth/update_me/',
        CHANGE_PASSWORD: '/auth/change_password/'
    },
    CARS: {
        LIST: '/cars/',
        DETAIL: (id: number) => `/cars/${id}/`,
        SIMILAR: (id: number) => `/cars/${id}/similar/`,
        INCREMENT_VIEWS: (id: number) => `/cars/${id}/increment_views/`,
        UPLOAD_IMAGES: (id: number) => `/cars/${id}/images/`
    },
    ORDERS: {
        LIST: '/orders/',
        DETAIL: (id: number) => `/orders/${id}/`,
        CANCEL: (id: number) => `/orders/${id}/cancel/`,
        ADD_REVIEW: (id: number) => `/orders/${id}/add_review/`,
        STATISTICS: '/orders/statistics/'
    },
    FAVORITES: {
        LIST: '/favorites/',
        CHECK: '/favorites/check/',
        CLEAR: '/favorites/clear/'
    },
    NOTIFICATIONS: {
        LIST: '/notifications/',
        MARK_READ: '/notifications/mark_read/'
    },
    DASHBOARD: {
        STATS: '/dashboard/stats/',
        POPULAR_CARS: '/dashboard/popular-cars/',
        RECENT_ORDERS: '/dashboard/recent-orders/',
        REVENUE: '/dashboard/revenue/'
    }
} as const;

export const LOCAL_STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user'
} as const;