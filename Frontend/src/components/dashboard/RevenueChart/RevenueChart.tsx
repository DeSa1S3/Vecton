import React from 'react';

import { formatPrice } from '../../../utils/formatters';
import styles from './RevenueChart.module.scss';

interface RevenueChartProps {
    data: any;
    period: 'day' | 'week' | 'month' | 'year';
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, period }) => {
    const getLabels = () => {

        const now = new Date();
        const labels = [];

        if (period === 'day') {
            for (let i = 0; i < 24; i++) {
                labels.push(`${i}:00`);
            }
        } else if (period === 'week') {
            const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
            labels.push(...days);
        } else if (period === 'month') {
            for (let i = 1; i <= 30; i++) {
                labels.push(`${i} ${now.toLocaleString('ru', { month: 'short' })}`);
            }
        } else {
            const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
            labels.push(...months);
        }

        return labels;
    };

    const chartData = {
        labels: getLabels(),
        datasets: [
            {
                label: 'Выручка',
                data: data?.data || Array(30).fill(0).map(() => Math.random() * 1000000),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return formatPrice(context.raw);
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => {
                        return formatPrice(value);
                    },
                },
                grid: {
                    color: '#f0f0f0',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className={styles.chart}>
            <div className={styles.stats}>
                <div className={styles.stat}>
                    <span className={styles.label}>Общая выручка</span>
                    <span className={styles.value}>{formatPrice(data?.total_revenue || 0)}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.label}>Средний чек</span>
                    <span className={styles.value}>{formatPrice(data?.avg_order_value || 0)}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.label}>Количество заказов</span>
                    <span className={styles.value}>{data?.orders_count || 0}</span>
                </div>
            </div>
        </div>
    );
};