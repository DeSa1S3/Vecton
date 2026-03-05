import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common';
import { Image } from '../../components/common/Image/Image';
import styles from './AboutPage.module.scss';

const teamMembers = [
    { id: 1, name: 'Иван Иванов', position: 'Генеральный директор', image: '/images/team/team1.jpg' },
    { id: 2, name: 'Петр Петров', position: 'Руководитель отдела продаж', image: '/images/team/team2.jpg' },
    { id: 3, name: 'Мария Сидорова', position: 'Главный специалист', image: '/images/team/team3.jpg' },
    { id: 4, name: 'Алексей Алексеев', position: 'Технический директор', image: '/images/team/team4.jpg' },
];

export const AboutPage: React.FC = () => {
    return (
        <div className={styles.aboutPage}>
            <section className={styles.hero}>
                <Image
                    src="/images/about-hero.jpg"
                    alt="About hero"
                    width="100%"
                    height="500px"
                    objectFit="cover"
                />
                <div className={styles.heroContent}>
                    <h1>О компании Vecton</h1>
                    <p>Ведущий автомобильный маркетплейс России</p>
                </div>
            </section>

            <section className={styles.history}>
                <div className="container">
                    <div className={styles.historyGrid}>
                        <div className={styles.historyContent}>
                            <h2>Наша история</h2>
                            <p>Vecton был основан в 2015 году группой энтузиастов, объединенных страстью к автомобилям и желанием сделать процесс покупки и продажи автомобилей максимально прозрачным и удобным.</p>
                            <p>За годы работы мы помогли более 50 000 клиентов найти их идеальные автомобили и стали лидером рынка в России.</p>
                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>50 000+</span>
                                    <span className={styles.statLabel}>Клиентов</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>10 000+</span>
                                    <span className={styles.statLabel}>Автомобилей в наличии</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>8 лет</span>
                                    <span className={styles.statLabel}>На рынке</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.historyImage}>
                            <Image
                                src="/images/about-history.jpg"
                                alt="Наша история"
                                width="100%"
                                height="400px"
                                objectFit="cover"
                                fallbackSrc="/images/placeholder.jpg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.mission}>
                <div className="container">
                    <h2>Наша миссия</h2>
                    <p className={styles.missionText}>
                        Сделать процесс приобретения автомобиля простым, прозрачным и приятным,
                        предоставляя клиентам доступ к самому широкому выбору качественных автомобилей
                        и профессиональную поддержку на каждом этапе.
                    </p>
                </div>
            </section>

            <section className={styles.features}>
                <div className="container">
                    <h2>Почему выбирают нас</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>✓</div>
                            <h3>Проверенные автомобили</h3>
                            <p>Каждый автомобиль проходит тщательную техническую проверку</p>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>💰</div>
                            <h3>Лучшие цены</h3>
                            <p>Прямые поставки от дилеров и собственников</p>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>🤝</div>
                            <h3>Помощь с кредитом</h3>
                            <p>Поможем оформить кредит на выгодных условиях</p>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>🚚</div>
                            <h3>Доставка по всей России</h3>
                            <p>Доставим автомобиль в любой регион</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.team}>
                <div className="container">
                    <h2>Наша команда</h2>
                    <div className={styles.teamGrid}>
                        {teamMembers.map((member) => (
                            <div key={member.id} className={styles.teamCard}>
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    width="100%"
                                    height="250px"
                                    objectFit="cover"
                                    fallbackSrc="/images/team-placeholder.jpg"
                                />
                                <h3>{member.name}</h3>
                                <p>{member.position}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className="container">
                    <h2>Готовы найти свой идеальный автомобиль?</h2>
                    <Link to="/catalog">
                        <Button size="lg">Перейти в каталог</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};