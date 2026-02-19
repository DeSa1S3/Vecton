import React from 'react'
import { Link } from 'react-router-dom'
import { useGetFavoritesQuery, useRemoveFromFavoritesMutation } from '../../store/api/favoritesApi'
import { useToast } from '../../hooks/useToast'
import { CarCard } from '../../components/features/cars/CarCard/CarCard'
import { Button } from '../../components/common/Button/Button'
import styles from './FavoritesPage.module.scss'

export const FavoritesPage: React.FC = () => {
    const { data: favorites, isLoading, refetch } = useGetFavoritesQuery()
    const [removeFromFavorites] = useRemoveFromFavoritesMutation()
    const { showSuccess, showError } = useToast()

    const handleRemove = async (favoriteId: number) => {
        try {
            await removeFromFavorites(favoriteId).unwrap()
            refetch()
            showSuccess('Автомобиль удален из избранного')
        } catch (error) {
            showError('Ошибка при удалении')
        }
    }

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>
    }

    return (
        <div className={styles.favoritesPage}>
            <h1 className={styles.title}>Избранное</h1>

            {!favorites || favorites.length === 0 ? (
                <div className={styles.empty}>
                    <p>В избранном пока нет автомобилей</p>
                    <Link to="/catalog" className={styles.catalogLink}>
                        Перейти в каталог
                    </Link>
                </div>
            ) : (
                <div className={styles.favoritesGrid}>
                    {favorites.map((favorite) => (
                        <div key={favorite.id} className={styles.favoriteItem}>
                            <CarCard car={favorite.car} />
                            <Button
                                variant="danger"
                                size="small"
                                className={styles.removeButton}
                                onClick={() => handleRemove(favorite.id)}
                            >
                                Удалить
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}