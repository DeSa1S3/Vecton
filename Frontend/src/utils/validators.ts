export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'));
};

export const validateVin = (vin: string): boolean => {
    const re = /^[A-HJ-NPR-Z0-9]{17}$/i;
    return re.test(vin);
};

export const validatePrice = (price: number): boolean => {
    return price > 0 && price <= 100000000;
};

export const validateYear = (year: number): boolean => {
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear + 1;
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 8;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
};

export const validateRequired = (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return true;
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
};

export const validateUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const validateImageFile = (file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } => {
    const maxSize = maxSizeMB * 1024 * 1024;

    if (file.size > maxSize) {
        return { valid: false, error: `Размер файла не должен превышать ${maxSizeMB} МБ` };
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Допустимы только JPEG, PNG и WebP' };
    }

    return { valid: true };
};