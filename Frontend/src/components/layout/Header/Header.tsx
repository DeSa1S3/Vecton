import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiHeart, FiLogOut, FiBell } from 'react-icons/fi';
import { useAuth } from '../../../hooks';
import { Button } from '../../common/Button/Button';
import styles from './Header.module.scss';
import { useAppSelector } from '@/store/hooks/useAppSelectors';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();
    const { favoriteIds } = useAppSelector((state: { favorites: any; }) => state.favorites);
    const { unreadCount } = useAppSelector((state: { notifications: any; }) => state.notifications);

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
    ];

    if (user?.isManager) {
        navLinks.push({ path: '/dashboard', label: 'Панель управления' });
    }

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link to="/">
                        <span className={styles.logoText}>Vecton</span>
                    </Link>
                </div>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.actions}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/favorites" className={styles.actionButton}>
                                <FiHeart />
                                {favoriteIds.length > 0 && (
                                    <span className={styles.badge}>{favoriteIds.length}</span>
                                )}
                            </Link>

                            <Link to="/notifications" className={styles.actionButton}>
                                <FiBell />
                                {unreadCount > 0 && (
                                    <span className={styles.badge}>{unreadCount}</span>
                                )}
                            </Link>

                            <Link to="/profile" className={styles.profileButton}>
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.full_name} />
                                ) : (
                                    <FiUser />
                                )}
                            </Link>

                            <button onClick={logout} className={styles.actionButton}>
                                <FiLogOut />
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
                    >
                        {isMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>
        </header>
    );
};