import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetCarQuery, useIncrementViewsMutation } from '../../store/api/carsApi'
import { useGetSimilarCarsQuery } from '../../store/api/carsApi'
import { useAddToFavoritesMutation, useCheckInFavoritesQuery } from '../../store/api/favoritesApi'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { ImageGallery } from '../../components/features/cars/ImageGallery/ImageGallery'
import { CarSpecs } from '../../components/features/cars/CarSpecs/CarSpecs'
import { OrderForm } from '../../components/features/orders/OrderForm/OrderForm'
import { CarCard } from '../../components/features/cars/CarCard/CarCard'
import { Button } from '../../components/common/Button/Button'
import styles from './CarDetailPage.module.scss'

export const CarDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const carId = Number(id)
    const { isAuthenticated } = useAuth()
    const { showSuccess, showError } = useToast()

    const { data: car, isLoading } = useGetCarQuery(carId)
    const { data: similarCars } = useGetSimilarCarsQuery(carId, { skip: !car })
    const [incrementViews] = useIncrementViewsMutation()
    const [addToFavorites] = useAddToFavoritesMutation()
    const { data: favoriteData, refetch: refetchFavorite } = useCheckInFavoritesQuery(carId, {
        skip: !isAuthenticated || !carId,
    })

    useEffect(() => {
        if (carId) {
            incrementViews(carId)
        }
    }, [carId, incrementViews])

    const handleAddToFavorites = async () => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        try {
            await addToFavorites({ car: carId }).unwrap()
            refetchFavorite()
            showSuccess('Автомобиль добавлен в избранное')
        } catch (error) {
            showError('Ошибка при добавлении в избранное')
        }
    }

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>
    }

    if (!car) {
        return (
            <div className={styles.notFound}>
                <h2>Автомобиль не найден</h2>
                <Button variant="primary" onClick={() => navigate('/catalog')}>
                    Вернуться в каталог
                </Button>
            </div>
        )
    }

    return (
        <div className={styles.carDetailPage}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    ← Назад
                </button>
                <h1 className={styles.title}>
                    {car.brand} {car.model} {car.year} год
                </h1>
            </div>

            <section className={styles.gallery}>
                <ImageGallery images={car.images} />
            </section>

            <div className={styles.mainInfo}>
                <div className={styles.priceSection}>
                    <div className={styles.price}>{car.formatted_price}</div>
                    <div className={styles.actions}>
                        <Button
                            variant={favoriteData?.in_favorites ? 'success' : 'outline'}
                            onClick={handleAddToFavorites}
                            icon="❤️"
                        >
                            {favoriteData?.in_favorites ? 'В избранном' : 'В избранное'}
                        </Button>
                    </div>
                </div>

                <div className={styles.status}>
                    <span className={`${styles.statusBadge} ${styles[car.status]}`}>
                        {car.status === 'in_stock' && 'В наличии'}
                        {car.status === 'sold' && 'Продан'}
                        {car.status === 'reserved' && 'В резерве'}
                        {car.status === 'expected' && 'Ожидается'}
                    </span>
                    <span className={styles.views}>👁 {car.views_count} просмотров</span>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.leftColumn}>
                    <CarSpecs car={car} />

                    {car.description && (
                        <div className={styles.description}>
                            <h2 className={styles.sectionTitle}>Описание</h2>
                            <p>{car.description}</p>
                        </div>
                    )}

                    {car.equipment && Object.keys(car.equipment).length > 0 && (
                        <div className={styles.equipment}>
                            <h2 className={styles.sectionTitle}>Комплектация</h2>
                            <div className={styles.equipmentGrid}>
                                {Object.entries(car.equipment).map(([category, items]) => (
                                    <div key={category} className={styles.equipmentCategory}>
                                        <h3 className={styles.categoryTitle}>{category}</h3>
                                        <ul className={styles.equipmentList}>
                                            {Array.isArray(items) && items.map((item, index) => (
                                                <li key={index} className={styles.equipmentItem}>
                                                    ✓ {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.rightColumn}>
                    {isAuthenticated ? (
                        <OrderForm carId={car.id} />
                    ) : (
                        <div className={styles.authPrompt}>
                            <p>Чтобы оставить заявку, необходимо авторизоваться</p>
                            <Button variant="primary" onClick={() => navigate('/login')}>
                                Войти
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {similarCars && similarCars.length > 0 && (
                <section className={styles.similar}>
                    <h2 className={styles.sectionTitle}>Похожие автомобили</h2>
                    <div className={styles.similarGrid}>
                        {similarCars.map((car: { id: any }) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}