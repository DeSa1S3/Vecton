import React from 'react';
import styles from './Tabs.module.scss';

interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
}) => {
    return (
        <div className={styles.tabs}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};