import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

interface ManagerRouteProps {
    children: React.ReactNode;
}

export const ManagerRoute: React.FC<ManagerRouteProps> = ({ children }) => {
    const { isAuthenticated, isManager } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isManager) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};