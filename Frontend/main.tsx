import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './store'
import './styles/globals.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '8px',
              padding: '16px',
              fontSize: '14px',
            },
            success: {
              icon: '✅',
              style: {
                background: '#10b981',
                color: 'white',
              },
            },
            error: {
              icon: '❌',
              style: {
                background: '#ef4444',
                color: 'white',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)