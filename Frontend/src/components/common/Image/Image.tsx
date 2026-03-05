import React, { useState } from 'react';
import styles from './Image.module.scss';

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
    width?: number | string;
    height?: number | string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const defaultFallback = '/images/car-placeholder.jpg';

export const Image: React.FC<ImageProps> = ({
    src,
    alt,
    className,
    fallbackSrc = defaultFallback,
    width,
    height,
    objectFit = 'cover',
    ...props
}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    return (
        <div
            className={`${styles.imageContainer} ${className}`}
            style={{ width, height }}
        >
            {loading && <div className={styles.skeleton} />}
            <img
                src={error ? fallbackSrc : src}
                alt={alt}
                className={`${styles.image} ${loading ? styles.hidden : ''}`}
                style={{ objectFit }}
                onLoad={() => setLoading(false)}
                onError={() => {
                    setError(true);
                    setLoading(false);
                }}
                {...props}
            />
        </div>
    );
};