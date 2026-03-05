import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Car, OrderType } from '../../../types'; // Импортируем OrderType
import { useAppDispatch } from '../../../store/hooks';
import { createOrder } from '../../../store/slices/ordersSlice';
import { Modal, Input, Select, Button } from '../../common';
import { ORDER_TYPES } from '../../../utils/constants';
import styles from './OrderForm.module.scss';

interface OrderFormProps {
    car: Car;
    onClose: () => void;
}

interface OrderFormValues {
    order_type: string;
    customer_comment: string;
    desired_date: string;
}

const validationSchema = Yup.object({
    order_type: Yup.string().required('Выберите тип заявки'),
    desired_date: Yup.date()
        .nullable()
        .min(new Date(), 'Дата должна быть в будущем'),
});

export const OrderForm: React.FC<OrderFormProps> = ({ car, onClose }) => {
    const dispatch = useAppDispatch();

    const formik = useFormik<OrderFormValues>({
        initialValues: {
            order_type: 'purchase',
            customer_comment: '',
            desired_date: '',
        },
        validationSchema,
        onSubmit: async (values: OrderFormValues) => {
            try {
                // Приводим order_type к типу OrderType
                const orderData = {
                    car: car.id,
                    order_type: values.order_type as OrderType, // Приведение типа
                    customer_comment: values.customer_comment,
                    desired_date: values.desired_date || null,
                };

                // @ts-ignore - временное игнорирование ошибок типов
                await dispatch(createOrder(orderData));
                onClose();
            } catch (error) {
                console.error('Error creating order:', error);
            }
        },
    });

    const orderTypeOptions = Object.entries(ORDER_TYPES).map(([value, label]) => ({
        value,
        label,
    }));

    return (
        <Modal isOpen={true} onClose={onClose} title="Оформление заявки">
            <form onSubmit={formik.handleSubmit} className={styles.form}>
                <div className={styles.carInfo}>
                    {car.main_image ? (
                        <img
                            src={car.main_image}
                            alt={`${car.brand} ${car.model}`}
                            className={styles.carImage}
                        />
                    ) : (
                        <div className={styles.carImagePlaceholder}>Нет фото</div>
                    )}
                    <div className={styles.carDetails}>
                        <h3>
                            {car.brand} {car.model}, {car.year}
                        </h3>
                        <p className={styles.carPrice}>{car.formatted_price}</p>
                        <p className={styles.carMileage}>{car.formatted_mileage}</p>
                    </div>
                </div>

                <Select
                    label="Тип заявки"
                    name="order_type"
                    options={orderTypeOptions}
                    value={formik.values.order_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.order_type ? formik.errors.order_type : undefined}
                />

                <Input
                    type="date"
                    label="Желаемая дата"
                    name="desired_date"
                    value={formik.values.desired_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.desired_date ? formik.errors.desired_date : undefined}
                    min={new Date().toISOString().split('T')[0]}
                />

                <Input
                    type="textarea"
                    label="Комментарий"
                    name="customer_comment"
                    value={formik.values.customer_comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.customer_comment ? formik.errors.customer_comment : undefined}
                    placeholder="Дополнительная информация, пожелания и т.д."
                />

                <div className={styles.actions}>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button type="submit" loading={formik.isSubmitting}>
                        Отправить заявку
                    </Button>
                </div>
            </form>
        </Modal>
    );
};