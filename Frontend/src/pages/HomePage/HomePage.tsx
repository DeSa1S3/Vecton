import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { fetchCars } from '../../store/slices/carsSlice';
import { CarCard } from '../../components/car/CarCard/CarCard';
import { Button } from '../../components/common';
import { Car } from '../../types';
import styles from './HomePage.module.scss';
import { useAppSelector } from '@/store/hooks/useAppSelectors';

export const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { cars, isLoading } = useAppSelector((state: { cars: any; }) => state.cars);

    useEffect(() => {
        // @ts-ignore - временное игнорирование ошибок типов
        dispatch(fetchCars({ pageSize: 8 }));
    }, [dispatch]);

    return (
        <div className={styles.homePage}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Найдите свой идеальный автомобиль
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Более 1000 автомобилей в наличии. Тест-драйв, trade-in, кредит.
                    </p>
                    <Link to="/catalog">
                        <Button size="lg">Перейти в каталог</Button>
                    </Link>
                </div>
            </section>

            <section className={styles.featured}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Новинки</h2>

                    {isLoading ? (
                        <div className={styles.loading}>
                            <div className="loading-spinner" />
                        </div>
                    ) : (
                        <div className={styles.carGrid}>
                            {cars.map((car: Car) => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.features}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Почему выбирают нас</h2>

                    <div className={styles.featuresGrid}>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>🚗</div>
                            <h3>Большой выбор</h3>
                            <p>Более 1000 автомобилей в наличии</p>
                        </div>

                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>💰</div>
                            <h3>Лучшие цены</h3>
                            <p>Прямые поставки от производителей</p>
                        </div>

                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>🔧</div>
                            <h3>Гарантия качества</h3>
                            <p>Все автомобили проходят проверку</p>
                        </div>

                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>🤝</div>
                            <h3>Поддержка 24/7</h3>
                            <p>Помощь на всех этапах покупки</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaContent}>
                        <h2>Не нашли подходящий автомобиль?</h2>
                        <p>Оставьте заявку, и мы подберем для вас лучший вариант</p>
                        <Button size="lg">Оставить заявку</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};