import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import { Input, Button } from '../../components/common';
import styles from './LoginPage.module.scss';

interface LoginFormValues {
    email: string;
    password: string;
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Введите корректный email')
        .required('Email обязателен'),
    password: Yup.string()
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .required('Пароль обязателен'),
});

export const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const formik = useFormik<LoginFormValues>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values: LoginFormValues) => {
            try {
                // @ts-ignore - временное игнорирование ошибок типов
                const result = await dispatch(login(values));
                if (login.fulfilled.match(result)) {
                    navigate('/');
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        },
    });

    return (
        <div className={styles.loginPage}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1>Вход в Vecton</h1>
                        <p>Войдите в свой аккаунт</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className={styles.form}>
                        <Input
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="example@mail.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email ? formik.errors.email : undefined}
                        />

                        <Input
                            type="password"
                            name="password"
                            label="Пароль"
                            placeholder="********"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password ? formik.errors.password : undefined}
                        />

                        <div className={styles.forgotPassword}>
                            <Link to="/forgot-password">Забыли пароль?</Link>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            loading={formik.isSubmitting}
                        >
                            Войти
                        </Button>
                    </form>

                    <div className={styles.footer}>
                        <p>
                            Нет аккаунта?{' '}
                            <Link to="/register">Зарегистрироваться</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};