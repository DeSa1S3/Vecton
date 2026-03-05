import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../store/hooks'; // Правильный импорт
import { changePassword } from '../../../store/slices/authSlice';
import { Input, Button } from '../../common';
import styles from './ChangePasswordForm.module.scss';

interface ChangePasswordFormValues {
    old_password: string;
    new_password: string;
    new_password2: string;
}

const validationSchema = Yup.object({
    old_password: Yup.string().required('Введите текущий пароль'),
    new_password: Yup.string()
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
        .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
        .required('Введите новый пароль'),
    new_password2: Yup.string()
        .oneOf([Yup.ref('new_password')], 'Пароли должны совпадать')
        .required('Подтвердите новый пароль'),
});

export const ChangePasswordForm: React.FC = () => {
    const dispatch = useAppDispatch();

    const formik = useFormik<ChangePasswordFormValues>({
        initialValues: {
            old_password: '',
            new_password: '',
            new_password2: '',
        },
        validationSchema,
        onSubmit: async (values: ChangePasswordFormValues) => {
            try {
                // @ts-ignore - временное игнорирование ошибок типов
                await dispatch(changePassword(values));
                formik.resetForm();
            } catch (error) {
                console.error('Error changing password:', error);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className={styles.form}>
            <h2>Изменение пароля</h2>

            <Input
                type="password"
                label="Текущий пароль"
                name="old_password"
                value={formik.values.old_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.old_password ? formik.errors.old_password : undefined}
            />

            <Input
                type="password"
                label="Новый пароль"
                name="new_password"
                value={formik.values.new_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.new_password ? formik.errors.new_password : undefined}
            />

            <Input
                type="password"
                label="Подтверждение пароля"
                name="new_password2"
                value={formik.values.new_password2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.new_password2 ? formik.errors.new_password2 : undefined}
            />

            <div className={styles.actions}>
                <Button type="submit" loading={formik.isSubmitting}>
                    Изменить пароль
                </Button>
            </div>
        </form>
    );
};