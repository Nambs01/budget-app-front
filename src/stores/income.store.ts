import { ref } from 'vue'
import { defineStore } from 'pinia'
import { IncomeService } from '@/services/income.service'
import { useToastService } from '@/composables/useToastService'
import type { Income, IncomeForm } from '@/interfaces/income.interface'
import { useAuthStore } from './auth.store'

export const useIncomeStore = defineStore('income', () => {
    const authStore = useAuthStore()
    const toast = useToastService()
    const incomeService = IncomeService.getInstance()
    const listIncomes = ref<Income[]>([])

    const addIncome = async (data: IncomeForm) => {
        try {
            const response = await incomeService.create(data)
            listIncomes.value.unshift(response.income)
            authStore.updateAmount(response.amountUser)
            toast.success('Revenu enregistré avec succès')
        } catch (error) {
            console.error('Add income failed:', error)
        }
    }

    const updateIncome = async (id: string, data: IncomeForm) => {
        const response = await incomeService.update(id, data)
        const index = listIncomes.value.findIndex((income) => income.id === id)
        if (index !== -1) {
            listIncomes.value[index] = response.income
            authStore.updateAmount(response.amountUser)
            toast.success('Revenu mis à jour avec succès')
        } else {
            console.warn(`Income with id ${id} not found in the list`)
        }
    }

    const fetchIncomeList = async () => {
        const data = await incomeService.fetchIncomeList()
        listIncomes.value = data
    }

    return { listIncomes, addIncome, updateIncome, fetchIncomeList }
})
