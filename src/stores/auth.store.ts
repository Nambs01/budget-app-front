import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/interfaces/user.interface'
import { AuthService } from '@/services/auth.service'
import type { Credential } from '@/interfaces/credential.interface'

export const useAuthStore = defineStore('auth', () => {
    const authService = AuthService.getInstance()
    const currentUser = ref<User>()

    const isAuthenticated = computed(() => !!currentUser.value)

    const login = async (data: Credential) => {
        try {
            await authService.login(data)
            await fetchCurrentUser()
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    const logout = async () => {
        try {
            await authService.logout()
            currentUser.value = undefined
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const fetchCurrentUser = async () => {
        try {
            const user = await authService.fetchCurrentUser()
            currentUser.value = user
        } catch (error) {
            console.error('Fetching current user failed:', error)
        }
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            await authService.register(name, email, password)
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }
    return { currentUser, isAuthenticated, login, logout, register }
})
