import { Car, CarFilters } from '../types';
import { formatPrice } from './formatters';

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean = false;
    let lastRan: number;
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: any, ...args: Parameters<T>) {
        const context = this;

        if (!inThrottle) {
            func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;

            timeout = setTimeout(() => {
                inThrottle = false;
            }, limit);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, Math.max(limit - (Date.now() - lastRan), 0));
        }
    };
};

export const throttleSimple = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let waiting = false;

    return (...args: Parameters<T>) => {
        if (!waiting) {
            func(...args);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
};

export const getQueryString = (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                value.forEach(v => searchParams.append(key, v));
            } else {
                searchParams.append(key, value.toString());
            }
        }
    });

    return searchParams.toString();
};

export const parseQueryString = (search: string): Record<string, any> => {
    const params = new URLSearchParams(search);
    const result: Record<string, any> = {};

    params.forEach((value, key) => {
        if (result[key]) {
            if (!Array.isArray(result[key])) {
                result[key] = [result[key]];
            }
            result[key].push(value);
        } else {
            result[key] = value;
        }
    });

    return result;
};

export const getCarTitle = (car: Car): string => {
    return `${car.brand} ${car.model}, ${car.year}`;
};

export const getCarPriceRange = (min?: number, max?: number): string => {
    if (min && max) return `${formatPrice(min)} - ${formatPrice(max)}`;
    if (min) return `от ${formatPrice(min)}`;
    if (max) return `до ${formatPrice(max)}`;
    return 'Любая';
};

export const getActiveFiltersCount = (filters: CarFilters): number => {
    return Object.values(filters).filter(value => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== undefined && value !== null && value !== '';
    }).length;
};

export const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
};

export const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.detail) return error.detail;
    if (error?.error) return error.error;
    return 'Произошла ошибка';
};

export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export const pluralize = (count: number, singular: string, plural: string): string => {
    return count === 1 ? singular : plural;
};

export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({ top: 0, behavior });
};

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};