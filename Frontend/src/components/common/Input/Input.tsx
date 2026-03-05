import React, { InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    fullWidth = true,
    className,
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`${styles.input} ${error ? styles.error : ''} ${className}`}
                {...props}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};