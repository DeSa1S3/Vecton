import React from 'react'
import { type PopularCar } from '../../../../api/types'
import styles from './PopularCarsChart.module.scss'

interface PopularCarsChartProps {
    data: PopularCar[]
}

export const PopularCarsChart: React.FC<PopularCarsChartProps> = ({ data }) => {
    const maxOrders = Math.max(...data.map(item => item.orders_count), 1)

    return (
        <div className={styles.chart}>
            {data.length === 0 ? (
                <div className={styles.empty}>Нет данных</div>
            ) : (
                data.map((car) => {
                    const percentage = (car.orders_count / maxOrders) * 100

                    return (
                        <div key={car.id} className={styles.chartItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.carName}>
                                    {car.brand} {car.model} ({car.year})
                                </span>
                                <span className={styles.carStats}>
                                    {car.orders_count} заказов • {car.views_count} просмотров
                                </span>
                            </div>
                            <div className={styles.barContainer}>
                                <div
                                    className={styles.bar}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}