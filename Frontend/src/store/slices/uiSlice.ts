import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
    theme: 'light' | 'dark'
    sidebarOpen: boolean
    mobileMenuOpen: boolean
    isLoading: boolean
    modal: {
        isOpen: boolean
        type: string | null
        data?: any
    }
}

const initialState: UIState = {
    theme: 'light',
    sidebarOpen: true,
    mobileMenuOpen: false,
    isLoading: false,
    modal: {
        isOpen: false,
        type: null,
    },
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light'
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload
        },
        toggleMobileMenu: (state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen
        },
        setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
            state.mobileMenuOpen = action.payload
        },
        setGlobalLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
            state.modal = {
                isOpen: true,
                type: action.payload.type,
                data: action.payload.data,
            }
        },
        closeModal: (state) => {
            state.modal = {
                isOpen: false,
                type: null,
                data: undefined,
            }
        },
    },
})

export const {
    toggleTheme,
    setTheme,
    toggleSidebar,
    setSidebarOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
    setGlobalLoading,
    openModal,
    closeModal,
} = uiSlice.actions

export default uiSlice.reducer