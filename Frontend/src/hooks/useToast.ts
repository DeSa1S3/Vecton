import { toast, ToastOptions } from 'react-hot-toast'

export const useToast = () => {
    const showSuccess = (message: string, options?: ToastOptions) => {
        toast.success(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#10b981',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
            icon: '✅',
            ...options,
        })
    }

    const showError = (message: string, options?: ToastOptions) => {
        toast.error(message, {
            duration: 5000,
            position: 'top-right',
            style: {
                background: '#ef4444',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
            icon: '❌',
            ...options,
        })
    }

    const showInfo = (message: string, options?: ToastOptions) => {
        toast(message, {
            duration: 3000,
            position: 'top-right',
            style: {
                background: '#3b82f6',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
            icon: 'ℹ️',
            ...options,
        })
    }

    const showWarning = (message: string, options?: ToastOptions) => {
        toast(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#f59e0b',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
            icon: '⚠️',
            ...options,
        })
    }

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning,
    }
}