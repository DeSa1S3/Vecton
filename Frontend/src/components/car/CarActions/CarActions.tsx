import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../../types';
import { Button } from '../../common';
import { useAuth } from '../../../hooks';
import { formatPrice } from '../../../utils/formatters';
import styles from './CarActions.module.scss';

interface CarActionsProps {
    car: Car;
    onOrderClick: () => void;
}

export const CarActions: React.FC<CarActionsProps> = ({ car, onOrderClick }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleOrderClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        onOrderClick();
    };

    const handleTestDrive = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        onOrderClick();
    };

    const handleTradeIn = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/trade-in', { state: { car } });
    };

    const handleCredit = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/credit', { state: { car } });
    };

    return (
        <div className={styles.actions}>
            <div className={styles.price}>
                <span className={styles.label}>Цена</span>
                <span className={styles.value}>{formatPrice(car.price)}</span>
            </div>

            <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleOrderClick}
                disabled={car.status !== 'in_stock'}
            >
                {car.status === 'in_stock' ? 'Купить' : 'Недоступен'}
            </Button>

            <div className={styles.additional}>
                <Button variant="outline" fullWidth onClick={handleTestDrive}>
                    Тест-драйв
                </Button>
                <Button variant="outline" fullWidth onClick={handleTradeIn}>
                    Trade-in
                </Button>
                <Button variant="outline" fullWidth onClick={handleCredit}>
                    В кредит
                </Button>
            </div>

            {car.vin && (
                <div className={styles.vin}>
                    VIN: <span>{car.vin}</span>
                </div>
            )}
        </div>
    );
};