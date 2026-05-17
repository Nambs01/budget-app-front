import { ref } from 'vue'
import { defineStore } from 'pinia'
import { IncomeService } from '@/services/income.service'
import { useToastService } from '@/composables/useToastService'
import type { Income, IncomeCreate } from '@/interfaces/income.interface'

export const useIncomeStore = defineStore('income', () => {
    const toast = useToastService()
    const incomeService = IncomeService.getInstance()
    const listIncomes = ref<Income[]>([])

    const addIncome = async (data: IncomeCreate) => {
        try {
            const income = await incomeService.create(data)
            listIncomes.value.unshift(income)
            toast.success('Revenu enregistré avec succès')
        } catch (error) {
            console.error('Add income failed:', error)
        }
    }

    const updateIncome = async () => {}

    return { listIncomes, addIncome, updateIncome }
})
