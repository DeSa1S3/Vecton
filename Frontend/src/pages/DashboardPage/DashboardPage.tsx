import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { fetchStats, fetchPopularCars, fetchRecentOrders, fetchRevenue } from '../../store/slices/dashboardSlice';
import { StatsCard } from '../../components/dashboard/StatsCard/StatsCard';
import { RevenueChart } from '../../components/dashboard/RevenueChart/RevenueChart';
import { PopularCars } from '../../components/dashboard/PopularCars/PopularsCars';
import { RecentOrders } from '../../components/dashboard/RecentOrders/RecentOrders';
import { Loader, Select } from '../../components/common';
import { FiShoppingBag, FiUsers, FiEye, FiHome, FiGrid, FiTruck } from 'react-icons/fi';
import styles from './DashboardPage.module.scss';
import { useAppSelector } from '@/store/hooks/useAppSelectors';

export const DashboardPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { stats, popularCars, recentOrders, revenue, isLoading } = useAppSelector(
        (state: { dashboard: any; }) => state.dashboard
    );
    const { user } = useAppSelector((state: { auth: any; }) => state.auth);
    const [revenuePeriod, setRevenuePeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

    useEffect(() => {
        if (!user?.isManager) {
            navigate('/');
            return;
        }

        // @ts-ignore - временное игнорирование ошибок типов
        dispatch(fetchStats());
        // @ts-ignore
        dispatch(fetchPopularCars(5));
        // @ts-ignore
        dispatch(fetchRecentOrders(10));
    }, [dispatch, user, navigate]);

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchRevenue(revenuePeriod));
    }, [dispatch, revenuePeriod]);

    if (isLoading || !stats) {
        return (
            <div className={styles.loading}>
                <Loader />
            </div>
        );
    }

    const periodOptions = [
        { value: 'day', label: 'День' },
        { value: 'week', label: 'Неделя' },
        { value: 'month', label: 'Месяц' },
        { value: 'year', label: 'Год' },
    ];

    return (
        <div className={styles.dashboardPage}>
            <div className="container">
                <div className={styles.header}>
                    <h1>Панель управления</h1>
                    <p>Добро пожаловать, {user?.full_name}</p>
                </div>

                <div className={styles.statsGrid}>
                    <StatsCard
                        title="Всего автомобилей"
                        value={stats.cars.total}
                        icon={<FiHome />}
                        color="#3b82f6"
                    />
                    <StatsCard
                        title="В наличии"
                        value={stats.cars.in_stock}
                        icon={<FiHome />}
                        color="#10b981"
                    />
                    <StatsCard
                        title="Продано"
                        value={stats.cars.sold}
                        icon={<FiTruck />}
                        color="#ef4444"
                    />
                    <StatsCard
                        title="Просмотры"
                        value={stats.cars.total_views}
                        icon={<FiEye />}
                        color="#f59e0b"
                    />
                    <StatsCard
                        title="Заказы"
                        value={stats.orders.total}
                        icon={<FiShoppingBag />}
                        color="#8b5cf6"
                    />
                    <StatsCard
                        title="Новые заказы"
                        value={stats.orders.new}
                        icon={<FiShoppingBag />}
                        color="#ec4899"
                    />
                    <StatsCard
                        title="Пользователи"
                        value={stats.users.total}
                        icon={<FiUsers />}
                        color="#6366f1"
                    />
                    <StatsCard
                        title="Новые сегодня"
                        value={stats.users.new_today}
                        icon={<FiUsers />}
                        color="#14b8a6"
                    />
                </div>

                <div className={styles.chartSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Выручка</h2>
                        <Select
                            options={periodOptions}
                            value={revenuePeriod}
                            onChange={(e) => setRevenuePeriod(e.target.value as any)}
                        />
                    </div>
                    {revenue && <RevenueChart data={revenue} period={revenuePeriod} />}
                </div>

                <div className={styles.tablesGrid}>
                    <div className={styles.tableCard}>
                        <h2>Популярные автомобили</h2>
                        <PopularCars cars={popularCars} />
                    </div>

                    <div className={styles.tableCard}>
                        <h2>Последние заказы</h2>
                        <RecentOrders orders={recentOrders} />
                    </div>
                </div>
            </div>
        </div>
    );
};