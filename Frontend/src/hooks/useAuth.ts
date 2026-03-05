import { useAppSelector } from '../store/hooks/useAppSelectors';
import { useAppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        logout: handleLogout,
        isManager: user?.role === 'manager' || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
    };
};