import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserPayload } from '@/interfaces/user.interface'
import { AuthService } from '@/services/auth.service'
import type { Credential } from '@/interfaces/credential.interface'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

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
            router.push('/')
        } catch (error) {
            console.error('Fetching current user failed:', error)
        }
    }

    const register = async (data: UserPayload) => {
        try {
            await authService.register(data)
            await fetchCurrentUser()
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    const updateAmount = (value: number) => {
        if (currentUser.value) currentUser.value.amount = value
    }

    return { currentUser, isAuthenticated, login, logout, register, fetchCurrentUser, updateAmount }
})
