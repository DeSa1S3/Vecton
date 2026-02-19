import React from 'react'
import { type DashboardStats } from '../../../../api/types'
import styles from './StatsCards.module.scss'

interface StatsCardsProps {
    stats?: DashboardStats
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
    if (!stats) {
        return <div className={styles.loading}>Загрузка статистики...</div>
    }

    const cards = [
        {
            title: 'Автомобили',
            value: stats.cars.total,
            subValue: `${stats.cars.in_stock} в наличии`,
            icon: '🚗',
            color: '#2563eb',
            details: [
                { label: 'Продано', value: stats.cars.sold },
                { label: 'В резерве', value: stats.cars.reserved },
                { label: 'Просмотров', value: stats.cars.total_views },
            ],
        },
        {
            title: 'Заявки',
            value: stats.orders.total,
            subValue: `${stats.orders.new} новых`,
            icon: '📋',
            color: '#10b981',
            details: [
                { label: 'В обработке', value: stats.orders.in_progress },
                { label: 'Завершено', value: stats.orders.completed },
                { label: 'Отменено', value: stats.orders.cancelled },
            ],
        },
        {
            title: 'Пользователи',
            value: stats.users.total,
            subValue: `${stats.users.new_today} за сегодня`,
            icon: '👥',
            color: '#f59e0b',
            details: [
                { label: 'Клиенты', value: stats.users.clients },
                { label: 'Менеджеры', value: stats.users.managers },
                { label: 'Новых за месяц', value: stats.users.new_month },
            ],
        },
    ]

    return (
        <div className={styles.statsGrid}>
            {cards.map((card, index) => (
                <div key={index} className={styles.statCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardIcon}>{card.icon}</span>
                        <h3 className={styles.cardTitle}>{card.title}</h3>
                    </div>

                    <div className={styles.cardValue}>{card.value.toLocaleString()}</div>
                    <div className={styles.cardSubValue}>{card.subValue}</div>

                    <div className={styles.cardDetails}>
                        {card.details.map((detail, idx) => (
                            <div key={idx} className={styles.detailItem}>
                                <span className={styles.detailLabel}>{detail.label}:</span>
                                <span className={styles.detailValue}>{detail.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}