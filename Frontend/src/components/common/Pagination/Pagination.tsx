import React from 'react'
import styles from './Pagination.module.scss'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    siblingCount?: number
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
}) => {
    const getPageNumbers = () => {
        const pages: (number | string)[] = []

        pages.push(1)

        const leftSibling = Math.max(2, currentPage - siblingCount)
        const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount)

        if (leftSibling > 2) {
            pages.push('...')
        }

        for (let i = leftSibling; i <= rightSibling; i++) {
            pages.push(i)
        }

        if (rightSibling < totalPages - 1) {
            pages.push('...')
        }

        if (totalPages > 1) {
            pages.push(totalPages)
        }

        return pages
    }

    const pages = getPageNumbers()

    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ←
            </button>

            {pages.map((page, index) => (
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
                →
            </button>
        </div>
    )
}