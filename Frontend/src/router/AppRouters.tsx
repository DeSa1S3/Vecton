import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Header } from '../components/layout/Header/Header'

import { HomePage } from '../pages/HomePage/HomePage'
import { CatalogPage } from '../pages/CatalogPage/CatalogPage'
import { CarDetailPage } from '../pages/CarDetailPage/CarDetailPage'
import { LoginPage } from '../pages/LoginPage/LoginPage'
import { RegisterPage } from '../pages/RegisterPage/RegisterPage'
import { ProfilePage } from '../pages/ProfilePage/ProfilePage'
import { FavoritesPage } from '../pages/FavoritesPage/FavoritesPage'
import { OrdersPage } from '../pages/OrdersPage/OrdersPage'
import { OrderDetailPage } from '../pages/OrderDetailPage/OrderDetailPage'
import { DashboardPage } from '../pages/DashboardPage/DashboardPage'
import { NotificationsPage } from '../pages/NotificationsPage/NotificationsPage'
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage'

interface PrivateRouteProps {
    children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

interface ManagerRouteProps {
    children: React.ReactNode
}

const ManagerRoute: React.FC<ManagerRouteProps> = ({ children }) => {
    const { isAuthenticated, isManager } = useAuth()
    return isAuthenticated && isManager ? <>{children}</> : <Navigate to="/" />
}

export const AppRoutes = () => {
    return (
        <>
            <Header />
            <main className="container">
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/car/:id" element={<CarDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Private routes */}
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    } />
                    <Route path="/profile/orders" element={
                        <PrivateRoute>
                            <OrdersPage />
                        </PrivateRoute>
                    } />
                    <Route path="/profile/orders/:id" element={
                        <PrivateRoute>
                            <OrderDetailPage />
                        </PrivateRoute>
                    } />
                    <Route path="/favorites" element={
                        <PrivateRoute>
                            <FavoritesPage />
                        </PrivateRoute>
                    } />
                    <Route path="/notifications" element={
                        <PrivateRoute>
                            <NotificationsPage />
                        </PrivateRoute>
                    } />

                    {/* Manager routes */}
                    <Route path="/dashboard" element={
                        <ManagerRoute>
                            <DashboardPage />
                        </ManagerRoute>
                    } />

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </>
    )
}