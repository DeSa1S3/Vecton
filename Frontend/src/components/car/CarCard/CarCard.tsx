import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiCalendar, FiMapPin, FiSettings } from 'react-icons/fi';
import { Car } from '../../../types/car.types';
import { formatPrice, formatMileage } from '../../../utils/formatters';
import { CAR_STATUSES, FUEL_TYPES, TRANSMISSIONS } from '../../../utils/constants';
import { Button } from '../../common/Button';
import styles from './CarCard.module.scss';

interface CarCardProps {
    car: Car;
    onFavoriteClick?: (carId: number) => void;
    isFavorite?: boolean;
    showActions?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
    car,
    onFavoriteClick,
    isFavorite = false,
    showActions = true
}) => {
    const status = car.status ? CAR_STATUSES[car.status] : null;

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteClick?.(car.id);
    };

    return (
        <div className={styles.card}>
            <Link to={`/car/${car.id}`} className={styles.cardLink}>
                <div className={styles.imageContainer}>
                    {car.main_image ? (
                        <img
                            src={car.main_image}
                            alt={`${car.brand} ${car.model}`}
                            className={styles.image}
                            loading="lazy"
                        />
                    ) : (
                        <div className={styles.placeholder}>
                            <span>Нет фото</span>
                        </div>
                    )}

                    {status && car.status !== 'in_stock' && (
                        <div
                            className={styles.status}
                            style={{ backgroundColor: status.color }}
                        >
                            {status.label}
                        </div>
                    )}

                    {onFavoriteClick && (
                        <button
                            className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
                            onClick={handleFavoriteClick}
                            aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                        >
                            <FiHeart />
                        </button>
                    )}
                </div>

                <div className={styles.content}>
                    <h3 className={styles.title}>
                        {car.brand} {car.model}
                    </h3>

                    <div className={styles.year}>
                        <FiCalendar />
                        <span>{car.year} год</span>
                    </div>

                    <div className={styles.price}>
                        {formatPrice(car.price)}
                    </div>

                    <div className={styles.specs}>

                        {car.transmission && (
                            <div className={styles.spec}>
                                <FiSettings />
                                <span>{TRANSMISSIONS[car.transmission]}</span>
                            </div>
                        )}

                        <div className={styles.spec}>
                            <FiMapPin />
                            <span>Москва</span>
                        </div>
                    </div>

                    <div className={styles.mileage}>
                        {formatMileage(car.mileage)}
                    </div>

                    {showActions && (
                        <div className={styles.actions}>
                            <Button
                                variant="primary"
                                size="sm"
                                fullWidth
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = `/car/${car.id}`;
                                }}
                            >
                                Подробнее
                            </Button>
                        </div>
                    )}

                    <div className={styles.footer}>
                        <div className={styles.views}>
                            <FiEye />
                            <span>{car.views_count || 0}</span>
                        </div>
                        {car.images_count > 0 && (
                            <div className={styles.photos}>
                                📷 {car.images_count}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};