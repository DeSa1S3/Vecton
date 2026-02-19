export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)
}

export const formatMileage = (mileage: number): string => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'unit',
        unit: 'kilometer',
        unitDisplay: 'short',
    }).format(mileage)
}

export const formatDate = (date: string | Date): string => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date))
}

export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`
    }
    return phone
}

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU').format(num)
}

export const formatYear = (year: number): string => {
    return `${year} год`
}

export const formatEngineVolume = (volume: number): string => {
    return `${volume.toFixed(1)} л`
}

export const formatEnginePower = (power: number): string => {
    return `${power} л.с.`
}