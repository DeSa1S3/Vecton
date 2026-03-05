import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    className,
    disabled,
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[`button-${variant}`],
        styles[`button-${size}`],
        fullWidth ? styles['button-full-width'] : '',
        loading ? styles['button-loading'] : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            className={buttonClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className={styles.spinner} />}
            {icon && <span className={styles.icon}>{icon}</span>}
            {children && <span className={styles.text}>{children}</span>}
        </button>
    );
};