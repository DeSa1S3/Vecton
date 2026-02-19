import React from 'react'
import { Link } from 'react-router-dom'
import { type Order } from '../../../../api/types'
import { formatDate, formatPrice } from '../../../../utils/formatters'
import { ORDER_STATUSES } from '../../../../utils/constants'
import styles from './OrderTable.module.scss'

interface OrderTableProps {
    orders: Order[]
    showCar?: boolean
    showUser?: boolean
    onStatusChange?: (orderId: number, status: string) => void
}

export const OrderTable: React.FC<OrderTableProps> = ({
    orders,
    showCar = true,
    showUser = false,
    onStatusChange,
}) => {
    const getStatusColor = (status: string) => {
        const statusConfig = ORDER_STATUSES.find(s => s.value === status)
        return statusConfig?.color || '#6b7280'
    }

    const getStatusLabel = (status: string) => {
        const statusConfig = ORDER_STATUSES.find(s => s.value === status)
        return statusConfig?.label || status
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        {showUser && <th>Клиент</th>}
                        {showCar && <th>Автомобиль</th>}
                        <th>Тип</th>
                        <th>Дата</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>#{order.id}</td>
                            {showUser && (
                                <td>
                                    <div className={styles.userInfo}>
                                        <div className={styles.userName}>{order.user_name}</div>
                                        <div className={styles.userContact}>{order.user?.email}</div>
                                    </div>
                                </td>
                            )}
                            {showCar && (
                                <td>
                                    <Link to={`/car/${order.car.id}`} className={styles.carLink}>
                                        {order.car_image && (
                                            <img
                                                src={order.car_image}
                                                alt={order.car_info}
                                                className={styles.carImage}
                                            />
                                        )}
                                        <span>{order.car_info}</span>
                                    </Link>
                                </td>
                            )}
                            <td>
                                {order.order_type === 'test_drive' && 'Тест-драйв'}
                                {order.order_type === 'purchase' && 'Покупка'}
                                {order.order_type === 'trade_in' && 'Trade-in'}
                                {order.order_type === 'consultation' && 'Консультация'}
                            </td>
                            <td>{formatDate(order.created_at)}</td>
                            <td>
                                {onStatusChange ? (
                                    <select
                                        className={styles.statusSelect}
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                        value={order.status}
                                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                                    >
                                        {ORDER_STATUSES.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span
                                        className={styles.statusBadge}
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {getStatusLabel(order.status)}
                                    </span>
                                )}
                            </td>
                            <td>
                                <Link to={`/profile/orders/${order.id}`} className={styles.detailsLink}>
                                    Подробнее
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {orders.length === 0 && (
                <div className={styles.empty}>
                    <p>Заявки не найдены</p>
                </div>
            )}
        </div>
    )
}