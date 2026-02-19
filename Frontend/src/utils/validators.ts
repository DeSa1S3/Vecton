export const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '')
    return /^7\d{10}$/.test(cleaned)
}

export const isValidVin = (vin: string): boolean => {
    const cleaned = vin.toUpperCase().replace(/\s/g, '')
    return /^[A-HJ-NPR-Z0-9]{17}$/.test(cleaned)
}

export const isValidYear = (year: number): boolean => {
    const currentYear = new Date().getFullYear()
    return year >= 1900 && year <= currentYear + 1
}

export const isValidPrice = (price: number): boolean => {
    return price > 0 && price < 100000000
}

export const isValidMileage = (mileage: number): boolean => {
    return mileage >= 0 && mileage < 1000000
}

export const isValidRating = (rating: number): boolean => {
    return rating >= 1 && rating <= 5
}

export const isRequired = (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0
    if (typeof value === 'number') return !isNaN(value)
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined
}