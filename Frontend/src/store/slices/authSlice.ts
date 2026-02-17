import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, Tokens } from '../../api/types'

interface AuthState {
    user: User | null
    tokens: Tokens | null
    isAuthenticated: boolean
    isLoading: boolean
}

const initialState: AuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; tokens: Tokens }>
        ) => {
            const { user, tokens } = action.payload
            state.user = user
            state.tokens = tokens
            state.isAuthenticated = true

            localStorage.setItem('accessToken', tokens.access)
            localStorage.setItem('refreshToken', tokens.refresh)
        },
        refreshToken: (state, action: PayloadAction<string>) => {
            if (state.tokens) {
                state.tokens.access = action.payload
                localStorage.setItem('accessToken', action.payload)
            }
        },
        logout: (state) => {
            state.user = null
            state.tokens = null
            state.isAuthenticated = false

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
        },
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
    },
})

export const {
    setCredentials,
    refreshToken,
    logout,
    updateUser,
    setLoading,
} = authSlice.actions

export default authSlice.reducer