import React from 'react'
import { type Car } from '../../../../api/types'
import {
    formatEngineVolume,
    formatEnginePower,
    formatYear
} from '../../../../utils/formatters'
import styles from './CarSpecs.module.scss'

interface CarSpecsProps {
    car: Car
}

export const CarSpecs: React.FC<CarSpecsProps> = ({ car }) => {
    const specs = [
        { label: 'Марка', value: car.brand },
        { label: 'Модель', value: car.model },
        { label: 'Год выпуска', value: formatYear(car.year) },
        { label: 'Пробег', value: car.mileage ? `${car.mileage.toLocaleString()} км` : 'Новый' },
        { label: 'VIN', value: car.vin || 'Не указан' },
        { label: 'Цвет', value: car.color || 'Не указан' },
        { label: 'Объем двигателя', value: car.engine_volume ? formatEngineVolume(car.engine_volume) : 'Не указан' },
        { label: 'Мощность', value: car.engine_power ? formatEnginePower(car.engine_power) : 'Не указана' },
        {
            label: 'Тип топлива',
            value: car.fuel_type ? {
                petrol: 'Бензин',
                diesel: 'Дизель',
                electric: 'Электро',
                hybrid: 'Гибрид',
            }[car.fuel_type] || car.fuel_type : 'Не указан'
        },
        {
            label: 'Коробка передач',
            value: car.transmission ? {
                automatic: 'Автомат',
                manual: 'Механика',
                robot: 'Робот',
            }[car.transmission] || car.transmission : 'Не указана'
        },
        {
            label: 'Привод',
            value: car.drive ? {
                front: 'Передний',
                rear: 'Задний',
                awd: 'Полный (постоянный)',
                '4wd': 'Полный (подключаемый)',
            }[car.drive] || car.drive : 'Не указан'
        },
        {
            label: 'Тип кузова',
            value: car.body_type ? {
                sedan: 'Седан',
                hatchback: 'Хэтчбек',
                suv: 'Внедорожник',
                coupe: 'Купе',
                wagon: 'Универсал',
                minivan: 'Минивэн',
                pickup: 'Пикап',
                van: 'Фургон',
                cabrio: 'Кабриолет',
            }[car.body_type] || car.body_type : 'Не указан'
        },
    ]

    return (
        <div className={styles.specs}>
            <h2 className={styles.title}>Характеристики</h2>
            <div className={styles.grid}>
                {specs.map((spec, index) => (
                    <div key={index} className={styles.item}>
                        <span className={styles.label}>{spec.label}:</span>
                        <span className={styles.value}>{spec.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}