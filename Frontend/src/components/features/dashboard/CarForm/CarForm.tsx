import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
    useGetCarQuery,
    useCreateCarMutation,
    useUpdateCarMutation,
    useUploadCarImagesMutation
} from '../../../../store/api/carsApi'
import { useToast } from '../../../../hooks/useToast'
import { Button } from '../../../common/Button/Button'
import { Input } from '../../../common/Input/Input'
import { ImageUploader } from '../../cars/ImageUploader/ImageUploader'
import {
    CAR_BODY_TYPES,
    CAR_TRANSMISSIONS,
    CAR_DRIVES,
    CAR_FUEL_TYPES,
    CAR_STATUSES
} from '../../../../utils/constants'
import styles from './CarForm.module.scss'

interface CarFormProps {
    carId?: number
    onSuccess?: () => void
}

interface CarFormData {
    brand: string
    model: string
    year: number
    price: number
    mileage?: number
    vin?: string
    color?: string
    engine_volume?: number
    engine_power?: number
    fuel_type?: string
    transmission?: string
    drive?: string
    body_type?: string
    description?: string
    status: string
}

const carSchema = yup.object({
    brand: yup.string().required('Марка обязательна'),
    model: yup.string().required('Модель обязательна'),
    year: yup
        .number()
        .required('Год обязателен')
        .min(1900, 'Год должен быть не менее 1900')
        .max(new Date().getFullYear() + 1, 'Год не может быть в будущем'),
    price: yup
        .number()
        .required('Цена обязательна')
        .positive('Цена должна быть положительной'),
    mileage: yup
        .number()
        .nullable()
        .transform((value) => (isNaN(value) ? undefined : value))
        .min(0, 'Пробег не может быть отрицательным'),
    vin: yup
        .string()
        .nullable()
        .matches(/^[A-HJ-NPR-Z0-9]{17}$/, 'Неверный формат VIN'),
    engine_volume: yup
        .number()
        .nullable()
        .transform((value) => (isNaN(value) ? undefined : value))
        .positive('Объем должен быть положительным'),
    engine_power: yup
        .number()
        .nullable()
        .transform((value) => (isNaN(value) ? undefined : value))
        .positive('Мощность должна быть положительной'),
})

export const CarForm: React.FC<CarFormProps> = ({ carId, onSuccess }) => {
    const [images, setImages] = useState<File[]>([])
    const { data: car } = useGetCarQuery(carId!, { skip: !carId })
    const [createCar, { isLoading: isCreating }] = useCreateCarMutation()
    const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation()
    const [uploadImages] = useUploadCarImagesMutation()
    const { showSuccess, showError } = useToast()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CarFormData>({
        resolver: yupResolver(carSchema),
        defaultValues: {
            status: 'in_stock',
        },
    })

    useEffect(() => {
        if (car) {
            reset({
                brand: car.brand,
                model: car.model,
                year: car.year,
                price: car.price,
                mileage: car.mileage,
                vin: car.vin,
                color: car.color,
                engine_volume: car.engine_volume,
                engine_power: car.engine_power,
                fuel_type: car.fuel_type,
                transmission: car.transmission,
                drive: car.drive,
                body_type: car.body_type,
                description: car.description,
                status: car.status,
            })
        }
    }, [car, reset])

    const onSubmit = async (data: CarFormData) => {
        try {
            const formData = new FormData()

            Object.entries(data).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value.toString())
                }
            })

            let response
            if (carId) {
                response = await updateCar({ id: carId, data: formData }).unwrap()
                showSuccess('Автомобиль обновлен')
            } else {
                response = await createCar(formData).unwrap()

                if (images.length > 0) {
                    const imageFormData = new FormData()
                    images.forEach(file => {
                        imageFormData.append('images', file)
                    })
                    await uploadImages({ id: response.id, formData: imageFormData }).unwrap()
                }

                showSuccess('Автомобиль создан')
            }

            onSuccess?.()
        } catch (error) {
            showError(carId ? 'Ошибка при обновлении' : 'Ошибка при создании')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.grid}>
                <div className={styles.column}>
                    <h3 className={styles.sectionTitle}>Основная информация</h3>

                    <div className={styles.row}>
                        <Input
                            label="Марка *"
                            {...register('brand')}
                            error={errors.brand?.message}
                        />
                        <Input
                            label="Модель *"
                            {...register('model')}
                            error={errors.model?.message}
                        />
                    </div>

                    <div className={styles.row}>
                        <Input
                            label="Год *"
                            type="number"
                            {...register('year')}
                            error={errors.year?.message}
                        />
                        <Input
                            label="Цена *"
                            type="number"
                            {...register('price')}
                            error={errors.price?.message}
                        />
                    </div>

                    <div className={styles.row}>
                        <Input
                            label="Пробег"
                            type="number"
                            {...register('mileage')}
                            error={errors.mileage?.message}
                        />
                        <Input
                            label="VIN"
                            {...register('vin')}
                            error={errors.vin?.message}
                        />
                    </div>

                    <Input
                        label="Цвет"
                        {...register('color')}
                        error={errors.color?.message}
                    />

                    <h3 className={styles.sectionTitle}>Технические характеристики</h3>

                    <div className={styles.row}>
                        <Input
                            label="Объем двигателя"
                            type="number"
                            step="0.1"
                            {...register('engine_volume')}
                            error={errors.engine_volume?.message}
                        />
                        <Input
                            label="Мощность (л.с.)"
                            type="number"
                            {...register('engine_power')}
                            error={errors.engine_power?.message}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Тип топлива</label>
                            <select className={styles.select} {...register('fuel_type')}>
                                <option value="">Выберите тип</option>
                                {CAR_FUEL_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Коробка передач</label>
                            <select className={styles.select} {...register('transmission')}>
                                <option value="">Выберите тип</option>
                                {CAR_TRANSMISSIONS.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Привод</label>
                            <select className={styles.select} {...register('drive')}>
                                <option value="">Выберите тип</option>
                                {CAR_DRIVES.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Тип кузова</label>
                            <select className={styles.select} {...register('body_type')}>
                                <option value="">Выберите тип</option>
                                {CAR_BODY_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.column}>
                    <h3 className={styles.sectionTitle}>Описание и статус</h3>

                    <div className={styles.field}>
                        <label className={styles.label}>Статус</label>
                        <select className={styles.select} {...register('status')}>
                            {CAR_STATUSES.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Описание</label>
                        <textarea
                            className={styles.textarea}
                            rows={6}
                            {...register('description')}
                        />
                    </div>

                    {!carId && (
                        <>
                            <h3 className={styles.sectionTitle}>Изображения</h3>
                            <ImageUploader
                                onImagesSelected={setImages}
                                maxFiles={10}
                            />
                        </>
                    )}
                </div>
            </div>

            <div className={styles.actions}>
                <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    loading={isCreating || isUpdating}
                >
                    {carId ? 'Сохранить' : 'Создать'}
                </Button>
            </div>
        </form>
    )
}