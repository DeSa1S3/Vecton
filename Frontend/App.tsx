import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppRoutes } from './router/AppRoutes'
import { useCheckAuthQuery } from './store/api/authApi'
import { setCredentials, logout } from './store/slices/authSlice'

function App() {
  const dispatch = useDispatch()
  const { data, isLoading } = useCheckAuthQuery(undefined, {
    skip: !localStorage.getItem('accessToken'),
  })

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({
        user: data,
        tokens: {
          access: localStorage.getItem('accessToken') || '',
          refresh: localStorage.getItem('refreshToken') || '',
        },
      }))
    } else if (!isLoading && !data) {
      dispatch(logout())
    }
  }, [data, isLoading, dispatch])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <AppRoutes />
}

export default App