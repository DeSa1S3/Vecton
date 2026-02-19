import React, { useState } from 'react'
import { useGetCarsQuery, useDeleteCarMutation } from '../../../../store/api/carsApi'
import { useToast } from '../../../../hooks/useToast'
import { Button } from '../../../common/Button/Button'
import { Modal } from '../../../common/Modal/Modal'
import { CarForm } from '../CarForm/CarForm'
import { formatPrice } from '../../../../utils/formatters'
import { CAR_STATUSES } from '../../../../utils/constants'
import styles from './CarManagementTable.module.scss'

export const CarManagementTable: React.FC = () => {
    const [page, setPage] = useState(1)
    const [selectedCar, setSelectedCar] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

    const { data, isLoading, refetch } = useGetCarsQuery({
        page,
        page_size: 10,
        ordering: '-created_at'
    })

    const [deleteCar] = useDeleteCarMutation()
    const { showSuccess, showError } = useToast()

    const handleEdit = (carId: number) => {
        setSelectedCar(carId)
        setModalMode('edit')
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setSelectedCar(null)
        setModalMode('create')
        setIsModalOpen(true)
    }

    const handleDelete = async (carId: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) return

        try {
            await deleteCar(carId).unwrap()
            showSuccess('Автомобиль удален')
            refetch()
        } catch (error) {
            showError('Ошибка при удалении')
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setSelectedCar(null)
        refetch()
    }

    const getStatusLabel = (status: string) => {
        const statusConfig = CAR_STATUSES.find(s => s.value === status)
        return statusConfig?.label || status
    }

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Управление автомобилями</h3>
                <Button variant="primary" onClick={handleCreate}>
                    + Добавить автомобиль
                </Button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Фото</th>
                            <th>Марка/Модель</th>
                            <th>Год</th>
                            <th>Цена</th>
                            <th>Статус</th>
                            <th>Просмотры</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.results.map((car) => (
                            <tr key={car.id}>
                                <td>
                                    {car.main_image ? (
                                        <img
                                            src={car.main_image}
                                            alt={`${car.brand} ${car.model}`}
                                            className={styles.carImage}
                                        />
                                    ) : (
                                        <div className={styles.noImage}>Нет фото</div>
                                    )}
                                </td>
                                <td>
                                    <div className={styles.carName}>
                                        {car.brand} {car.model}
                                    </div>
                                </td>
                                <td>{car.year}</td>
                                <td>{formatPrice(car.price)}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles[car.status]}`}>
                                        {getStatusLabel(car.status)}
                                    </span>
                                </td>
                                <td>{car.views_count}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => handleEdit(car.id)}
                                            title="Редактировать"
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDelete(car.id)}
                                            title="Удалить"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {data?.results.length === 0 && (
                    <div className={styles.empty}>
                        <p>Автомобили не найдены</p>
                        <Button variant="primary" onClick={handleCreate}>
                            Добавить первый автомобиль
                        </Button>
                    </div>
                )}
            </div>

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

            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={modalMode === 'create' ? 'Добавление автомобиля' : 'Редактирование автомобиля'}
                size="large"
            >
                <CarForm
                    carId={selectedCar || undefined}
                    onSuccess={handleModalClose}
                />
            </Modal>
        </div>
    )
}