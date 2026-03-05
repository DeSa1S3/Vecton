import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivatesRoute';
import { Layout } from '../components/layout/Layout/Layout';
import { ManagerRoute } from './ManagerRoute';
import { HomePage } from '../pages/HomePage/HomePages';
import { CatalogPage } from '../pages/CatalogPage/CatalogPage';
import { CarDetailPage } from '../pages/CarDetailPage/CarDetailPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';
import { FavoritesPage } from '../pages/FavoritesPage/FavoritesPage';
import { DashboardPage } from '../pages/DashboardPage/DashboardPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';

export const AppRouter: React.FC = () => {
    console.log('AppRouter рендерится');

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="catalog" element={<CatalogPage />} />
                <Route path="car/:id" element={<CarDetailPage />} />
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