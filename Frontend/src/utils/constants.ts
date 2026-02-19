export const CAR_BODY_TYPES = [
    { value: 'sedan', label: 'Седан' },
    { value: 'hatchback', label: 'Хэтчбек' },
    { value: 'suv', label: 'Внедорожник' },
    { value: 'coupe', label: 'Купе' },
    { value: 'wagon', label: 'Универсал' },
    { value: 'minivan', label: 'Минивэн' },
    { value: 'pickup', label: 'Пикап' },
    { value: 'van', label: 'Фургон' },
    { value: 'cabrio', label: 'Кабриолет' },
]

export const CAR_TRANSMISSIONS = [
    { value: 'automatic', label: 'Автомат' },
    { value: 'manual', label: 'Механика' },
    { value: 'robot', label: 'Робот' },
]

export const CAR_DRIVES = [
    { value: 'front', label: 'Передний' },
    { value: 'rear', label: 'Задний' },
    { value: 'awd', label: 'Полный (постоянный)' },
    { value: '4wd', label: 'Полный (подключаемый)' },
]

export const CAR_FUEL_TYPES = [
    { value: 'petrol', label: 'Бензин' },
    { value: 'diesel', label: 'Дизель' },
    { value: 'electric', label: 'Электро' },
    { value: 'hybrid', label: 'Гибрид' },
]

export const CAR_STATUSES = [
    { value: 'in_stock', label: 'В наличии', color: '#10b981' },
    { value: 'sold', label: 'Продан', color: '#ef4444' },
    { value: 'reserved', label: 'В резерве', color: '#f59e0b' },
    { value: 'expected', label: 'Ожидается', color: '#3b82f6' },
]

export const ORDER_TYPES = [
    { value: 'test_drive', label: 'Тест-драйв' },
    { value: 'purchase', label: 'Покупка' },
    { value: 'trade_in', label: 'Trade-in' },
    { value: 'consultation', label: 'Консультация' },
]

export const ORDER_STATUSES = [
    { value: 'new', label: 'Новая', color: '#3b82f6' },
    { value: 'in_progress', label: 'В обработке', color: '#f59e0b' },
    { value: 'completed', label: 'Завершена', color: '#10b981' },
    { value: 'cancelled', label: 'Отменена', color: '#ef4444' },
]

export const USER_ROLES = [
    { value: 'client', label: 'Клиент' },
    { value: 'manager', label: 'Менеджер' },
    { value: 'admin', label: 'Администратор' },
]

export const NOTIFICATION_TYPES = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push' },
    { value: 'telegram', label: 'Telegram' },
]

export const PAYMENT_METHODS = [
    { value: 'cash', label: 'Наличные' },
    { value: 'card', label: 'Карта' },
    { value: 'online', label: 'Онлайн' },
    { value: 'installment', label: 'Рассрочка' },
    { value: 'credit', label: 'Кредит' },
]

export const PAYMENT_STATUSES = [
    { value: 'pending', label: 'Ожидает', color: '#f59e0b' },
    { value: 'processing', label: 'В обработке', color: '#3b82f6' },
    { value: 'completed', label: 'Завершен', color: '#10b981' },
    { value: 'failed', label: 'Ошибка', color: '#ef4444' },
    { value: 'refunded', label: 'Возврат', color: '#6b7280' },
]

export const SORT_OPTIONS = [
    { value: '-created_at', label: 'Сначала новые' },
    { value: 'created_at', label: 'Сначала старые' },
    { value: '-price', label: 'Сначала дорогие' },
    { value: 'price', label: 'Сначала дешевые' },
    { value: '-year', label: 'Сначала новые по году' },
    { value: 'year', label: 'Сначала старые по году' },
    { value: '-views_count', label: 'По популярности' },
]

export const PRICE_RANGES = [
    { min: 0, max: 500000, label: 'до 500 000 ₽' },
    { min: 500000, max: 1000000, label: '500 000 - 1 000 000 ₽' },
    { min: 1000000, max: 1500000, label: '1 000 000 - 1 500 000 ₽' },
    { min: 1500000, max: 2000000, label: '1 500 000 - 2 000 000 ₽' },
    { min: 2000000, max: 3000000, label: '2 000 000 - 3 000 000 ₽' },
    { min: 3000000, max: 5000000, label: '3 000 000 - 5 000 000 ₽' },
    { min: 5000000, max: null, label: 'более 5 000 000 ₽' },
]

export const YEAR_RANGES = [
    { min: 2020, max: null, label: '2020 - 2025' },
    { min: 2015, max: 2019, label: '2015 - 2019' },
    { min: 2010, max: 2014, label: '2010 - 2014' },