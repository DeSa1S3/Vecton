import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEye, FiCalendar, FiMapPin, FiHeart } from 'react-icons/fi';
import { useAppDispatch } from '../../store/hooks';
import { fetchCarById, fetchSimilarCars, clearCurrentCar } from '../../store/slices/carsSlice';
import { addToFavorites, removeFromFavorites, checkFavorite } from '../../store/slices/favoritesSlice';
import { CarGallery } from '../../components/car/CarGallery/CarGallery';
import { CarSpecs } from '../../components/car/CarSpecs/CarSpecs';
import { CarActions } from '../../components/car/CarActions/CarActions';
import { CarCard } from '../../components/car/CarCard/CarCard';
import { Button, Loader } from '../../components/common';
import { OrderForm } from '../../components/order/OrderForm/OrderForm';
import { formatPrice } from '../../utils/formatters';
import { CAR_STATUSES } from '../../utils/constants';
import { useAuth } from '../../hooks';
import { Car } from '../../types';
import styles from './CarDetailPage.module.scss';
import { useAppSelector } from '@/store/hooks/useAppSelectors';

export const CarDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
    const { currentCar, similarCars, isLoading } = useAppSelector((state: { cars: any; }) => state.cars);
    const { favoriteIds } = useAppSelector((state: { favorites: any; }) => state.favorites);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (id) {
            const carId = parseInt(id);
            // @ts-ignore - временное игнорирование ошибок типов
            dispatch(fetchCarById(carId));
            // @ts-ignore
            dispatch(fetchSimilarCars(carId));
            if (isAuthenticated) {
                // @ts-ignore
                dispatch(checkFavorite(carId));
            }
        }

        return () => {
            dispatch(clearCurrentCar());
        };
    }, [id, dispatch, isAuthenticated]);

    useEffect(() => {
        if (currentCar) {
            setIsFavorite(favoriteIds.includes(currentCar.id));
        }
    }, [currentCar, favoriteIds]);

    const handleFavoriteClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (isFavorite) {
            const favorite = favoriteIds.find((favId: number) => favId === currentCar.id);
            if (favorite) {
                // @ts-ignore
                dispatch(removeFromFavorites(favorite));
            }
        } else {
            // @ts-ignore
            dispatch(addToFavorites(currentCar.id));
        }
    };

    if (isLoading || !currentCar) {
        return (
            <div className={styles.loading}>
                <Loader />
            </div>
        );
    }

    const getStatusDisplay = () => {
        const statusKey = currentCar.status as keyof typeof CAR_STATUSES;
        return CAR_STATUSES[statusKey] || { label: currentCar.status, color: '#999' };
    };

    const statusDisplay = getStatusDisplay();

    return (
        <div className={styles.carDetailPage}>
            <div className="container">
                <div className={styles.breadcrumbs}>
                    <button onClick={() => navigate('/catalog')} className={styles.backButton}>
                        ← Назад к каталогу
                    </button>
                </div>

                <div className={styles.header}>
                    <h1>
                        {currentCar.brand} {currentCar.model}, {currentCar.year}
                    </h1>
                    <div className={styles.actions}>
                        <Button
                            variant={isFavorite ? 'danger' : 'outline'}
                            icon={<FiHeart />}
                            onClick={handleFavoriteClick}
                        >
                            {isFavorite ? 'В избранном' : 'В избранное'}
                        </Button>
                    </div>
                </div>

                <CarGallery images={currentCar.images || []} />

                <div className={styles.mainInfo}>
                    <div className={styles.infoGrid}>
                        <div className={styles.leftColumn}>
                            <div className={styles.priceSection}>
                                <div className={styles.price}>
                                    {formatPrice(currentCar.price)}
                                </div>
                                {currentCar.status !== 'in_stock' && (
                                    <div className={styles.status} style={{ backgroundColor: statusDisplay.color }}>
                                        {statusDisplay.label}
                                    </div>
                                )}
                            </div>

                            <div className={styles.quickSpecs}>
                                <div className={styles.specItem}>
                                    <FiCalendar />
                                    <span>{currentCar.year} год</span>
                                </div>
                                <div className={styles.specItem}>
                                    <FiMapPin />
                                    <span>Москва</span>
                                </div>
                                <div className={styles.specItem}>
                                    <FiEye />
                                    <span>{currentCar.views_count || 0} просмотров</span>
                                </div>
                            </div>

                            <CarSpecs car={currentCar} />

                            {currentCar.description && (
                                <div className={styles.description}>
                                    <h3>Описание</h3>
                                    <p>{currentCar.description}</p>
                                </div>
                            )}

                            {currentCar.equipment && Object.keys(currentCar.equipment).length > 0 && (
                                <div className={styles.equipment}>
                                    <h3>Комплектация</h3>
                                    <ul className={styles.equipmentList}>
                                        {Object.entries(currentCar.equipment).map(([key, value]) => (
                                            <li key={key}>
                                                <strong>{key}:</strong> {String(value)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className={styles.rightColumn}>
                            <CarActions
                                car={currentCar}
                                onOrderClick={() => setShowOrderForm(true)}
                            />
                        </div>
                    </div>
                </div>

                {similarCars && similarCars.length > 0 && (
                    <div className={styles.similar}>
                        <h2>Похожие автомобили</h2>
                        <div className={styles.similarGrid}>
                            {similarCars.map((car: Car) => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showOrderForm && currentCar && (
                <OrderForm
                    car={currentCar}
                    onClose={() => setShowOrderForm(false)}
                />
            )}
        </div>
    );
};