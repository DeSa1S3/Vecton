import React, { SelectHTMLAttributes } from 'react';
import styles from './Select.module.scss';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    error?: string;
    fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    error,
    fullWidth = true,
    className,
    id,
    ...props
}) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`${styles.selectWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
            {label && (
                <label htmlFor={selectId} className={styles.label}>
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`${styles.select} ${error ? styles.error : ''} ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};