import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetModelsQuery } from '../../../../store/api/carsApi'
import { Button } from '../../../common/Button/Button'
import { Input } from '../../../common/Input/Input'
import {
    CAR_BODY_TYPES,
    CAR_TRANSMISSIONS,
    CAR_DRIVES,
    CAR_FUEL_TYPES,
    PRICE_RANGES,
    YEAR_RANGES
} from '../../../../utils/constants'
import styles from './FilterSidebar.module.scss'

interface FilterSidebarProps {
    brands: Array<{ id: number; name: string; logo?: string }>
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ brands }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedBrand, setSelectedBrand] = useState<string>('')
    const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({})
    const [yearRange, setYearRange] = useState<{ min?: number; max?: number }>({})
    const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([])
    const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([])
    const [selectedDrives, setSelectedDrives] = useState<string[]>([])
    const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([])

    const { data: models } = useGetModelsQuery(
        { brand: selectedBrand ? Number(selectedBrand) : undefined },
        { skip: !selectedBrand }
    )

    useEffect(() => {
        const brands = searchParams.getAll('brand')
        if (brands.length > 0) {
            setSelectedBrand(brands[0])
        }

        const priceMin = searchParams.get('price_min')
        const priceMax = searchParams.get('price_max')
        if (priceMin || priceMax) {
            setPriceRange({
                min: priceMin ? Number(priceMin) : undefined,
                max: priceMax ? Number(priceMax) : undefined,
            })
        }

        const yearMin = searchParams.get('year_min')
        const yearMax = searchParams.get('year_max')
        if (yearMin || yearMax) {
            setYearRange({
                min: yearMin ? Number(yearMin) : undefined,
                max: yearMax ? Number(yearMax) : undefined,
            })
        }

        setSelectedBodyTypes(searchParams.getAll('body_type'))
        setSelectedTransmissions(searchParams.getAll('transmission'))
        setSelectedDrives(searchParams.getAll('drive'))
        setSelectedFuelTypes(searchParams.getAll('fuel_type'))
    }, [searchParams])

    const handleBrandChange = (brandName: string) => {
        setSelectedBrand(brandName)
        updateFilters('brand', brandName ? [brandName] : [])
    }

    const handleModelChange = (model: string) => {
        updateFilters('model', model ? [model] : [])
    }

    const handlePriceRangeChange = (min?: number, max?: number) => {
        setPriceRange({ min, max })

        const params = new URLSearchParams(searchParams)
        if (min) {
            params.set('price_min', min.toString())
        } else {
            params.delete('price_min')
        }
        if (max) {
            params.set('price_max', max.toString())
        } else {
            params.delete('price_max')
        }
        params.set('page', '1')
        setSearchParams(params)
    }

    const handleYearRangeChange = (min?: number, max?: number) => {
        setYearRange({ min, max })

        const params = new URLSearchParams(searchParams)
        if (min) {
            params.set('year_min', min.toString())
        } else {
            params.delete('year_min')
        }
        if (max) {
            params.set('year_max', max.toString())
        } else {
            params.delete('year_max')
        }
        params.set('page', '1')
        setSearchParams(params)
    }

    const handleCheckboxChange = (
        value: string,
        selected: string[],
        setSelected: React.Dispatch<React.SetStateAction<string[]>>,
        paramName: string
    ) => {
        const newSelected = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value]

        setSelected(newSelected)
        updateFilters(paramName, newSelected)
    }

    const updateFilters = (param: string, values: string[]) => {
        const params = new URLSearchParams(searchParams)
        params.delete(param)
        values.forEach(v => params.append(param, v))
        params.set('page', '1')
        setSearchParams(params)
    }

    const clearAllFilters = () => {
        setSelectedBrand('')
        setPriceRange({})
        setYearRange({})
        setSelectedBodyTypes([])
        setSelectedTransmissions([])
        setSelectedDrives([])
        setSelectedFuelTypes([])
        setSearchParams({})
    }

    const activeFiltersCount =
        (selectedBrand ? 1 : 0) +
        (priceRange.min || priceRange.max ? 1 : 0) +
        (yearRange.min || yearRange.max ? 1 : 0) +
        selectedBodyTypes.length +
        selectedTransmissions.length +
        selectedDrives.length +
        selectedFuelTypes.length

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <h3 className={styles.title}>Фильтры</h3>
                {activeFiltersCount > 0 && (
                    <button className={styles.clearButton} onClick={clearAllFilters}>
                        Сбросить все ({activeFiltersCount})
                    </button>
                )}
            </div>

            <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Марка</h4>
                <select
                    className={styles.select}
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                >
                    <option value="">Все марки</option>
                    {brands.map((brand) => (
                        <option key={brand.id} value={brand.name}>
                            {brand.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedBrand && models && models.length > 0 && (
                <div className={styles.filterGroup}>
                    <h4 className={styles.filterTitle}>Модель</h4>
                    <select
                        className={styles.select}
                        onChange={(e) => handleModelChange(e.target.value)}
                        value={searchParams.get('model') || ''}
                    >
                        <option value="">Все модели</option>
                        {models.map((model) => (
                            <option key={model.id} value={model.name}>
                                {model.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Цена</h4>
                <div className={styles.rangeInputs}>
                    <Input
                        type="number"
                        placeholder="от"
                        value={priceRange.min || ''}
                        onChange={(e) => handlePriceRangeChange(
                            e.target.value ? Number(e.target.value) : undefined,
                            priceRange.max
                        )}
                    />
                    <Input
                        type="number"
                        placeholder="до"
                        value={priceRange.max || ''}
                        onChange={(e) => handlePriceRangeChange(
                            priceRange.min,
                            e.target.value ? Number(e.target.value) : undefined
                        )}
                    />
                </div>
                <div className={styles.quickRanges}>
                    {PRICE_RANGES.map((range, index) => (
                        <button
                            key={index}
                            className={styles.quickRange}
                            onClick={() => handlePriceRangeChange(range.min, range.max || undefined)}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Год выпуска</h4>
                <div className={styles.rangeInputs}>
                    <Input
                        type="number"
                        placeholder="от"
                        value={yearRange.min || ''}
                        onChange={(e) => handleYearRangeChange(
                            e.target.value ? Number(e.target.value) : undefined,
                            yearRange.max
                        )}
                    />
                    <Input
                        type="number"
                        placeholder="до"
                        value={yearRange.max || ''}
                        onChange={(e) => handleYearRangeChange(
                            yearRange.min,
                            e.target.value ? Number(e.target.value) : undefined
                        )}
                    />
                </div>
                <div className={styles.quickRanges}>
                    {YEAR_RANGES.map((range, index) => (
                        <button
                            key={index}
                            className={styles.quickRange}
                            onClick={() => handleYearRangeChange(range.min, range.max || undefined)}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Тип кузова</h4>
                <div className={styles.checkboxGroup}>
                    {CAR_BODY_TYPES.map((type) => (
                        <label key={type.value} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                value={type.value}
                                checked={selectedBodyTypes.includes(type.value)}
                                onChange={() => handleCheckboxChange(
                                    type.value,
                                    selectedBodyTypes,
                                    setSelectedBodyTypes,
                                    'body_type'
                                )}
                            />
                            <span>{type.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Коробка передач</h4>
                <div className={styles.checkboxGroup}>
                    {CAR_TRANSMISSIONS.map((transmission) => (
                        <label key={transmission.value} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                value={transmission.value}
                                checked={selectedTransmissions.includes(transmission.value)}
                                onChange={() => handleCheckboxChange(
                                    transmission.value,
                                    selectedTransmissions,
                                    setSelectedTransmissions,
                                    'transmission'
                                )}
                            />
                            <span>{transmission.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Привод</h4>
                <div className={styles.checkboxGroup}>
                    {CAR_DRIVES.map((drive) => (
                        <label key={drive.value} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                value={drive.value}
                                checked={selectedDrives.includes(drive.value)}
                                onChange={() => handleCheckboxChange(
                                    drive.value,
                                    selectedDrives,
                                    setSelectedDrives,
                                    'drive'
                                )}
                            />
                            <span>{drive.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.filterGroup}>
                <h4 className={styles.filterTitle}>Тип топлива</h4>
                <div className={styles.checkboxGroup}>
                    {CAR_FUEL_TYPES.map((fuel) => (
                        <label key={fuel.value} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                value={fuel.value}
                                checked={selectedFuelTypes.includes(fuel.value)}
                                onChange={() => handleCheckboxChange(
                                    fuel.value,
                                    selectedFuelTypes,
                                    setSelectedFuelTypes,
                                    'fuel_type'
                                )}
                            />
                            <span>{fuel.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}