import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PopularCar } from '../../../types';
import { formatNumber } from '../../../utils/formatters';
import { FiEye, FiShoppingBag } from 'react-icons/fi';
import styles from './PopularsCars.module.scss';

interface PopularCarsProps {
    cars: PopularCar[];
}

export const PopularCars: React.FC<PopularCarsProps> = ({ cars }) => {
    const navigate = useNavigate();

    if (!cars || cars.length === 0) {
        return (
            <div className={styles.empty}>
                <p>Нет данных о популярных автомобилях</p>
            </div>
        );
    }

    return (
        <div className={styles.table}>
            <div className={styles.header}>
                <div className={styles.cell}>Автомобиль</div>
                <div className={styles.cell}>Продажи</div>
                <div className={styles.cell}>Просмотры</div>
            </div>

            <div className={styles.body}>
                {cars.map((car) => (
                    <div
                        key={car.id}
                        className={styles.row}
                        onClick={() => navigate(`/car/${car.id}`)}
                    >
                        <div className={styles.cell}>
                            <div className={styles.carInfo}>
                                <strong>{car.brand} {car.model}</strong>
                                <span>{car.year}</span>
                            </div>
                        </div>
                        <div className={styles.cell}>
                            <span className={styles.sales}>
                                {formatNumber(car.orders_count)}
                            </span>
                        </div>
                        <div className={styles.cell}>
                            <span className={styles.views}>
                                {formatNumber(car.views_count)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};