import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetOrderQuery, useCancelOrderMutation, useAddReviewMutation } from '../../store/api/ordersApi'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { formatDate, formatPrice } from '../../utils/formatters'
import { ORDER_STATUSES, ORDER_TYPES } from '../../utils/constants'
import { Button } from '../../components/common/Button/Button'
import { Modal } from '../../components/common/Modal/Modal'
import { Input } from '../../components/common/Input/Input'
import styles from './OrderDetailPage.module.scss'

export const OrderDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const orderId = Number(id)
    const { isManager } = useAuth()
    const { showSuccess, showError } = useToast()

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: '',
        pros: '',
        cons: '',
    })

    const { data: order, isLoading, refetch } = useGetOrderQuery(orderId)
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()
    const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation()

    const handleCancelOrder = async () => {
        if (!window.confirm('Вы уверены, что хотите отменить заявку?')) return

        try {
            await cancelOrder(orderId).unwrap()
            refetch()
            showSuccess('Заявка отменена')
        } catch (error) {
            showError('Ошибка при отмене заявки')
        }
    }

    const handleAddReview = async () => {
        try {
            await addReview({
                orderId,
                data: reviewData,
            }).unwrap()
            setIsReviewModalOpen(false)
            refetch()
            showSuccess('Отзыв добавлен')
        } catch (error) {
            showError('Ошибка при добавлении отзыва')
        }
    }

    const getStatusColor = (status: string) => {
        const statusConfig = ORDER_STATUSES.find(s => s.value === status)
        return statusConfig?.color || '#6b7280'
    }

    const getStatusLabel = (status: string) => {
        const statusConfig = ORDER_STATUSES.find(s => s.value === status)
        return statusConfig?.label || status
    }

    const getOrderTypeLabel = (type: string) => {
        const typeConfig = ORDER_TYPES.find(t => t.value === type)
        return typeConfig?.label || type
    }

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>
    }

    if (!order) {
        return (
            <div className={styles.notFound}>
                <h2>Заявка не найдена</h2>
                <Button variant="primary" onClick={() => navigate('/profile/orders')}>
                    Вернуться к заявкам
                </Button>
            </div>
        )
    }

    return (
        <div className={styles.orderDetailPage}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                ← Назад
            </button>

            <div className={styles.orderCard}>
                <div className={styles.orderHeader}>
                    <h1 className={styles.orderTitle}>
                        Заявка #{order.id} от {formatDate(order.created_at)}
                    </h1>
                    <span
                        className={styles.orderStatus}
                        style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                        {getStatusLabel(order.status)}
                    </span>
                </div>

                <div className={styles.orderContent}>
                    <div className={styles.carSection}>
                        <h2 className={styles.sectionTitle}>Автомобиль</h2>
                        <div className={styles.carInfo}>
                            {order.car_image && (
                                <div className={styles.carImage}>
                                    <img src={order.car_image} alt={order.car_info} />
                                </div>
                            )}
                            <div className={styles.carDetails}>
                                <h3 className={styles.carName}>{order.car_info}</h3>
                                <p className={styles.carPrice}>
                                    Цена: {formatPrice(order.car.price)}
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/car/${order.car.id}`)}
                                >
                                    Перейти к автомобилю
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.detailsSection}>
                        <h2 className={styles.sectionTitle}>Детали заявки</h2>
                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Тип заявки:</span>
                                <span className={styles.detailValue}>
                                    {getOrderTypeLabel(order.order_type)}
                                </span>
                            </div>
                            {order.desired_date && (
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Желаемая дата:</span>
                                    <span className={styles.detailValue}>
                                        {formatDate(order.desired_date)}
                                    </span>
                                </div>
                            )}
                            {order.total_price && (
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Итоговая цена:</span>
                                    <span className={styles.detailValue}>
                                        {formatPrice(order.total_price)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {order.customer_comment && (
                            <div className={styles.comment}>
                                <h3 className={styles.commentTitle}>Ваш комментарий:</h3>
                                <p className={styles.commentText}>{order.customer_comment}</p>
                            </div>
                        )}

                        {order.manager_comment && isManager && (
                            <div className={styles.comment}>
                                <h3 className={styles.commentTitle}>Комментарий менеджера:</h3>
                                <p className={styles.commentText}>{order.manager_comment}</p>
                            </div>
                        )}
                    </div>

                    {order.assigned_to && (
                        <div className={styles.managerSection}>
                            <h2 className={styles.sectionTitle}>Менеджер</h2>
                            <div className={styles.managerInfo}>
                                <div className={styles.managerAvatar}>
                                    {order.assigned_to.avatar_url ? (
                                        <img src={order.assigned_to.avatar_url} alt={order.assigned_to.full_name} />
                                    ) : (
                                        <span className={styles.avatarPlaceholder}>
                                            {order.assigned_to.first_name?.[0]}
                                            {order.assigned_to.last_name?.[0]}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.managerDetails}>
                                    <p className={styles.managerName}>{order.assigned_to.full_name}</p>
                                    <p className={styles.managerContact}>{order.assigned_to.email}</p>
                                    <p className={styles.managerContact}>{order.assigned_to.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {order.review && (
                        <div className={styles.reviewSection}>
                            <h2 className={styles.sectionTitle}>Ваш отзыв</h2>
                            <div className={styles.review}>
                                <div className={styles.reviewRating}>
                                    {'★'.repeat(order.review.rating)}
                                    {'☆'.repeat(5 - order.review.rating)}
                                </div>
                                <p className={styles.reviewComment}>{order.review.comment}</p>
                                {order.review.pros && (
                                    <div className={styles.reviewPros}>
                                        <strong>Достоинства:</strong> {order.review.pros}
                                    </div>
                                )}
                                {order.review.cons && (
                                    <div className={styles.reviewCons}>
                                        <strong>Недостатки:</strong> {order.review.cons}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.orderActions}>
                    {order.status === 'new' && (
                        <Button
                            variant="danger"
                            onClick={handleCancelOrder}
                            loading={isCancelling}
                        >
                            Отменить заявку
                        </Button>
                    )}
                    {order.status === 'completed' && !order.review && (
                        <Button
                            variant="primary"
                            onClick={() => setIsReviewModalOpen(true)}
                        >
                            Оставить отзыв
                        </Button>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                title="Оставить отзыв"
            >
                <div className={styles.reviewForm}>
                    <div className={styles.ratingInput}>
                        <label>Оценка:</label>
                        <select
                            value={reviewData.rating}
                            onChange={(e) => setReviewData(prev => ({
                                ...prev,
                                rating: Number(e.target.value)
                            }))}
                        >
                            {[5, 4, 3, 2, 1].map(num => (
                                <option key={num} value={num}>{num} ★</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Комментарий"
                        value={reviewData.comment}
                        onChange={(e) => setReviewData(prev => ({
                            ...prev,
                            comment: e.target.value
                        }))}
                    />

                    <Input
                        label="Достоинства"
                        value={reviewData.pros}
                        onChange={(e) => setReviewData(prev => ({
                            ...prev,
                            pros: e.target.value
                        }))}
                    />

                    <Input
                        label="Недостатки"
                        value={reviewData.cons}
                        onChange={(e) => setReviewData(prev => ({
                            ...prev,
                            cons: e.target.value
                        }))}
                    />
                </div>

                <div className={styles.modalFooter}>
                    <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddReview}
                        loading={isAddingReview}
                    >
                        Отправить
                    </Button>
                </div>
            </Modal>
        </div>
    )
}