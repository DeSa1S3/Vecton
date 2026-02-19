import React from 'react'
import { Link } from 'react-router-dom'
import { useGetCarsQuery } from '../../store/api/carsApi'
import { CarCard } from '../../components/features/cars/CarCard/CarCard'
import styles from './HomePage.module.scss'

export const HomePage: React.FC = () => {
    const { data, isLoading } = useGetCarsQuery({
        status: 'in_stock',
        ordering: '-created_at',
        page_size: 8
    })

    return (
        <div className={styles.homePage}>
            {/* Hero section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Найдите автомобиль своей мечты
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Более 1000 автомобилей в наличии. Проверенное качество, лучшие цены.
                    </p>
                    <Link to="/catalog" className={styles.heroButton}>
                        Перейти в каталог
                    </Link>
                </div>
            </section>

            {/* Latest cars section */}
            <section className={styles.latest}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Новые поступления</h2>
                    <Link to="/catalog" className={styles.sectionLink}>
                        Смотреть все
                    </Link>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Загрузка...</div>
                ) : (
                    <div className={styles.carGrid}>
                        {data?.results.map((car: { id: any }) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </section>

            {/* Features section */}
            <section className={styles.features}>
                <h2 className={styles.featuresTitle}>Почему выбирают Vecton</h2>
                <div className={styles.featuresGrid}>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>🔍</div>
                        <h3 className={styles.featureTitle}>Проверенные авто</h3>
                        <p className={styles.featureDescription}>
                            Каждый автомобиль проходит тщательную проверку перед продажей
                        </p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>💰</div>
                        <h3 className={styles.featureTitle}>Лучшие цены</h3>
                        <p className={styles.featureDescription}>
                            Прямые поставки от дилеров без посредников
                        </p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>⚡</div>
                        <h3 className={styles.featureTitle}>Быстрое оформление</h3>
                        <p className={styles.featureDescription}>
                            Поможем с оформлением документов за один день
                        </p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>🔧</div>
                        <h3 className={styles.featureTitle}>Гарантия</h3>
                        <p className={styles.featureDescription}>
                            Гарантия на все автомобили до 1 года
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}