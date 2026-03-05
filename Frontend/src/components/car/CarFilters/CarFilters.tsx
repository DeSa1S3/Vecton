import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../store';
import { resetFilters, setFilters } from '../../../store/slices/carsSlice';
import { Input, Select, Button } from '../../common';
import { FUEL_TYPES, TRANSMISSIONS, DRIVES, BODY_TYPES } from '../../../utils/constants';
import { useDebounce } from '../../../hooks';
import styles from './CarFilters.module.scss';
import { useAppSelector } from '@/store/hooks/useAppSelectors';

export const CarFilters: React.FC = () => {
    const dispatch = useAppDispatch();
    const { filters } = useAppSelector((state: { cars: any; }) => state.cars);

    const [localFilters, setLocalFilters] = useState(filters);
    const debouncedFilters = useDebounce(localFilters, 500);

    useEffect(() => {
        dispatch(setFilters(debouncedFilters));
    }, [debouncedFilters, dispatch]);

    const handleChange = (key: string, value: any) => {
        setLocalFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
        setLocalFilters({});
    };

    return (
        <div className={styles.filters}>
            <div className={styles.header}>
                <h3>Фильтры</h3>
                <Button variant="outline" size="sm" onClick={handleReset}>
                    Сбросить
                </Button>
            </div>

            <div className={styles.section}>
                <h4>Цена</h4>
                <div className={styles.row}>
                    <Input
                        type="number"
                        placeholder="от"
                        value={localFilters.price_min || ''}
                        onChange={(e) => handleChange('price_min', e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="до"
                        value={localFilters.price_max || ''}
                        onChange={(e) => handleChange('price_max', e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <h4>Год выпуска</h4>
                <div className={styles.row}>
                    <Input
                        type="number"
                        placeholder="от"
                        value={localFilters.year_min || ''}
                        onChange={(e) => handleChange('year_min', e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="до"
                        value={localFilters.year_max || ''}
                        onChange={(e) => handleChange('year_max', e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <h4>Пробег</h4>
                <Input
                    type="number"
                    placeholder="максимальный пробег"
                    value={localFilters.mileage_max || ''}
                    onChange={(e) => handleChange('mileage_max', e.target.value)}
                />
            </div>

            <div className={styles.section}>
                <h4>Тип топлива</h4>
                <div className={styles.checkboxGroup}>
                    {Object.entries(FUEL_TYPES).map(([value, label]) => (
                        <label key={value} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                value={value}
                                checked={localFilters.fuel_type?.includes(value as any) || false}
                                onChange={(e) => {
                                    const current = localFilters.fuel_type || [];
                                    const newValue = e.target.checked
                                        ? [...current, value]
                                        : current.filter((v: string) => v !== value);
                                    handleChange('fuel_type', newValue);
                                }}
                            />
                            {label}
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4>Коробка передач</h4>
                <div className={styles.checkboxGroup}>
                    {Object.entries(TRANSMISSIONS).map(([value, label]) => (
                        <label key={value} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                value={value}
                                checked={localFilters.transmission?.includes(value as any) || false}
                                onChange={(e) => {
                                    const current = localFilters.transmission || [];
                                    const newValue = e.target.checked
                                        ? [...current, value]
                                        : current.filter((v: string) => v !== value);
                                    handleChange('transmission', newValue);
                                }}
                            />
                            {label}
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4>Привод</h4>
                <div className={styles.checkboxGroup}>
                    {Object.entries(DRIVES).map(([value, label]) => (
                        <label key={value} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                value={value}
                                checked={localFilters.drive?.includes(value as any) || false}
                                onChange={(e) => {
                                    const current = localFilters.drive || [];
                                    const newValue = e.target.checked
                                        ? [...current, value]
                                        : current.filter((v: string) => v !== value);
                                    handleChange('drive', newValue);
                                }}
                            />
                            {label}
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4>Тип кузова</h4>
                <div className={styles.checkboxGroup}>
                    {Object.entries(BODY_TYPES).map(([value, label]) => (
                        <label key={value} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                value={value}
                                checked={localFilters.body_type?.includes(value as any) || false}
                                onChange={(e) => {
                                    const current = localFilters.body_type || [];
                                    const newValue = e.target.checked
                                        ? [...current, value]
                                        : current.filter((v: string) => v !== value);
                                    handleChange('body_type', newValue);
                                }}
                            />
                            {label}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};