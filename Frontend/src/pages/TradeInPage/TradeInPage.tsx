import React, { useState } from 'react';
import { FiCheck, FiClock, FiTrendingUp, FiShield, FiFileText, FiPercent } from 'react-icons/fi';
import { Button, Input } from '../../components/common';
import { Image } from '../../components/common/Image/Image';
import styles from './TradeInPage.module.scss';

export const TradeInPage: React.FC = () => {
    const [step, setStep] = useState(1);

    // const advantages = [
    //     { icon: <FiClock />, title: 'Быстро', description: 'Оценка автомобиля за 30 минут' },
    //     { icon: <FiTrendingUp />, title: 'Выгодно', description: 'Максимальная стоимость вашего авто' },
    //     { icon: <FiShield />, title: 'Надежно', description: 'Юридически чистая сделка' },
    //     { icon: <FiPercent />, title: 'Экономия', description: 'Налоговый вычет при покупке' }
    // ];

    const steps = [
        { number: 1, title: 'Заявка', description: 'Оставьте заявку на сайте или позвоните нам' },
        { number: 2, title: 'Оценка', description: 'Наш эксперт оценит ваш автомобиль' },
        { number: 3, title: 'Выбор авто', description: 'Выберите новый автомобиль из каталога' },
        { number: 4, title: 'Оформление', description: 'Подпишем договор и оформим документы' }
    ];

    return (
        <div className={styles.tradeInPage}>
            <section className={styles.hero}>
                <Image
                    src="/images/tradein-hero.jpg"
                    alt="Trade-in hero"
                    width="100%"
                    height="500px"
                    objectFit="cover"
                />
                <div className={styles.heroContent}>
                    <h1>Trade-in</h1>
                    <p>Обменяйте ваш старый автомобиль на новый с доплатой</p>
                    <Button size="lg" variant="primary">Оставить заявку</Button>
                </div>
            </section>

            <section className={styles.advantages}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Преимущества Trade-in</h2>
                    <div className={styles.advantagesGrid}>
                        {/* {advantages.map((item, index) => (
                            <div key={index} className={styles.advantageCard}>
                                <div className={styles.advantageIcon}>{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))} */}
                    </div>
                </div>
            </section>

            <section className={styles.howItWorks}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Как это работает</h2>
                    <div className={styles.stepsGrid}>
                        {steps.map((s) => (
                            <div key={s.number} className={styles.step}>
                                <div className={styles.stepNumber}>{s.number}</div>
                                <h3>{s.title}</h3>
                                <p>{s.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.calculator}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Рассчитайте стоимость</h2>
                    <div className={styles.calculatorCard}>
                        <div className={styles.calculatorGrid}>
                            <div className={styles.calculatorForm}>
                                <h3>Данные автомобиля</h3>
                                <div className={styles.form}>
                                    <Input label="Марка" placeholder="Например: Toyota" />
                                    <Input label="Модель" placeholder="Например: Camry" />
                                    <Input type="number" label="Год выпуска" placeholder="2020" />
                                    <Input type="number" label="Пробег (км)" placeholder="50000" />
                                    <div className={styles.checkboxGroup}>
                                        <label className={styles.checkbox}>
                                            <input type="checkbox" /> Хорошее состояние
                                        </label>
                                        <label className={styles.checkbox}>
                                            <input type="checkbox" /> Без ДТП
                                        </label>
                                        <label className={styles.checkbox}>
                                            <input type="checkbox" /> Один владелец
                                        </label>
                                    </div>
                                    <Button fullWidth>Рассчитать</Button>
                                </div>
                            </div>
                            <div className={styles.calculatorResult}>
                                <h3>Примерная стоимость</h3>
                                <div className={styles.resultAmount}>1 500 000 ₽</div>
                                <div className={styles.resultInfo}>
                                    <p>Стоимость может меняться после осмотра экспертом</p>
                                    <ul>
                                        <li>✓ Бесплатная оценка</li>
                                        <li>✓ Выезд эксперта</li>
                                        <li>✓ Проверка юридической чистоты</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.requirements}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Требования к автомобилю</h2>
                    <div className={styles.requirementsGrid}>
                        <div className={styles.requirementCard}>
                            {/* <FiFileText className={styles.requirementIcon} /> */}
                            <h3>Документы</h3>
                            <p>Паспорт владельца, ПТС, СТС</p>
                        </div>
                        <div className={styles.requirementCard}>
                            {/* <FiCheck className={styles.requirementIcon} /> */}
                            <h3>Состояние</h3>
                            <p>На ходу, без критических повреждений</p>
                        </div>
                        <div className={styles.requirementCard}>
                            {/* <FiCheck className={styles.requirementIcon} /> */}
                            <h3>Возраст</h3>
                            <p>Не старше 15 лет</p>
                        </div>
                        <div className={styles.requirementCard}>
                            {/* <FiCheck className={styles.requirementIcon} /> */}
                            <h3>Юридическая чистота</h3>
                            <p>Не в залоге, не под арестом</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className="container">
                    <h2>Готовы обменять автомобиль?</h2>
                    <p>Оставьте заявку, и наш менеджер свяжется с вами</p>
                    <div className={styles.ctaButtons}>
                        <Button size="lg" variant="primary">Оставить заявку</Button>
                        <Button size="lg" variant="outline">Записаться на оценку</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};