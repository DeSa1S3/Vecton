import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { type CarImage } from '../../../../api/types'
import styles from './ImageGallery.module.scss'

interface ImageGalleryProps {
    images: CarImage[]
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const mainImage = images[currentIndex] || images[0]

    if (!images.length) {
        return (
            <div className={styles.noImage}>
                <div className={styles.placeholder}>Нет изображений</div>
            </div>
        )
    }

    const slides = images.map(img => ({
        src: img.image_url,
        alt: `Фото автомобиля`,
    }))

    return (
        <div className={styles.gallery}>
            <div className={styles.main}>
                <img
                    src={mainImage.image_url}
                    alt="Автомобиль"
                    onClick={() => setIsOpen(true)}
                    className={styles.mainImage}
                />
                <button
                    className={styles.fullscreenButton}
                    onClick={() => setIsOpen(true)}
                    aria-label="Открыть на весь экран"
                >
                    ⛶
                </button>
            </div>

            {images.length > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((img, idx) => (
                        <button
                            key={img.id}
                            className={`${styles.thumbnail} ${idx === currentIndex ? styles.active : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                        >
                            <img src={img.image_url} alt={`Фото ${idx + 1}`} />
                        </button>
                    ))}
                </div>
            )}

            <Lightbox
                open={isOpen}
                close={() => setIsOpen(false)}
                slides={slides}
                index={currentIndex}
            />
        </div>
    )
}