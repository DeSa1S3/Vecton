import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiHeart, FiLogOut, FiBell, FiHome, FiGrid, FiTool, FiRepeat, FiInfo, FiMail } from 'react-icons/fi';
import { useAuth } from '../../../hooks';
import { Button } from '../../common/Button/Button';
import styles from './Header.module.scss';
import { useAppSelector } from '../../../store/hooks/useAppSelectors';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();
    const { favoriteIds } = useAppSelector((state: any) => state.favorites || { favoriteIds: [] });
    const { unreadCount } = useAppSelector((state: any) => state.notifications || { unreadCount: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Главная' },
        { path: '/catalog', label: 'Каталог' },
        { path: '/services', label: 'Услуги' },
        { path: '/trade-in', label: 'Trade-in' },
        { path: '/about', label: 'О компании' },
        { path: '/contacts', label: 'Контакты' },
    ];



    const getInitials = () => {
        if (!user) return '';
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        return (firstName[0] || '') + (lastName[0] || '');
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link to="/">
                        <span className={styles.logoText}>Vecton</span>
                        <span className={styles.logoBadge}>Auto</span>
                    </Link>
                </div>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
                        >
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.actions}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/favorites" className={styles.actionButton} title="Избранное">
                                {favoriteIds?.length > 0 && (
                                    <span className={styles.badge}>{favoriteIds.length}</span>
                                )}
                            </Link>

                            <Link to="/notifications" className={styles.actionButton} title="Уведомления">
                                {unreadCount > 0 && (
                                    <span className={styles.badge}>{unreadCount}</span>
                                )}
                            </Link>

                            <Link to="/profile" className={styles.profileButton} title="Личный кабинет">

                                <span className={styles.profileName}>
                                    {user?.first_name || 'Профиль'}
                                </span>
                            </Link>

                            <button onClick={logout} className={styles.actionButton} title="Выйти">
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="outline" size="sm">Войти</Button>
                            </Link>
                            <Link to="/register">
                                <Button size="sm">Регистрация</Button>
                            </Link>
                        </>
                    )}

                    <button
                        className={styles.menuButton}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                    >
                    </button>
                </div>
            </div>
        </header>
    );
};