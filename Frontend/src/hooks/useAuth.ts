import { useAppSelector } from '../store/hooks'

export const useAuth = () => {
    const { user, isAuthenticated, tokens } = useAppSelector((state) => state.auth)

    return {
        user,
        isAuthenticated,
        tokens,
        isManager: user?.role === 'manager' || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
    }
}