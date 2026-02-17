import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { logout } from '../../../store/slices/authSlice'
import { useGetUnreadCountQuery } from '../../../store/api/notificationsApi'
import styles from './Header.module.scss'

export const Header: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { isAuthenticated, user } = useAppSelector((state: { auth: any }) => state.auth)
    const { data: unreadCount } = useGetUnreadCountQuery(undefined, {
        skip: !isAuthenticated,
    })

    const handleLogout = () => {
        dispatch(logout())
        navigate('/')
    }

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    Vecton
                </Link>

                <nav className={styles.nav}>
                    <Link to="/catalog" className={styles.navLink}>
                        Каталог
                    </Link>
                    {isAuthenticated && user?.is_manager && (
                        <Link to="/dashboard" className={styles.navLink}>
                            Дашборд
                        </Link>
                    )}
                </nav>

                <div className={styles.actions}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/favorites" className={styles.iconLink}>
                                ❤️
                            </Link>
                            <Link to="/notifications" className={styles.iconLink}>
                                🔔
                                {unreadCount?.unread_count ? (
                                    <span className={styles.badge}>{unreadCount.unread_count}</span>
                                ) : null}
                            </Link>
                            <div className={styles.userMenu}>
                                <button className={styles.userButton}>
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.full_name} className={styles.avatar} />
                                    ) : (
                                        <span className={styles.avatarPlaceholder}>
                                            {user?.first_name?.[0]}
                                            {user?.last_name?.[0]}
                                        </span>
                                    )}
                                </button>
                                <div className={styles.dropdown}>
                                    <Link to="/profile" className={styles.dropdownItem}>
                                        Профиль
                                    </Link>
                                    <Link to="/profile/orders" className={styles.dropdownItem}>
                                        Мои заявки
                                    </Link>
                                    <button onClick={handleLogout} className={styles.dropdownItem}>
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={styles.loginButton}>
                                Войти
                            </Link>
                            <Link to="/register" className={styles.registerButton}>
                                Регистрация
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}