import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRegisterMutation } from '../../store/api/authApi'
import { useAppDispatch } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'
import { useToast } from '../../hooks/useToast'
import { Button } from '../../components/common/Button/Button'
import { Input } from '../../components/common/Input/Input'
import styles from './RegisterPage.module.scss'

interface RegisterFormData {
    email: string
    phone: string
    first_name: string
    last_name: string
    patronymic?: string
    company_name?: string
    password: string
    password2: string
    agreed_to_terms: boolean
}

const registerSchema = yup.object({
    email: yup
        .string()
        .email('Введите корректный email')
        .required('Email обязателен'),

    phone: yup
        .string()
        .matches(
            /^7\d{10}$/,
            'Телефон должен быть в формате 79991234567'
        )
        .required('Телефон обязателен'),

    first_name: yup
        .string()
        .required('Имя обязательно')
        .min(2, 'Имя должно содержать минимум 2 символа'),

    last_name: yup
        .string()
        .required('Фамилия обязательна')
        .min(2, 'Фамилия должна содержать минимум 2 символа'),

    patronymic: yup.string().optional(),

    company_name: yup.string().optional(),

    password: yup
        .string()
        .required('Пароль обязателен')
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Пароль должен содержать заглавные, строчные буквы и цифры'
        ),

    password2: yup
        .string()
        .required('Подтверждение пароля обязательно')
        .oneOf([yup.ref('password')], 'Пароли должны совпадать'),

    agreed_to_terms: yup
        .boolean()
        .oneOf([true], 'Необходимо принять условия'),
})

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { showSuccess, showError } = useToast()
    const [register, { isLoading }] = useRegisterMutation()

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
        mode: 'onBlur',
    })

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await register(data).unwrap()
            dispatch(setCredentials(response))
            showSuccess('Регистрация успешна')
            navigate('/profile')
        } catch (error: any) {
            if (error.data) {
                Object.keys(error.data).forEach((key) => {
                    setError(key as any, {
                        type: 'server',
                        message: error.data[key][0],
                    })
                })
            }
            showError('Ошибка регистрации')
        }
    }

    return (
        <div className={styles.registerPage}>
            <div className={styles.registerCard}>
                <h1 className={styles.title}>Регистрация в Vecton</h1>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.row}>
                        <Input
                            label="Имя *"
                            placeholder="Иван"
                            error={errors.first_name?.message}
                            {...registerField('first_name')}
                        />

                        <Input
                            label="Фамилия *"
                            placeholder="Петров"
                            error={errors.last_name?.message}
                            {...registerField('last_name')}
                        />
                    </div>

                    <Input
                        label="Отчество"
                        placeholder="Иванович"
                        error={errors.patronymic?.message}
                        {...registerField('patronymic')}
                    />

                    <Input
                        label="Email *"
                        type="email"
                        placeholder="example@mail.com"
                        error={errors.email?.message}
                        {...registerField('email')}
                    />

                    <Input
                        label="Телефон *"
                        placeholder="79991234567"
                        error={errors.phone?.message}
                        helperText="Формат: 79991234567"
                        {...registerField('phone')}
                    />

                    <Input
                        label="Название компании"
                        placeholder="ООО 'АвтоМир'"
                        error={errors.company_name?.message}
                        {...registerField('company_name')}
                    />

                    <Input
                        label="Пароль *"
                        type="password"
                        placeholder="********"
                        error={errors.password?.message}
                        {...registerField('password')}
                    />

                    <Input
                        label="Подтверждение пароля *"
                        type="password"
                        placeholder="********"
                        error={errors.password2?.message}
                        {...registerField('password2')}
                    />

                    <div className={styles.checkbox}>
                        <input
                            type="checkbox"
                            id="terms"
                            {...registerField('agreed_to_terms')}
                        />
                        <label htmlFor="terms">
                            Я принимаю условия пользовательского соглашения *
                        </label>
                    </div>
                    {errors.agreed_to_terms && (
                        <div className={styles.checkboxError}>
                            {errors.agreed_to_terms.message}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        fullWidth
                        loading={isLoading}
                    >
                        Зарегистрироваться
                    </Button>
                </form>

                <div className={styles.loginLink}>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </div>
            </div>
        </div>
    )
}