import { useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from './useDebounce'
import { CarFilters } from '../api/types'

const initialFilters: CarFilters = {
    brand: [],
    price_min: undefined,
    price_max: undefined,
    year_min: undefined,
    year_max: undefined,
    transmission: [],
    drive: [],
    fuel_type: [],
    body_type: [],
    mileage_max: undefined,
}

export const useFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState<CarFilters>(() => {
        const fromUrl: CarFilters = {}

        // Parse URL params
        const brands = searchParams.getAll('brand')
        if (brands.length) fromUrl.brand = brands

        const price_min = searchParams.get('price_min')
        if (price_min) fromUrl.price_min = Number(price_min)

        const price_max = searchParams.get('price_max')
        if (price_max) fromUrl.price_max = Number(price_max)

        const year_min = searchParams.get('year_min')
        if (year_min) fromUrl.year_min = Number(year_min)

        const year_max = searchParams.get('year_max')
        if (year_max) fromUrl.year_max = Number(year_max)

        const transmissions = searchParams.getAll('transmission')
        if (transmissions.length) fromUrl.transmission = transmissions

        return { ...initialFilters, ...fromUrl }
    })

    const debouncedFilters = useDebounce(filters, 500)

    const setFilter = useCallback(<K extends keyof CarFilters>(
        key: K,
        value: CarFilters[K]
    ) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }, [])

    const clearFilters = useCallback(() => {
        setFilters(initialFilters)
        setSearchParams({})
    }, [setSearchParams])

    const removeFilter = useCallback((key: keyof CarFilters) => {
        setFilters(prev => {
            const newFilters = { ...prev }
            delete newFilters[key]
            return newFilters
        })
    }, [])

    const syncFiltersWithUrl = useCallback(() => {
        const params: Record<string, string> = {}

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => {
                        params[`${key}`] = v
                    })
                } else {
                    params[key] = value.toString()
                }
            }
        })

        setSearchParams(params, { replace: true })
    }, [filters, setSearchParams])

    const activeFiltersCount = useMemo(() => {
        let count = 0
        if (filters.brand?.length) count += 1
        if (filters.price_min || filters.price_max) count += 1
        if (filters.year_min || filters.year_max) count += 1
        if (filters.transmission?.length) count += 1
        if (filters.drive?.length) count += 1
        if (filters.fuel_type?.length) count += 1
        if (filters.body_type?.length) count += 1
        if (filters.mileage_max) count += 1
        return count
    }, [filters])

    return {
        filters,
        setFilter,
        clearFilters,
        removeFilter,
        syncFiltersWithUrl,
        activeFiltersCount,
        debouncedFilters,
    }
}