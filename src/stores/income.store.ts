import { ref } from 'vue'
import { defineStore } from 'pinia'
import { IncomeService } from '@/services/income.service'
import { useToastService } from '@/composables/useToastService'
import type { Income, IncomeCreate } from '@/interfaces/income.interface'
import { useAuthStore } from './auth.store'

export const useIncomeStore = defineStore('income', () => {
    const authStore = useAuthStore()
    const toast = useToastService()
    const incomeService = IncomeService.getInstance()
    const listIncomes = ref<Income[]>([])

    const addIncome = async (data: IncomeCreate) => {
        try {
            const response = await incomeService.create(data)
            listIncomes.value.unshift(response.income)
            authStore.updateAmount(response.amountUser)
            toast.success('Revenu enregistré avec succès')
        } catch (error) {
            console.error('Add income failed:', error)
        }
    }

    const updateIncome = async () => {}

    const fetchIncomeList = async () => {
        const data = await incomeService.fetchIncomeList()
        listIncomes.value = data
    }

    return { listIncomes, addIncome, updateIncome, fetchIncomeList }
})
