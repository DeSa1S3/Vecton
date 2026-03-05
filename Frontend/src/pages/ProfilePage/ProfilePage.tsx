import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { ProfileForm } from '../../components/user/ProfileForm/ProfileForm';
import { ChangePasswordForm } from '../../components/user/ChangePasswordForm/ChangePasswordForm';
import { Tabs } from '../../components/common/Tabs/Tabs';
import { OrdersList } from '../../components/order/OrderList/OrderList';
import { Image } from '../../components/common/Image/Image';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import styles from './ProfilePage.module.scss';
import { useAppSelector } from '../../store/hooks/useAppSelectors';

export const ProfilePage: React.FC = () => {
    const { user } = useAppSelector((state: any) => state.auth);
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Профиль' },
        { id: 'orders', label: 'Мои заказы' },
        { id: 'security', label: 'Безопасность' },
    ];

    if (!user) {
        return null;
    }

    return (
        <div className={styles.profilePage}>
            <div className="container">
                <div className={styles.profileHeader}>
                    <div className={styles.profileAvatar}>
                        <Image
                            src={user.avatar || ''}
                            alt={`${user.first_name} ${user.last_name}`}
                            width="120px"
                            height="120px"
                            objectFit="cover"
                            fallbackSrc="/images/default-avatar.jpg"
                        />
                    </div>
                    <div className={styles.profileInfo}>
                        <h1>{user.first_name} {user.last_name}</h1>
                        <div className={styles.profileDetails}>
                            <div className={styles.detailItem}>
                                <span>{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className={styles.detailItem}>
                                    <span>{user.phone}</span>
                                </div>
                            )}
                            {user.city && (
                                <div className={styles.detailItem}>
                                    <span>{user.city}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    <div className={styles.tabContent}>
                        {activeTab === 'profile' && (
                            <ProfileForm user={user} />
                        )}

                        {activeTab === 'orders' && (
                            <OrdersList />
                        )}

                        {activeTab === 'security' && (
                            <ChangePasswordForm />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};