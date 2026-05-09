import type { Credential } from './credential.interface'

export interface User {
    id: number
    name: string
    email: string
    firstName?: string
    createdAt: string
    updatedAt: string
}

export interface UserPayload extends Credential {
    name: string
    firstName?: string
}
