import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecentOrder } from '../../../types';
import { formatPrice, formatDate } from '../../../utils/formatters';
import { ORDER_TYPES, ORDER_STATUSES } from '../../../utils/constants';
import styles from './RecentOrders.module.scss';

interface RecentOrdersProps {
    orders: RecentOrder[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
    const navigate = useNavigate();

    if (!orders || orders.length === 0) {
        return (
            <div className={styles.empty}>
                <p>Нет заказов</p>
            </div>
        );
    }

    return (
        <div className={styles.table}>
            <div className={styles.header}>
                <div className={styles.cell}>ID</div>
                <div className={styles.cell}>Клиент</div>
                <div className={styles.cell}>Автомобиль</div>
                <div className={styles.cell}>Тип</div>
                <div className={styles.cell}>Статус</div>
                <div className={styles.cell}>Дата</div>
            </div>

            <div className={styles.body}>
                {orders.map((order) => {
                    const status = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
                    const type = ORDER_TYPES[order.order_type as keyof typeof ORDER_TYPES];

                    return (
                        <div
                            key={order.id}
                            className={styles.row}
                            onClick={() => navigate(`/orders/${order.id}`)}
                        >
                            <div className={styles.cell} data-label="ID">#{order.id}</div>
                            <div className={styles.cell} data-label="Клиент">
                                <div className={styles.userInfo}>
                                    <strong>{order.user.full_name}</strong>
                                    <span>{order.user.email}</span>
                                </div>
                            </div>
                            <div className={styles.cell} data-label="Автомобиль">
                                {order.car.brand} {order.car.model}, {order.car.year}
                            </div>
                            <div className={styles.cell} data-label="Тип">
                                {type}
                            </div>
                            <div className={styles.cell} data-label="Статус">
                                <span
                                    className={styles.status}
                                    style={{
                                        backgroundColor: `${status?.color || '#999'}20`,
                                        color: status?.color || '#999'
                                    }}
                                >
                                    {status?.label || order.status}
                                </span>
                            </div>
                            <div className={styles.cell} data-label="Дата">
                                {formatDate(order.created_at)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};