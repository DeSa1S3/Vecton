import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-input-2';
import { useAppDispatch } from '../../store/hooks';
import { register } from '../../store/slices/authSlice';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input/Input';
import styles from './RegisterPage.module.scss';

interface RegisterFormValues {
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    patronymic: string;
    password: string;
    password2: string;
    agreed_to_terms: boolean;
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Введите корректный email')
        .required('Email обязателен'),
    phone: Yup.string()
        .required('Телефон обязателен'),
    first_name: Yup.string()
        .required('Имя обязательно'),
    last_name: Yup.string()
        .required('Фамилия обязательна'),
    password: Yup.string()
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
        .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
        .required('Пароль обязателен'),
    password2: Yup.string()
        .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
        .required('Подтверждение пароля обязательно'),
    agreed_to_terms: Yup.boolean()
        .oneOf([true], 'Необходимо принять условия'),
});

export const RegisterPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const formik = useFormik<RegisterFormValues>({
        initialValues: {
            email: '',
            phone: '',
            first_name: '',
            last_name: '',
            patronymic: '',
            password: '',
            password2: '',
            agreed_to_terms: false,
        },
        validationSchema,
        onSubmit: async (values: RegisterFormValues) => {
            try {
                // @ts-ignore - временное игнорирование ошибок типов
                const resultAction = await dispatch(register(values));
                if (register.fulfilled.match(resultAction)) {
                    navigate('/');
                }
            } catch (error) {
                console.error('Registration error:', error);
            }
        },
    });

    return (
        <div className={styles.registerPage}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1>Регистрация</h1>
                        <p>Создайте аккаунт в Vecton</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className={styles.form}>
                        <div className={styles.row}>
                            <Input
                                name="last_name"
                                label="Фамилия"
                                placeholder="Иванов"
                                value={formik.values.last_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.last_name ? formik.errors.last_name : undefined}
                            />

                            <Input
                                name="first_name"
                                label="Имя"
                                placeholder="Иван"
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.first_name ? formik.errors.first_name : undefined}
                            />
                        </div>

                        <Input
                            name="patronymic"
                            label="Отчество"
                            placeholder="Иванович"
                            value={formik.values.patronymic}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.patronymic ? formik.errors.patronymic : undefined}
                        />

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

                        <div className={styles.phoneInput}>
                            <label className="form-label">Телефон</label>
                            <PhoneInput
                                country={'ru'}
                                value={formik.values.phone}
                                onChange={(phone: string) => formik.setFieldValue('phone', phone)}
                                onBlur={() => formik.setFieldTouched('phone', true)}
                                inputClass={formik.touched.phone && formik.errors.phone ? 'error' : ''}
                                containerClass={styles.phoneContainer}
                                inputStyle={{
                                    width: '100%',
                                    height: '42px',
                                    border: `1px solid ${formik.touched.phone && formik.errors.phone ? '#ef4444' : '#d1d5db'}`,
                                    borderRadius: '8px',
                                }}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <div className="error-message">{formik.errors.phone}</div>
                            )}
                        </div>

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

                        <Input
                            type="password"
                            name="password2"
                            label="Подтверждение пароля"
                            placeholder="********"
                            value={formik.values.password2}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password2 ? formik.errors.password2 : undefined}
                        />

                        <div className={styles.terms}>
                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="agreed_to_terms"
                                    checked={formik.values.agreed_to_terms}
                                    onChange={formik.handleChange}
                                />
                                <span>
                                    Я принимаю <Link to="/terms">условия использования</Link> и{' '}
                                    <Link to="/privacy">политику конфиденциальности</Link>
                                </span>
                            </label>
                            {formik.touched.agreed_to_terms && formik.errors.agreed_to_terms && (
                                <div className="error-message">{formik.errors.agreed_to_terms}</div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            loading={formik.isSubmitting}
                        >
                            Зарегистрироваться
                        </Button>
                    </form>

                    <div className={styles.footer}>
                        <p>
                            Уже есть аккаунт?{' '}
                            <Link to="/login">Войти</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};