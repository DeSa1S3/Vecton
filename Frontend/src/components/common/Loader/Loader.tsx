import React from 'react';
import styles from './Loader.module.scss';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
    size = 'md',
    fullScreen = false,
}) => {
    const loader = (
        <div className={`${styles.loader} ${styles[`size-${size}`]}`}>
            <div className={styles.spinner} />
        </div>
    );

    if (fullScreen) {
        return <div className={styles.fullScreen}>{loader}</div>;
    }

    return loader;
};