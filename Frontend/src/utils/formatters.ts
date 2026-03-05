export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

export const formatMileage = (mileage: number | null): string => {
    if (!mileage) return 'Новый';
    return new Intl.NumberFormat('ru-RU').format(mileage) + ' км';
};

export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return phone;
};

export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = format === 'short'
        ? { day: '2-digit', month: '2-digit', year: 'numeric' }
        : { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };

    return new Intl.DateTimeFormat('ru-RU', options).format(d);
};

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU').format(num);
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const truncateText = (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
};

export const capitalizeFirst = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};