import React from 'react'
import { Link } from 'react-router-dom'
import { useGetOrdersQuery } from '../../store/api/ordersApi'
import { formatDate, formatPrice } from '../../utils/formatters'
import { ORDER_STATUSES } from '../../utils/constants'
import styles from './OrdersPage.module.scss'

export const OrdersPage: React.FC = () => {
    const { data, isLoading } = useGetOrdersQuery({})

    const getStatusColor = (status: string) => {
        const statusConfig = ORDER_STATUSES.find(s => s.value === status)
        return statusConfig?.color || '#6b7280'
    }

    const getStatusLabel = (status: string) => {
        const statusConfig = ORDER_STATUSES.find(s => s.value === status)
        return statusConfig?.label || status
    }

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>
    }

    return (
        <div className={styles.ordersPage}>
            <h1 className={styles.title}>Мои заявки</h1>

            {data?.results.length === 0 ? (
                <div className={styles.empty}>
                    <p>У вас пока нет заявок</p>
                    <Link to="/catalog" className={styles.catalogLink}>
                        Перейти в каталог
                    </Link>
                </div>
            ) : (
                <div className={styles.ordersList}>
                    {data?.results.map((order: { id: React.Key | null | undefined; car_image: string | undefined; car_info: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; order_type: string; created_at: string | Date; total_price: number; status: string }) => (
                        <Link
                            key={order.id}
                            to={`/profile/orders/${order.id}`}
                            className={styles.orderCard}
                        >
                            {order.car_image && (
                                <div className={styles.orderImage}>
                                    <img src={order.car_image} alt={order.car_info} />
                                </div>
                            )}
                            <div className={styles.orderInfo}>
                                <h3 className={styles.orderTitle}>{order.car_info}</h3>
                                <div className={styles.orderDetails}>
                                    <span className={styles.orderType}>
                                        {order.order_type === 'test_drive' && 'Тест-драйв'}
                                        {order.order_type === 'purchase' && 'Покупка'}
                                        {order.order_type === 'trade_in' && 'Trade-in'}
                                        {order.order_type === 'consultation' && 'Консультация'}
                                    </span>
                                    <span className={styles.orderDate}>
                                        {formatDate(order.created_at)}
                                    </span>
                                </div>
                                {order.total_price && (
                                    <div className={styles.orderPrice}>
                                        {formatPrice(order.total_price)}
                                    </div>
                                )}
                            </div>
                            <div className={styles.orderStatus}>
                                <span
                                    className={styles.statusBadge}
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}