import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './Pagination.module.scss';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const getPageNumbers = () => {
        const delta = 2;
        const range: (number | string)[] = [];
        const rangeWithDots: (number | string)[] = [];

        for (
            let i = 1;
            i <= Math.min(2 * delta + 1, totalPages);
            i++
        ) {
            range.push(i);
        }

        if (currentPage > delta + 2) {
            rangeWithDots.push(1, '...');
            rangeWithDots.push(...range.slice(1));
        } else {
            rangeWithDots.push(...range);
        }

        if (currentPage < totalPages - delta - 1) {
            if (rangeWithDots[rangeWithDots.length - 1] !== '...') {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    className={`${styles.pageButton} ${page === currentPage ? styles.active : ''
                        } ${page === '...' ? styles.dots : ''}`}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                >
                    {page}
                </button>
            ))}

            <button
                className={styles.pageButton}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
            </button>
        </div>
    );
};