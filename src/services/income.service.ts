import axiosInstance from '@/api'
import type { Income, IncomeApiResponse, IncomeForm } from '@/interfaces/income.interface'

export class IncomeService {
    private static instance: IncomeService

    private constructor() {}

    public static getInstance() {
        if (!IncomeService.instance) {
            IncomeService.instance = new IncomeService()
        }
        return IncomeService.instance
    }

    public async create(payload: IncomeForm) {
        const response = await axiosInstance.post<IncomeApiResponse>('/incomes', payload)
        return response.data
    }

    public async update(id: string, payload: IncomeForm) {
        const response = await axiosInstance.patch<IncomeApiResponse>(`/incomes/${id}`, payload)
        return response.data
    }

    public async fetchIncomeList() {
        const response = await axiosInstance.get<Income[]>('/incomes')
        return response.data
    }
}
