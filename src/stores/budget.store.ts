import { ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useToastService } from '@/composables/useToastService'
import { BudgetService } from '@/services/budget.service'
import type { Budget, BudgetForm } from '@/interfaces/budget.interface'
import { useAuthStore } from './auth.store'

export const useBudgetStore = defineStore('budget', () => {
    const toast = useToastService()
    const budgetService = BudgetService.getInstance()
    const budget = ref<Budget>()

    const { month } = storeToRefs(useAuthStore())

    const fetchBudgetOfMonth = async () => {
        try {
            const data = await budgetService.fetchBudgetOfMonth(month.value)
            budget.value = data
        } catch (error) {
            console.error('Fetch budget of month failed:', error)
        }
    }

    const addBudget = async (data: BudgetForm) => {
        try {
            const response = await budgetService.create(data)
            budget.value = response
            toast.success('Budget enregistré avec succès')
        } catch (error) {
            console.error('Add budget failed:', error)
        }
    }

    const updateBudget = async (id: string, data: BudgetForm) => {
        try {
            const response = await budgetService.update(id, data)
            budget.value = response
            toast.success('Budget mis à jour avec succès')
        } catch (error) {
            console.error('Update budget failed:', error)
        }
    }

    return { budget, fetchBudgetOfMonth, addBudget, updateBudget }
})
