import React from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { Button, Input } from '../../components/common';
import styles from './ContactsPage.module.scss';

export const ContactsPage: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className={styles.contactsPage}>
            <section className={styles.hero}>
                <div className="container">
                    <h1>Контакты</h1>
                    <p>Свяжитесь с нами любым удобным способом</p>
                </div>
            </section>

            <section className={styles.info}>
                <div className="container">
                    <div className={styles.infoGrid}>
                        <div className={styles.infoCard}>
                            <h3>Адрес</h3>
                            <p>г. Москва, ул. Автомобильная, д. 1</p>
                            <p>БЦ "Авто Плаза", офис 101</p>
                        </div>

                        <div className={styles.infoCard}>
                            <h3>Телефон</h3>
                            <p>8 (800) 123-45-67</p>
                            <p>8 (495) 123-45-67</p>
                        </div>

                        <div className={styles.infoCard}>
                            <h3>Email</h3>
                            <p>info@vecton.ru</p>
                            <p>support@vecton.ru</p>
                        </div>

                        <div className={styles.infoCard}>
                            <h3>Режим работы</h3>
                            <p>Пн-Пт: 9:00 - 21:00</p>
                            <p>Сб-Вс: 10:00 - 20:00</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.mapSection}>
                <div className="container">
                    <div className={styles.mapGrid}>
                        <div className={styles.map}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.3732925843725!2d37.61570131593298!3d55.75202399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a5a738fa419%3A0x7c347d506b523daf!2z0JzQvtGB0LrQvtCy0YHQutC40Lkg0JrRgNC10LzQu9GM!5e0!3m2!1sru!2sru!4v1633023222334!5m2!1sru!2sru"
                                width="100%"
                                height="450"
                                style={{ border: 0, borderRadius: '1rem' }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>

                        <div className={styles.formCard}>
                            <h2>Напишите нам</h2>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <Input
                                    label="Ваше имя"
                                    placeholder="Иван Иванов"
                                    required
                                />
                                <Input
                                    type="email"
                                    label="Email"
                                    placeholder="ivan@example.com"
                                    required
                                />
                                <Input
                                    label="Телефон"
                                    placeholder="+7 (999) 123-45-67"
                                    required
                                />
                                <div className={styles.textareaWrapper}>
                                    <label className={styles.textareaLabel}>Сообщение</label>
                                    <textarea
                                        className={styles.textarea}
                                        rows={5}
                                        placeholder="Ваше сообщение..."
                                        required
                                    />
                                </div>
                                <Button type="submit" size="lg" fullWidth>
                                    Отправить сообщение
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.details}>
                <div className="container">
                    <h2>Реквизиты компании</h2>
                    <div className={styles.detailsGrid}>
                        <div className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>ООО "Вектон"</span>
                        </div>
                        <div className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>ИНН:</span>
                            <span className={styles.detailsValue}>7701234567</span>
                        </div>
                        <div className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>КПП:</span>
                            <span className={styles.detailsValue}>770101001</span>
                        </div>
                        <div className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>ОГРН:</span>
                            <span className={styles.detailsValue}>1157700012345</span>
                        </div>
                        <div className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>Расчетный счет:</span>
                            <span className={styles.detailsValue}>40702810123450001234</span>
                        </div>
                        <div className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>Банк:</span>
                            <span className={styles.detailsValue}>ПАО Сбербанк, г. Москва</span>
                        </div>
                        <div className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>БИК:</span>
                            <span className={styles.detailsValue}>044525225</span>
                        </div>
                        <div className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>Корр. счет:</span>
                            <span className={styles.detailsValue}>30101810400000000225</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};