import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiShield, FiAward, FiTool, FiCreditCard, FiTruck, FiFileText } from 'react-icons/fi';
import { Button } from '../../components/common';
import styles from './ServicesPage.module.scss';

export const ServicesPage: React.FC = () => {
    const services = [
        {
            title: 'Проверка автомобиля',
            description: 'Полная диагностика перед покупкой. Проверка юридической чистоты, технического состояния и истории автомобиля.',
            price: 'от 3 000 ₽'
        },
        {
            title: 'Техническое обслуживание',
            description: 'Профессиональное ТО, ремонт любой сложности, диагностика двигателя, ходовой части и электроники.',
            price: 'от 5 000 ₽'
        },
        {
            title: 'Автокредитование',
            description: 'Помощь в оформлении кредита на выгодных условиях. Работаем с ведущими банками России.',
            price: 'Бесплатно'
        },
        {
            title: 'Страхование',
            description: 'ОСАГО, КАСКО, ДСАГО. Поможем выбрать оптимальную страховую программу.',
            price: 'от 3 500 ₽'
        },
        {
            title: 'Юридическое сопровождение',
            description: 'Проверка документов, составление договоров, помощь в оформлении сделки купли-продажи.',
            price: 'от 5 000 ₽'
        },
        {
            title: 'Доставка автомобиля',
            description: 'Доставим автомобиль из любого региона России. Автовозы, железнодорожные контейнеры.',
            price: 'от 15 000 ₽'
        },
        {
            title: 'Trade-in',
            description: 'Обменяйте ваш старый автомобиль на новый с доплатой. Оценка за 30 минут.',
            price: 'Бесплатно'
        },
        {
            title: 'Тест-драйв',
            description: 'Организуем тест-драйв выбранного автомобиля. Индивидуальный подход к каждому клиенту.',
            price: 'Бесплатно'
        }
    ];

    const benefits = [
        {
            title: 'Опытные специалисты',
            description: 'Более 10 лет опыта в автомобильной сфере'
        },
        {
            title: 'Прозрачные цены',
            description: 'Фиксированная стоимость услуг без скрытых платежей'
        },
        {
            title: 'Гарантия качества',
            description: 'Гарантия на все виды работ и услуг'
        },
        {
            title: 'Индивидуальный подход',
            description: 'Учитываем все пожелания клиента'
        }
    ];

    return (
        <div className={styles.servicesPage}>
            <section className={styles.hero}>
                <div className="container">
                    <h1>Наши услуги</h1>
                    <p>Полный спектр услуг для комфортной покупки и обслуживания автомобиля</p>
                </div>
            </section>

            <section className={styles.services}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Что мы предлагаем</h2>
                    <div className={styles.servicesGrid}>
                        {services.map((service, index) => (
                            <div key={index} className={styles.serviceCard}>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                                <div className={styles.servicePrice}>{service.price}</div>
                                <Button variant="outline" size="sm" fullWidth>
                                    Заказать
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.benefits}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Почему выбирают нас</h2>
                    <div className={styles.benefitsGrid}>
                        {benefits.map((benefit, index) => (
                            <div key={index} className={styles.benefitCard}>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.process}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Как мы работаем</h2>
                    <div className={styles.processGrid}>
                        <div className={styles.processStep}>
                            <div className={styles.stepNumber}>1</div>
                            <h3>Оставьте заявку</h3>
                            <p>Заполните форму на сайте или позвоните нам</p>
                        </div>
                        <div className={styles.processStep}>
                            <div className={styles.stepNumber}>2</div>
                            <h3>Консультация</h3>
                            <p>Наш менеджер свяжется с вами для уточнения деталей</p>
                        </div>
                        <div className={styles.processStep}>
                            <div className={styles.stepNumber}>3</div>
                            <h3>Выполнение работ</h3>
                            <p>Профессиональное выполнение заказанных услуг</p>
                        </div>
                        <div className={styles.processStep}>
                            <div className={styles.stepNumber}>4</div>
                            <h3>Результат</h3>
                            <p>Вы получаете качественный результат в срок</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className="container">
                    <h2>Нужна консультация?</h2>
                    <p>Наши специалисты готовы ответить на все ваши вопросы</p>
                    <div className={styles.ctaButtons}>
                        <Button size="lg" variant="primary">Заказать звонок</Button>
                        <Link to="/contacts">
                            <Button size="lg" variant="outline">Связаться с нами</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};