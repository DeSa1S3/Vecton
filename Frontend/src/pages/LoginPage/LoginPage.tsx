import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useLoginMutation } from '../../store/api/authApi'
import { useAppDispatch } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'
import { useToast } from '../../hooks/useToast'
import { Button } from '../../components/common/Button/Button'
import { Input } from '../../components/common/Input/Input'
import styles from './LoginPage.module.scss'

interface LoginFormData {
    email: string
    password: string
}

const loginSchema = yup.object({
    email: yup
        .string()
        .email('Введите корректный email')
        .required('Email обязателен'),
    password: yup
        .string()
        .required('Пароль обязателен')
        .min(8, 'Пароль должен содержать минимум 8 символов'),
})

export const LoginPage: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { showSuccess, showError } = useToast()
    const [login, { isLoading }] = useLoginMutation()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        mode: 'onBlur',
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await login(data).unwrap()
            dispatch(setCredentials(response))
            showSuccess('Вход выполнен успешно')
            navigate('/profile')
        } catch (error: any) {
            showError(error.data?.message || 'Ошибка входа')
        }
    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>Вход в Vecton</h1>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="example@mail.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <Input
                        label="Пароль"
                        type="password"
                        placeholder="********"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        fullWidth
                        loading={isLoading}
                    >
                        Войти
                    </Button>
                </form>

                <div className={styles.links}>
                    <Link to="/forgot-password" className={styles.link}>
                        Забыли пароль?
                    </Link>
                    <Link to="/register" className={styles.link}>
                        Нет аккаунта? Зарегистрироваться
                    </Link>
                </div>
            </div>
        </div>
    )
}