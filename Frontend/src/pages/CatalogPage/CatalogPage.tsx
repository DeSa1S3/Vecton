import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetCarsQuery, useGetBrandsQuery } from '../../store/api/carsApi'
import { CarCard } from '../../components/features/cars/CarCard/CarCard'
import { FilterSidebar } from '../../components/features/cars/FilterSidebar/FilterSidebar'
import { Pagination } from '../../components/common/Pagination/Pagination'
import { SORT_OPTIONS } from '../../utils/constants'
import styles from './CatalogPage.module.scss'

export const CatalogPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    const page = Number(searchParams.get('page')) || 1
    const sort = searchParams.get('sort') || '-created_at'

    const { data, isLoading } = useGetCarsQuery({
        page,
        ordering: sort,
        brand: searchParams.getAll('brand'),
        price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
        price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
        year_min: searchParams.get('year_min') ? Number(searchParams.get('year_min')) : undefined,
        year_max: searchParams.get('year_max') ? Number(searchParams.get('year_max')) : undefined,
        transmission: searchParams.getAll('transmission'),
        drive: searchParams.getAll('drive'),
        fuel_type: searchParams.getAll('fuel_type'),
        body_type: searchParams.getAll('body_type'),
    })

    const { data: brands } = useGetBrandsQuery()

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('sort', e.target.value)
        newParams.set('page', '1')
        setSearchParams(newParams)
    }

    const handlePageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('page', newPage.toString())
        setSearchParams(newParams)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const toggleMobileFilters = () => {
        setMobileFiltersOpen(!mobileFiltersOpen)
    }

    return (
        <div className={styles.catalogPage}>
            <button className={styles.mobileFilterButton} onClick={toggleMobileFilters}>
                <span>Фильтры</span>
                <span className={styles.filterIcon}>🔍</span>
            </button>

            <div className={styles.catalogContent}>
                <aside className={`${styles.sidebar} ${mobileFiltersOpen ? styles.mobileOpen : ''}`}>
                    <FilterSidebar brands={brands || []} />
                </aside>

                <main className={styles.main}>
                    <div className={styles.sortBar}>
                        <span className={styles.resultsCount}>
                            Найдено: {data?.count || 0} автомобилей
                        </span>
                        <select
                            className={styles.sortSelect}
                            value={sort}
                            onChange={handleSortChange}
                        >
                            {SORT_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Cars grid */}
                    {isLoading ? (
                        <div className={styles.loading}>Загрузка...</div>
                    ) : (
                        <>
                            {data?.results.length === 0 ? (
                                <div className={styles.noResults}>
                                    <h3>Автомобили не найдены</h3>
                                    <p>Попробуйте изменить параметры фильтрации</p>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.carGrid}>
                                        {data?.results.map((car: { id: any }) => (
                                            <CarCard key={car.id} car={car} />
                                        ))}
                                    </div>

                                    {data && data.total_pages > 1 && (
                                        <Pagination
                                            currentPage={page}
                                            totalPages={data.total_pages}
                                            onPageChange={handlePageChange}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </main>
            </div>

            {mobileFiltersOpen && (
                <div className={styles.overlay} onClick={toggleMobileFilters} />
            )}
        </div>
    )
}