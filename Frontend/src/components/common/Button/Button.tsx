import React from 'react'
import styles from './Button.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
    size?: 'small' | 'medium' | 'large'
    fullWidth?: boolean
    loading?: boolean
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    loading = false,
    icon,
    iconPosition = 'left',
    className,
    disabled,
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        loading ? styles.loading : '',
        className,
    ].join(' ')

    return (
        <button
            className={buttonClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className={styles.spinner} />}
            {icon && iconPosition === 'left' && <span className={styles.iconLeft}>{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className={styles.iconRight}>{icon}</span>}
        </button>
    )
}