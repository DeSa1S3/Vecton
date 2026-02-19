import React from 'react'
import { Link } from 'react-router-dom'
import { type RecentOrder } from '../../../../api/types'
import { formatDate } from '../../../../utils/formatters'
import styles from './RecentOrdersTable.module.scss'

interface RecentOrdersTableProps {
    orders: RecentOrder[]
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            new: '#3b82f6',
            in_progress: '#f59e0b',
            completed: '#10b981',
            cancelled: '#ef4444',
        }
        return colors[status] || '#6b7280'
    }

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            new: 'Новая',
            in_progress: 'В обработке',
            completed: 'Завершена',
            cancelled: 'Отменена',
        }
        return labels[status] || status
    }

    return (
        <div className={styles.table}>
            {orders.length === 0 ? (
                <div className={styles.empty}>Нет заявок</div>
            ) : (
                orders.map((order) => (
                    <Link
                        key={order.id}
                        to={`/profile/orders/${order.id}`}
                        className={styles.orderRow}
                    >
                        <div className={styles.orderHeader}>
                            <span className={styles.orderId}>#{order.id}</span>
                            <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                        </div>

                        <div className={styles.orderInfo}>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{order.user.full_name}</span>
                                <span className={styles.userEmail}>{order.user.email}</span>
                            </div>

                            <div className={styles.carInfo}>
                                <span className={styles.carName}>
                                    {order.car.brand} {order.car.model} ({order.car.year})
                                </span>
                            </div>
                        </div>

                        <div className={styles.orderFooter}>
                            <span className={styles.orderType}>
                                {order.order_type === 'test_drive' && 'Тест-драйв'}
                                {order.order_type === 'purchase' && 'Покупка'}
                                {order.order_type === 'trade_in' && 'Trade-in'}
                                {order.order_type === 'consultation' && 'Консультация'}
                            </span>
                            <span
                                className={styles.orderStatus}
                                style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                                {getStatusLabel(order.status)}
                            </span>
                        </div>
                    </Link>
                ))
            )}
        </div>
    )
}