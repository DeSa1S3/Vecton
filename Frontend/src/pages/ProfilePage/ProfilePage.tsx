import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from '../../store/api/authApi'
import { useToast } from '../../hooks/useToast'
import { Button } from '../../components/common/Button/Button'
import { Input } from '../../components/common/Input/Input'
import { Modal } from '../../components/common/Modal/Modal'
import styles from './ProfilePage.module.scss'

interface ProfileFormData {
    first_name: string
    last_name: string
    patronymic?: string
    phone: string
    company_name?: string
}

interface PasswordFormData {
    old_password: string
    new_password: string
    new_password2: string
}

export const ProfilePage: React.FC = () => {
    const { user } = useAuth()
    const { showSuccess, showError } = useToast()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

    const { data: profile, refetch } = useGetProfileQuery()
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation()

    const [formData, setFormData] = useState<ProfileFormData>({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        patronymic: profile?.patronymic || '',
        phone: profile?.phone || '',
        company_name: profile?.company_name || '',
    })

    const [passwordData, setPasswordData] = useState<PasswordFormData>({
        old_password: '',
        new_password: '',
        new_password2: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
    }

    const handleUpdateProfile = async () => {
        try {
            await updateProfile(formData).unwrap()
            refetch()
            setIsEditModalOpen(false)
            showSuccess('Профиль обновлен')
        } catch (error) {
            showError('Ошибка при обновлении профиля')
        }
    }

    const handleChangePassword = async () => {
        if (passwordData.new_password !== passwordData.new_password2) {
            showError('Пароли не совпадают')
            return
        }

        try {
            await changePassword(passwordData).unwrap()
            setIsPasswordModalOpen(false)
            setPasswordData({
                old_password: '',
                new_password: '',
                new_password2: '',
            })
            showSuccess('Пароль изменен')
        } catch (error: any) {
            showError(error.data?.message || 'Ошибка при смене пароля')
        }
    }

    return (
        <div className={styles.profilePage}>
            <h1 className={styles.title}>Личный кабинет</h1>

            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name} />
                        ) : (
                            <span className={styles.avatarPlaceholder}>
                                {profile?.first_name?.[0]}
                                {profile?.last_name?.[0]}
                            </span>
                        )}
                    </div>
                    <div className={styles.profileInfo}>
                        <h2 className={styles.profileName}>{profile?.full_name}</h2>
                        <p className={styles.profileEmail}>{profile?.email}</p>
                        <p className={styles.profilePhone}>{profile?.phone}</p>
                        {profile?.company_name && (
                            <p className={styles.profileCompany}>{profile.company_name}</p>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Редактировать
                    </Button>
                </div>

                <div className={styles.profileStats}>
                    <div className={styles.stat}>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Заявок</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>В избранном</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Просмотров</div>
                    </div>
                </div>

                <div className={styles.profileActions}>
                    <Button
                        variant="outline"
                        onClick={() => setIsPasswordModalOpen(true)}
                    >
                        Сменить пароль
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Редактирование профиля"
            >
                <div className={styles.modalForm}>
                    <Input
                        label="Имя"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Фамилия"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Отчество"
                        name="patronymic"
                        value={formData.patronymic}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Телефон"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Компания"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.modalFooter}>
                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdateProfile}
                        loading={isUpdating}
                    >
                        Сохранить
                    </Button>
                </div>
            </Modal>

            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Смена пароля"
            >
                <div className={styles.modalForm}>
                    <Input
                        label="Текущий пароль"
                        type="password"
                        name="old_password"
                        value={passwordData.old_password}
                        onChange={handlePasswordChange}
                    />
                    <Input
                        label="Новый пароль"
                        type="password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                    />
                    <Input
                        label="Подтверждение пароля"
                        type="password"
                        name="new_password2"
                        value={passwordData.new_password2}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div className={styles.modalFooter}>
                    <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleChangePassword}
                        loading={isChangingPassword}
                    >
                        Сменить пароль
                    </Button>
                </div>
            </Modal>
        </div>
    )
}