import React, { forwardRef } from 'react'
import styles from './Input.module.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, fullWidth = true, className, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

        return (
            <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
                    {...props}
                />
                {error && <span className={styles.errorMessage}>{error}</span>}
                {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
            </div>
        )
    }
)

Input.displayName = 'Input'