import axiosInstance from '@/api'
import type { Income, IncomeCreate } from '@/interfaces/income.interface'

export class IncomeService {
    private static instance: IncomeService

    private constructor() {}

    public static getInstance() {
        if (!IncomeService.instance) {
            IncomeService.instance = new IncomeService()
        }
        return IncomeService.instance
    }

    public async create(payload: IncomeCreate) {
        const response = await axiosInstance.post<Income>('/incomes', payload)
        return response.data
    }
}
