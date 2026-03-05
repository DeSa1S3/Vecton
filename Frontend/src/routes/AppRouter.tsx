import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivatesRoute';
import { Layout } from '../components/layout/Layout/Layout';
import { ManagerRoute } from './ManagerRoute';
import { HomePage } from '../pages/HomePage/HomePage';
import { CatalogPage } from '../pages/CatalogPage/CatalogPage';
import { CarDetailPage } from '../pages/CarDetailPage/CarDetailPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';
import { FavoritesPage } from '../pages/FavoritesPage/FavoritesPage';
import { DashboardPage } from '../pages/DashboardPage/DashboardPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import { AboutPage } from '../pages/AboutPage/AboutPage';
import { ContactsPage } from '../pages/ContactsPage/ContactsPage';
import { ServicesPage } from '../pages/ServicesPage/ServicesPage'; // 👈 Новая страница
import { TradeInPage } from '../pages/TradeInPage/TradeInPage'; // 👈 Новая страница

export const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="catalog" element={<CatalogPage />} />
                <Route path="car/:id" element={<CarDetailPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contacts" element={<ContactsPage />} />
                <Route path="services" element={<ServicesPage />} /> {/* 👈 Новый маршрут */}
                <Route path="trade-in" element={<TradeInPage />} /> {/* 👈 Новый маршрут */}

                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                <Route path="favorites" element={
                    <PrivateRoute>
                        <FavoritesPage />
                    </PrivateRoute>
                } />

                <Route path="profile" element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                } />

                <Route path="dashboard/*" element={
                    <ManagerRoute>
                        <DashboardPage />
                    </ManagerRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};