import React, { useState } from 'react'
import { useGetDashboardStatsQuery, useGetPopularCarsQuery, useGetRecentOrdersQuery } from '../../store/api/dashboardApi'
import { useAuth } from '../../hooks/useAuth'
import { StatsCards } from '../../components/features/dashboard/StatsCards/StatsCards'
import { PopularCarsChart } from '../../components/features/dashboard/PopularCarsChart/PopularCarsChart'
import { RecentOrdersTable } from '../../components/features/dashboard/RecentOrdersTable/RecentOrdersTable'
import { CarManagementTable } from '../../components/features/dashboard/CarManagementTable/CarManagementTable'
import styles from './DashboardPage.module.scss'

export const DashboardPage: React.FC = () => {
    const { isManager } = useAuth()
    const [activeTab, setActiveTab] = useState<'overview' | 'cars' | 'orders'>('overview')

    const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery()
    const { data: popularCars } = useGetPopularCarsQuery({ limit: 5 })
    const { data: recentOrders } = useGetRecentOrdersQuery({ limit: 10 })

    if (!isManager) {
        return (
            <div className={styles.accessDenied}>
                <h2>Доступ запрещен</h2>
                <p>У вас нет прав для просмотра этой страницы</p>
            </div>
        )
    }

    return (
        <div className={styles.dashboardPage}>
            <h1 className={styles.title}>Панель управления</h1>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Обзор
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'cars' ? styles.active : ''}`}
                    onClick={() => setActiveTab('cars')}
                >
                    Автомобили
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Заявки
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className={styles.overview}>
                    {statsLoading ? (
                        <div className={styles.loading}>Загрузка статистики...</div>
                    ) : (
                        <>
                            <StatsCards stats={stats} />

                            <div className={styles.chartsGrid}>
                                <div className={styles.chartCard}>
                                    <h3 className={styles.chartTitle}>Популярные автомобили</h3>
                                    <PopularCarsChart data={popularCars || []} />
                                </div>

                                <div className={styles.chartCard}>
                                    <h3 className={styles.chartTitle}>Последние заявки</h3>
                                    <RecentOrdersTable orders={recentOrders || []} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {activeTab === 'cars' && (
                <div className={styles.carsTab}>
                    <CarManagementTable />
                </div>
            )}

            {activeTab === 'orders' && (
                <div className={styles.ordersTab}>
                    <div className={styles.comingSoon}>
                        <h3>Управление заявками</h3>
                        <p>Раздел находится в разработке</p>
                    </div>
                </div>
            )}
        </div>
    )
}