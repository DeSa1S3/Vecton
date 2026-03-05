import { useState, useMemo } from 'react';

interface UsePaginationProps {
    totalItems: number;
    pageSize?: number;
    initialPage?: number;
}

export const usePagination = ({
    totalItems,
    pageSize = 12,
    initialPage = 1,
}: UsePaginationProps) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = Math.ceil(totalItems / pageSize);

    const paginationRange = useMemo(() => {
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
    }, [currentPage, totalPages]);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return {
        currentPage,
        totalPages,
        paginationRange,
        goToPage,
        nextPage,
        prevPage,
    };
};