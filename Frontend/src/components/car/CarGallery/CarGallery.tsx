import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Pagination } from 'swiper/modules';
import { CarImage } from '../../../types';
import styles from './CarGallery.module.scss';

interface CarGalleryProps {
    images: CarImage[];
}

export const CarGallery: React.FC<CarGalleryProps> = ({ images }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    if (!images || images.length === 0) {
        return (
            <div className={styles.placeholder}>
                <div className={styles.noImage}>Нет фотографий</div>
            </div>
        );
    }

    return (
        <div className={styles.gallery}>



            {selectedImage && (
                <div className={styles.modal} onClick={() => setSelectedImage(null)}>
                    <img
                        src={images.find(img => img.id === selectedImage)?.image_url}
                        alt="Full size"
                        className={styles.modalImage}
                    />
                </div>
            )}
        </div>
    );
};