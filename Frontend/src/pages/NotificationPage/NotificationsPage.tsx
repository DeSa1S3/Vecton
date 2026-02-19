import React, { useState } from 'react'
import { useGetNotificationsQuery, useMarkAsReadMutation } from '../../store/api/notificationsApi'
import { useToast } from '../../hooks/useToast'
import { formatDate } from '../../utils/formatters'
import { Button } from '../../components/common/Button/Button'
import { Loader } from '../../components/common/Loader/Loader'
import styles from './NotificationsPage.module.scss'

export const NotificationsPage: React.FC = () => {
    const [page, setPage] = useState(1)
    const { data, isLoading, refetch } = useGetNotificationsQuery({ page })
    const [markAsRead] = useMarkAsReadMutation()
    const { showSuccess } = useToast()

    const handleMarkAllAsRead = async () => {
        try {
            await markAsRead({ mark_all: true }).unwrap()
            showSuccess('Все уведомления отмечены как прочитанные')
            refetch()
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        }
    }

    const handleMarkAsRead = async (id: number) => {
        try {
            await markAsRead({ notification_ids: [id] }).unwrap()
            refetch()
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }

    if (isLoading) {
        return <Loader fullScreen />
    }

    const hasUnread = data?.results.some(n => !n.is_read)

    return (
        <div className={styles.notificationsPage}>
            <div className={styles.header}>
                <h1 className={styles.title}>Уведомления</h1>
                {hasUnread && (
                    <Button variant="outline" onClick={handleMarkAllAsRead}>
                        Отметить все как прочитанные
                    </Button>
                )}
            </div>

            {data?.results.length === 0 ? (
                <div className={styles.empty}>
                    <p>У вас нет уведомлений</p>
                </div>
            ) : (
                <div className={styles.notificationsList}>
                    {data?.results.map((notification) => (
                        <div
                            key={notification.id}
                            className={`${styles.notification} ${!notification.is_read ? styles.unread : ''
                                }`}
                            onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                        >
                            <div className={styles.notificationHeader}>
                                <span className={styles.notificationType}>
                                    {notification.type === 'email' && '✉️ Email'}
                                    {notification.type === 'sms' && '📱 SMS'}
                                    {notification.type === 'push' && '🔔 Push'}
                                    {notification.type === 'telegram' && '📨 Telegram'}
                                </span>
                                <span className={styles.notificationDate}>
                                    {formatDate(notification.created_at)}
                                </span>
                            </div>

                            <h3 className={styles.notificationTitle}>
                                {notification.title}
                            </h3>

                            <p className={styles.notificationMessage}>
                                {notification.message}
                            </p>

                            {!notification.is_read && (
                                <span className={styles.unreadBadge}>Новое</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {data && data.total_pages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageButton}
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        ←
                    </button>
                    <span className={styles.pageInfo}>
                        {page} из {data.total_pages}
                    </span>
                    <button
                        className={styles.pageButton}
                        disabled={page === data.total_pages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    )
}