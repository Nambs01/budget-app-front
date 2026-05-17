import type { IncomeCategory } from '@/enums/income.enum'

export interface IncomeCreate {
    title: string
    source: string
    category: string
    amount: number
    date: string
}

export interface Income extends IncomeCreate {
    id: string
    createdAt: string
    updatedAt: string
}
