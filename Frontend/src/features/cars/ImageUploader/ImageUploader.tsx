import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useToast } from '../../../../hooks/useToast'
import styles from './ImageUploader.module.scss'

interface ImageUploaderProps {
    onImagesSelected: (files: File[]) => void
    maxFiles?: number
    maxSize?: number
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    onImagesSelected,
    maxFiles = 10,
    maxSize = 5 * 1024 * 1024,
}) => {
    const [previews, setPreviews] = useState<string[]>([])
    const { showError } = useToast()

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        if (rejectedFiles.length > 0) {
            rejectedFiles.forEach(({ file, errors }) => {
                errors.forEach((error: any) => {
                    if (error.code === 'file-too-large') {
                        showError(`Файл ${file.name} слишком большой (макс. 5MB)`)
                    } else if (error.code === 'file-invalid-type') {
                        showError(`Файл ${file.name} имеет недопустимый формат`)
                    }
                })
            })
        }

        if (acceptedFiles.length > 0) {
            const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file))
            setPreviews(prev => [...prev, ...newPreviews])

            onImagesSelected(acceptedFiles)
        }
    }, [onImagesSelected, showError])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxSize,
        maxFiles,
    })

    const removePreview = (index: number) => {
        setPreviews(prev => {
            URL.revokeObjectURL(prev[index])
            return prev.filter((_, i) => i !== index)
        })
    }

    return (
        <div className={styles.uploader}>
            <div
                {...getRootProps()}
                className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
            >
                <input {...getInputProps()} />
                <div className={styles.icon}>📸</div>
                {isDragActive ? (
                    <p>Отпустите файлы для загрузки...</p>
                ) : (
                    <>
                        <p className={styles.title}>
                            Перетащите изображения сюда или кликните для выбора
                        </p>
                        <p className={styles.hint}>
                            Поддерживаются JPEG, PNG, WebP до 5 МБ
                        </p>
                        <p className={styles.hint}>
                            Максимум {maxFiles} файлов
                        </p>
                    </>
                )}
            </div>

            {previews.length > 0 && (
                <div className={styles.previewGrid}>
                    {previews.map((preview, index) => (
                        <div key={index} className={styles.previewItem}>
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => removePreview(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}