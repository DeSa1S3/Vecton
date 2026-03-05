import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { fetchCars, setFilters, setPage, setSort } from '../../store/slices/carsSlice';
import { CarFilters as CarFiltersComponent } from '../../components/car/CarFilters/CarFilters';
import { CarGrid } from '../../components/car/CarGrid/CarGrid';
import { Pagination } from '../../components/common/Pagination/Pagination';
import { Select } from '../../components/common/Select/Select';
import { Loader } from '../../components/common/Loader/Loader';
import { Image } from '../../components/common/Image/Image';
import styles from './CatalogPage.module.scss';
import { useAppSelector } from '../../store/hooks/useAppSelectors';

export const CatalogPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const { cars, totalCount, isLoading, filters, pagination, sort } = useAppSelector(
        (state: any) => state.cars
    );

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const params: Record<string, string> = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    params[key] = value.join(',');
                } else {
                    params[key] = value.toString();
                }
            }
        });
        params.page = pagination.page.toString();
        params.sort = sort;
        setSearchParams(params);
    }, [filters, pagination.page, sort, setSearchParams]);

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchCars({
            page: pagination.page,
            pageSize: pagination.pageSize,
            filters,
            sort
        }));
    }, [dispatch, pagination.page, pagination.pageSize, filters, sort]);

    const handlePageChange = (page: number) => {
        dispatch(setPage(page));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSort(e.target.value));
    };

    const sortOptions = [
        { value: '-created_at', label: 'Сначала новые' },
        { value: 'created_at', label: 'Сначала старые' },
        { value: '-price', label: 'Сначала дорогие' },
        { value: 'price', label: 'Сначала дешевые' },
        { value: '-year', label: 'Сначала новые по году' },
        { value: 'year', label: 'Сначала старые по году' },
    ];

    return (
        <div className={styles.catalogPage}>
            <div className={styles.catalogHero}>
                <Image
                    src="/images/catalog-bg.jpg"
                    alt="Catalog background"
                    width="100%"
                    height="300px"
                    objectFit="cover"
                />
                <div className={styles.catalogHeroContent}>
                    <h1>Каталог автомобилей</h1>
                </div>
            </div>

            <div className="container">
                <div className={styles.header}>
                    <div className={styles.controls}>
                        <button
                            className={styles.filterToggle}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Фильтры
                        </button>
                        <Select
                            options={sortOptions}
                            value={sort}
                            onChange={handleSortChange}
                        />
                    </div>
                </div>

                <div className={styles.content}>
                    <aside className={`${styles.filters} ${showFilters ? styles.active : ''}`}>
                        <CarFiltersComponent />
                    </aside>

                    <main className={styles.main}>
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <>
                                <div className={styles.stats}>
                                    Найдено автомобилей: <strong>{totalCount}</strong>
                                </div>
                                <CarGrid cars={cars} />
                                {totalCount > pagination.pageSize && (
                                    <Pagination
                                        currentPage={pagination.page}
                                        totalPages={Math.ceil(totalCount / pagination.pageSize)}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};