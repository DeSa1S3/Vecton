import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.column}>
                        <h3>Vecton</h3>
                        <p>Автомобильный маркетплейс №1 в России</p>
                    </div>

                    <div className={styles.column}>
                        <h4>Навигация</h4>
                        <ul>
                            <li><Link to="/">Главная</Link></li>
                            <li><Link to="/catalog">Каталог</Link></li>
                            <li><Link to="/about">О компании</Link></li>
                            <li><Link to="/contacts">Контакты</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>Покупателям</h4>
                        <ul>
                            <li><Link to="/how-to-buy">Как купить</Link></li>
                            <li><Link to="/delivery">Доставка</Link></li>
                            <li><Link to="/test-drive">Тест-драйв</Link></li>
                            <li><Link to="/trade-in">Trade-in</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>Контакты</h4>
                        <ul>
                            <li>8 (800) 123-45-67</li>
                            <li>info@vecton.ru</li>
                            <li>г. Москва, ул. Примерная, 1</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; 2024 Vecton. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};