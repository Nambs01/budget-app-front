import axiosInstance from '@/api'
import type { Budget, BudgetForm } from '@/interfaces/budget.interface'

export class BudgetService {
    private static instance: BudgetService

    private constructor() {}

    public static getInstance() {
        if (!BudgetService.instance) {
            BudgetService.instance = new BudgetService()
        }
        return BudgetService.instance
    }

    public async create(payload: BudgetForm) {
        const response = await axiosInstance.post<Budget>('/budgets', payload)
        return response.data
    }

    public async update(id: string, payload: BudgetForm) {
        const response = await axiosInstance.patch<Budget>(`/budgets/${id}`, payload)
        return response.data
    }

    public async fetchBudgetOfMonth(month: Date) {
        const response = await axiosInstance.get<Budget | undefined>(
            `/budgets?month=${month.toDateString()}`,
        )
        return response.data
    }
}
