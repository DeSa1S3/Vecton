import React from 'react';
import { Car } from '../../../types';
import { CarCard } from '../CarCard/CarCard';
import styles from './CarGrid.module.scss';

interface CarGridProps {
    cars: Car[];
    isLoading?: boolean;
    loadingCount?: number;
    onFavoriteClick?: (carId: number) => void;
    favoriteIds?: number[];
    emptyMessage?: string;
    columns?: 2 | 3 | 4;
    gap?: 'small' | 'medium' | 'large';
}

export const CarGrid: React.FC<CarGridProps> = ({
    cars,
    isLoading = false,
    loadingCount = 8,
    onFavoriteClick,
    favoriteIds = [],
    emptyMessage = 'Автомобили не найдены',
    columns = 4,
    gap = 'medium',
}) => {
    const getGridClass = () => {
        switch (columns) {
            case 2:
                return styles.grid2;
            case 3:
                return styles.grid3;
            case 4:
                return styles.grid4;
            default:
                return styles.grid4;
        }
    };

    const getGapClass = () => {
        switch (gap) {
            case 'small':
                return styles.gapSmall;
            case 'medium':
                return styles.gapMedium;
            case 'large':
                return styles.gapLarge;
            default:
                return styles.gapMedium;
        }
    };

    if (!cars || cars.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>🚗</div>
                <h3 className={styles.emptyTitle}>{emptyMessage}</h3>
                <p className={styles.emptyDescription}>
                    Попробуйте изменить параметры поиска или фильтры
                </p>
            </div>
        );
    }

    return (
        <div className={`${styles.grid} ${getGridClass()} ${getGapClass()}`}>
            {cars.map((car) => (
                <CarCard
                    key={car.id}
                    car={car}
                    onFavoriteClick={onFavoriteClick}
                    isFavorite={favoriteIds.includes(car.id)}
                />
            ))}
        </div>
    );
};

export default CarGrid;