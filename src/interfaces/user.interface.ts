import type { Credential } from './credential.interface'

export interface User {
    id: number
    name: string
    email: string
    amount: number
    createdAt: string
    updatedAt: string
}

export interface UserPayload extends Credential {
    name: string
}
