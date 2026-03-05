import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { ProfileForm } from '../../components/user/ProfileForm/ProfileForm';
import { ChangePasswordForm } from '../../components/user/ChangePasswordForm/ChangePasswordForm';
import { Tabs } from '../../components/common/Tabs/Tabs';
import { OrdersList } from '../../components/order/OrderList/OrderList';
import styles from './ProfilePage.module.scss';
import { useAppSelector } from '@/store/hooks/useAppSelectors';

export const ProfilePage: React.FC = () => {
    const { user } = useAppSelector((state: { auth: any; }) => state.auth);
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
                <h1>Личный кабинет</h1>

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