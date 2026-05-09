import axiosInstance from '@/api'
import type { Credential } from '@/interfaces/credential.interface'
import type { User } from '@/interfaces/user.interface'

export class AuthService {
    private static instance: AuthService

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService()
        }
        return AuthService.instance
    }

    public async login(payload: Credential): Promise<void> {
        const apiResponse = await axiosInstance.post('/auth/login', payload)
        return apiResponse.data
    }

    public async logout(): Promise<void> {
        // Implement logout logic here
    }

    public async fetchCurrentUser(): Promise<User> {
        const apiResponse = await axiosInstance.get('/auth/user')
        console.log(apiResponse.data)
        return apiResponse.data
    }

    public async register(name: string, email: string, password: string): Promise<void> {
        // Implement registration logic here
    }
}
