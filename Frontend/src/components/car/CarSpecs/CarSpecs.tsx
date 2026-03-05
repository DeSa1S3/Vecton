import React from 'react';
import { Car } from '../../../types';
import {
    FUEL_TYPES,
    TRANSMISSIONS,
    DRIVES,
    BODY_TYPES,
} from '../../../utils/constants';
import styles from './CarSpecs.module.scss';

interface CarSpecsProps {
    car: Car;
}

export const CarSpecs: React.FC<CarSpecsProps> = ({ car }) => {
    const specs = [
        { label: 'Марка', value: car.brand },
        { label: 'Модель', value: car.model },
        { label: 'Год выпуска', value: car.year },
        { label: 'Цвет', value: car.color || '—' },
        { label: 'Тип топлива', value: car.fuel_type ? FUEL_TYPES[car.fuel_type] : '—' },
        { label: 'Объем двигателя', value: car.engine_volume ? `${car.engine_volume} л` : '—' },
        { label: 'Мощность', value: car.engine_power ? `${car.engine_power} л.с.` : '—' },
        { label: 'Коробка передач', value: car.transmission ? TRANSMISSIONS[car.transmission] : '—' },
        { label: 'Привод', value: car.drive ? DRIVES[car.drive] : '—' },
        { label: 'Тип кузова', value: car.body_type ? BODY_TYPES[car.body_type] : '—' },
        { label: 'VIN', value: car.vin || '—' },
    ];

    return (
        <div className={styles.specs}>
            <h3>Характеристики</h3>
            <div className={styles.grid}>
                {specs.map((spec) => (
                    <div key={spec.label} className={styles.spec}>
                        <span className={styles.label}>{spec.label}:</span>
                        <span className={styles.value}>{spec.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};