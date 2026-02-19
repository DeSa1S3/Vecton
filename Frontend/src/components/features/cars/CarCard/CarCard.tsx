import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { Car } from '../../../../api/types'
import { addToFavorites, removeFromFavorites } from '../../../../store/slices/carSlice'
import { useAuth } from '../../../../hooks/useAuth'
import { useToast } from '../../../../hooks/useToast'
import { formatPrice, formatMileage } from '../../../../utils/formatters'
import styles from './CarCard.module.scss'

interface CarCardProps {
    car: Car
    onFavoriteToggle?: () => void
}

export const CarCard: React.FC<CarCardProps> = ({ car, onFavoriteToggle }) => {
    const dispatch = useDispatch()
    const { isAuthenticated } = useAuth()
    const { showWarning } = useToast()

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault()

        if (!isAuthenticated) {
            showWarning('Войдите, чтобы добавить в избранное')
            return
        }

        const isFavorite = false

        if (isFavorite) {
            dispatch(removeFromFavorites(car.id))
        } else {
            dispatch(addToFavorites(car.id))
        }

        onFavoriteToggle?.()
    }

    return (
        <Link to={`/car/${car.id}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {car.main_image ? (
                    <img src={car.main_image} alt={`${car.brand} ${car.model}`} className={styles.image} />
                ) : (
                    <div className={styles.placeholder}>Нет фото</div>
                )}
                <button
                    className={styles.favoriteButton}
                    onClick={handleFavoriteClick}
                    aria-label="Добавить в избранное"
                >
                    ♥
                </button>
                {car.images_count > 0 && (
                    <span className={styles.imageCount}>
                        📸 {car.images_count}
                    </span>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>
                    {car.brand} {car.model}
                </h3>
                <div className={styles.year}>{car.year} год</div>
                <div className={styles.price}>{formatPrice(car.price)}</div>
                {car.mileage !== undefined && (
                    <div className={styles.mileage}>
                        Пробег: {formatMileage(car.mileage)}
                    </div>
                )}
                <div className={styles.status}>
                    <span className={`${styles.statusBadge} ${styles[car.status]}`}>
                        {car.status === 'in_stock' && 'В наличии'}
                        {car.status === 'sold' && 'Продан'}
                        {car.status === 'reserved' && 'В резерве'}
                        {car.status === 'expected' && 'Ожидается'}
                    </span>
                </div>
            </div>
        </Link>
    )
}