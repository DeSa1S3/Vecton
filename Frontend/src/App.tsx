import React, { useEffect } from 'react';
import { useAppDispatch } from './store/hooks/useAppDispatch';
import { getMe } from './store/slices/authSlice';
import { fetchFavorites } from './store/slices/favoritesSlice';
import { fetchNotifications } from './store/slices/notificationSlice';
import { AppRouter } from './routes/AppRouter';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(getMe());
      dispatch(fetchFavorites());
      dispatch(fetchNotifications({ is_read: false }));
    }
  }, [dispatch]);

  return <AppRouter />;
};

export default App;