import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button/Button'
import styles from './NotFoundPage.module.scss'

export const NotFoundPage: React.FC = () => {
    return (
        <div className={styles.notFound}>
            <h1 className={styles.title}>404</h1>
            <h2 className={styles.subtitle}>Страница не найдена</h2>
            <p className={styles.text}>
                Запрашиваемая страница не существует или была перемещена
            </p>
            <Link to="/">
                <Button variant="primary" size="large">
                    Вернуться на главную
                </Button>
            </Link>
        </div>
    )
}