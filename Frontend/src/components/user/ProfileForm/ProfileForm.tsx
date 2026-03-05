import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-input-2';
import { User } from '../../../types';
import { useAppDispatch } from '../../../store/hooks';
import { updateProfile } from '../../../store/slices/authSlice';
import { Input, Button } from '../../common';
import styles from './ProfileForm.module.scss';

interface ProfileFormProps {
    user: User;
}

interface ProfileFormValues {
    first_name: string;
    last_name: string;
    patronymic: string;
    email: string;
    phone: string;
    company_name: string;
}

const validationSchema = Yup.object({
    first_name: Yup.string().required('Имя обязательно'),
    last_name: Yup.string().required('Фамилия обязательна'),
    email: Yup.string().email('Введите корректный email').required('Email обязателен'),
    phone: Yup.string().required('Телефон обязателен'),
    patronymic: Yup.string(),
    company_name: Yup.string(),
});

export const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
    const dispatch = useAppDispatch();

    const formik = useFormik<ProfileFormValues>({
        initialValues: {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            patronymic: user.patronymic || '',
            email: user.email || '',
            phone: user.phone || '',
            company_name: user.company_name || '',
        },
        validationSchema,
        onSubmit: async (values: ProfileFormValues) => {
            try {
                // @ts-ignore - временное игнорирование ошибок типов
                await dispatch(updateProfile(values));
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        },
    });

    // Функция для безопасного получения ошибки в виде строки
    const getFieldError = (field: keyof ProfileFormValues): string | undefined => {
        const error = formik.errors[field];
        const touched = formik.touched[field];

        if (touched && error) {
            return typeof error === 'string' ? error : undefined;
        }
        return undefined;
    };

    return (
        <form onSubmit={formik.handleSubmit} className={styles.form}>
            <h2>Личные данные</h2>

            <div className={styles.row}>
                <Input
                    label="Фамилия"
                    name="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('last_name')}
                />

                <Input
                    label="Имя"
                    name="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('first_name')}
                />
            </div>

            <Input
                label="Отчество"
                name="patronymic"
                value={formik.values.patronymic}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={getFieldError('patronymic')}
            />

            <Input
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={getFieldError('email')}
            />

            <div className={styles.phoneInput}>
                <label className="form-label">Телефон</label>
                {formik.touched.phone && formik.errors.phone && (
                    <div className="error-message">{String(formik.errors.phone)}</div>
                )}
            </div>

            <Input
                label="Название компании"
                name="company_name"
                value={formik.values.company_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={getFieldError('company_name')}
            />

            <div className={styles.actions}>
                <Button type="submit" loading={formik.isSubmitting}>
                    Сохранить изменения
                </Button>
            </div>
        </form>
    );
};