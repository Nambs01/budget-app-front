import axiosInstance from '@/api'
import type { Expense, ExpenseForm } from '@/interfaces/expense.interface'

export class ExpenseService {
    private static instance: ExpenseService
    private constructor() {}

    public static getInstance() {
        if (!ExpenseService.instance) {
            ExpenseService.instance = new ExpenseService()
        }
        return ExpenseService.instance
    }

    public async create(payload: ExpenseForm) {
        const response = await axiosInstance.post<Expense>('/expenses', payload)
        return response.data
    }

    public async update(id: string, payload: ExpenseForm) {
        const response = await axiosInstance.patch<Expense>(`/expenses/${id}`, payload)
        return response.data
    }

    public async getAllOfMonth(month: Date) {
        const response = await axiosInstance.get<Expense[]>(
            `/expenses?month=${month.toDateString()}`,
        )
        return response.data
    }
}
