import React from 'react';
import { formatNumber } from '../../../utils/formatters';
import styles from './StatsCard.module.scss';

interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    color,
}) => {
    return (
        <div className={styles.card}>
            <div className={styles.icon} style={{ backgroundColor: `${color}20`, color }}>
                {icon}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.value}>{formatNumber(value)}</p>
            </div>
        </div>
    );
};