import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCreateOrderMutation } from '../../../../store/api/ordersApi'
import { useToast } from '../../../../hooks/useToast'
import { Button } from '../../../common/Button/Button'
import { Input } from '../../../common/Input/Input'
import styles from './OrderForm.module.scss'

interface OrderFormProps {
    carId: number
    onSuccess?: () => void
}

interface OrderFormData {
    order_type: 'test_drive' | 'purchase' | 'trade_in' | 'consultation'
    customer_comment?: string
    desired_date?: string
}

const orderSchema = yup.object({
    order_type: yup
        .string()
        .oneOf(['test_drive', 'purchase', 'trade_in', 'consultation'], 'Выберите тип заявки')
        .required('Тип заявки обязателен'),
    customer_comment: yup
        .string()
        .max(500, 'Комментарий не должен превышать 500 символов'),
    desired_date: yup
        .string()
        .when('order_type', {
            is: 'test_drive',
            then: (schema) => schema.required('Укажите желаемую дату'),
            otherwise: (schema) => schema.optional(),
        }),
})

export const OrderForm: React.FC<OrderFormProps> = ({ carId, onSuccess }) => {
    const [createOrder, { isLoading }] = useCreateOrderMutation()
    const { showSuccess, showError } = useToast()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<OrderFormData>({
        resolver: yupResolver(orderSchema),
        defaultValues: {
            order_type: 'test_drive',
        },
    })

    const orderType = watch('order_type')

    const onSubmit = async (data: OrderFormData) => {
        try {
            await createOrder({
                car: carId,
                ...data,
            }).unwrap()

            showSuccess('Заявка успешно создана')
            reset()
            onSuccess?.()
        } catch (error) {
            showError('Ошибка при создании заявки')
        }
    }

    return (
        <div className={styles.orderForm}>
            <h2 className={styles.title}>Оставить заявку</h2>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Тип заявки *</label>
                    <select
                        className={`${styles.select} ${errors.order_type ? styles.error : ''}`}
                        {...register('order_type')}
                    >
                        <option value="test_drive">Тест-драйв</option>
                        <option value="purchase">Покупка</option>
                        <option value="trade_in">Trade-in</option>
                        <option value="consultation">Консультация</option>
                    </select>
                    {errors.order_type && (
                        <span className={styles.errorMessage}>{errors.order_type.message}</span>
                    )}
                </div>

                {orderType === 'test_drive' && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Желаемая дата *</label>
                        <Input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            error={errors.desired_date?.message}
                            {...register('desired_date')}
                        />
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label className={styles.label}>Комментарий</label>
                    <textarea
                        className={`${styles.textarea} ${errors.customer_comment ? styles.error : ''}`}
                        rows={4}
                        placeholder="Ваши пожелания, вопросы или дополнительная информация"
                        {...register('customer_comment')}
                    />
                    {errors.customer_comment && (
                        <span className={styles.errorMessage}>{errors.customer_comment.message}</span>
                    )}
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={isLoading}
                >
                    Отправить заявку
                </Button>
            </form>
        </div>
    )
}