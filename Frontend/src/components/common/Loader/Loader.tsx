import React from 'react'
import styles from './Loader.module.scss'

interface LoaderProps {
    size?: 'small' | 'medium' | 'large'
    fullScreen?: boolean
}

export const Loader: React.FC<LoaderProps> = ({
    size = 'medium',
    fullScreen = false
}) => {
    const loader = <div className={`${styles.loader} ${styles[size]}`} />

    if (fullScreen) {
        return (
            <div className={styles.fullScreen}>
                {loader}
            </div>
        )
    }

    return loader
}