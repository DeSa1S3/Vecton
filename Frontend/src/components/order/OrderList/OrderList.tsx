import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { fetchOrders } from '../../../store/slices/ordersSlice';
import { Order } from '../../../types';
import { Loader, Pagination, Select, Button } from '../../common';
import { formatPrice, formatDate } from '../../../utils/formatters';
import { ORDER_TYPES, ORDER_STATUSES } from '../../../utils/constants';
import { FiEye, FiCalendar, FiShoppingBag } from 'react-icons/fi';
import styles from './OrderList.module.scss';
import { useAppSelector } from '@/store/hooks/useAppSelectors';

interface OrdersListProps {
    limit?: number;
    showFilters?: boolean;
    onOrderClick?: (orderId: number) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
    limit = 10,
    showFilters = true,
    onOrderClick
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, totalCount, isLoading } = useAppSelector((state: { orders: any; }) => state.orders);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const pageSize = limit;

    useEffect(() => {
        // @ts-ignore - временное игнорирование ошибки типа
        dispatch(fetchOrders({
            page: currentPage,
            page_size: pageSize
        }));
    }, [dispatch, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOrderClick = (orderId: number) => {
        if (onOrderClick) {
            onOrderClick(orderId);
        } else {
            navigate(`/orders/${orderId}`);
        }
    };

    const filteredOrders = items.filter((order: Order) => {
        if (statusFilter !== 'all' && order.status !== statusFilter) return false;
        if (typeFilter !== 'all' && order.order_type !== typeFilter) return false;
        return true;
    });

    const statusOptions = [
        { value: 'all', label: 'Все статусы' },
        ...Object.entries(ORDER_STATUSES).map(([value, { label }]) => ({
            value,
            label,
        })),
    ];

    const typeOptions = [
        { value: 'all', label: 'Все типы' },
        ...Object.entries(ORDER_TYPES).map(([value, label]) => ({
            value,
            label,
        })),
    ];

    if (isLoading && items.length === 0) {
        return (
            <div className={styles.loading}>
                <Loader />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                <h3>У вас пока нет заказов</h3>
                <p>Перейдите в каталог, чтобы оформить заказ</p>
                <Button onClick={() => navigate('/catalog')}>
                    Перейти в каталог
                </Button>
            </div>
        );
    }

    return (
        <div className={styles.ordersList}>
            {showFilters && (
                <div className={styles.filters}>
                    <Select
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    />
                    <Select
                        options={typeOptions}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    />
                </div>
            )}

            <div className={styles.stats}>
                <span>Всего заказов: <strong>{totalCount}</strong></span>
                <span>Показано: <strong>{filteredOrders.length}</strong></span>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <div className={styles.cell}>№ заказа</div>
                    <div className={styles.cell}>Автомобиль</div>
                    <div className={styles.cell}>Тип</div>
                    <div className={styles.cell}>Статус</div>
                    <div className={styles.cell}>Сумма</div>
                    <div className={styles.cell}>Дата</div>
                    <div className={styles.cell}>Действия</div>
                </div>

                <div className={styles.tableBody}>
                    {filteredOrders.map((order: Order) => {
                        const status = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
                        const type = ORDER_TYPES[order.order_type as keyof typeof ORDER_TYPES];

                        return (
                            <div
                                key={order.id}
                                className={styles.tableRow}
                                onClick={() => handleOrderClick(order.id)}
                            >
                                <div className={styles.cell} data-label="№ заказа">
                                    <span className={styles.orderId}>#{order.id}</span>
                                </div>

                                <div className={styles.cell} data-label="Автомобиль">
                                    <div className={styles.carInfo}>
                                        {order.car_image && (
                                            <img
                                                src={order.car_image}
                                                alt={order.car_info}
                                                className={styles.carImage}
                                            />
                                        )}
                                        <div className={styles.carDetails}>
                                            <span className={styles.carTitle}>{order.car_info}</span>
                                            <span className={styles.carYear}>
                                                {order.car_info.split(', ')[1] || ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.cell} data-label="Тип">
                                    <span className={styles.orderType}>{type}</span>
                                </div>

                                <div className={styles.cell} data-label="Статус">
                                    <span
                                        className={styles.status}
                                        style={{
                                            backgroundColor: `${status?.color}20`,
                                            color: status?.color
                                        }}
                                    >
                                        {status?.label}
                                    </span>
                                </div>

                                <div className={styles.cell} data-label="Сумма">
                                    <span className={styles.orderPrice}>
                                        {order.total_price ? formatPrice(order.total_price) : '—'}
                                    </span>
                                </div>

                                <div className={styles.cell} data-label="Дата">
                                    <div className={styles.dateInfo}>
                                        <span>{formatDate(order.created_at)}</span>
                                    </div>
                                </div>

                                <div className={styles.cell} data-label="Действия">
                                    <button
                                        className={styles.viewButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOrderClick(order.id);
                                        }}
                                        title="Просмотреть детали"
                                    >
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {totalCount > pageSize && (
                <div className={styles.pagination}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalCount / pageSize)}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};