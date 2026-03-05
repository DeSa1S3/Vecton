import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { fetchFavorites, clearFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import { CarCard } from '../../components/car/CarCard/CarCard';
import { Button, Loader } from '../../components/common';
import { FiHeart } from 'react-icons/fi';
import styles from './FavoritesPage.module.scss';
import { useAppSelector } from '@/store/hooks/useAppSelectors';

export const FavoritesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, isLoading } = useAppSelector((state: { favorites: any; }) => state.favorites);

    useEffect(() => {
        // @ts-ignore - временное игнорирование ошибок типов
        dispatch(fetchFavorites());
    }, [dispatch]);

    const handleClearFavorites = () => {
        if (window.confirm('Очистить список избранного?')) {
            // @ts-ignore
            dispatch(clearFavorites());
        }
    };

    const handleRemoveFromFavorites = (id: number) => {
        // @ts-ignore
        dispatch(removeFromFavorites(id));
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <Loader />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyContent}>
                    <FiHeart className={styles.emptyIcon} />
                    <h2>Избранное пусто</h2>
                    <p>Добавляйте понравившиеся автомобили в избранное</p>
                    <Button onClick={() => navigate('/catalog')}>
                        Перейти в каталог
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.favoritesPage}>
            <div className="container">
                <div className={styles.header}>
                    <h1>Избранное</h1>
                    <Button variant="outline" onClick={handleClearFavorites}>
                        Очистить список
                    </Button>
                </div>

                <div className={styles.grid}>
                    {items.map((item: { id: number; car: any; }) => (
                        <CarCard
                            key={item.id}
                            car={item.car}
                            isFavorite={true}
                            onFavoriteClick={() => handleRemoveFromFavorites(item.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};