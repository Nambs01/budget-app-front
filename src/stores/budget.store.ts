import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToastService } from '@/composables/useToastService'
import { BudgetService } from '@/services/budget.service'
import type { Budget, BudgetForm } from '@/interfaces/budget.interface'

export const useBudgetStore = defineStore('budget', () => {
    const toast = useToastService()
    const budgetService = BudgetService.getInstance()
    const budgetList = ref<Budget[]>([])

    const addBudget = async (data: BudgetForm) => {
        try {
            const response = await budgetService.create(data)
            budgetList.value.unshift(response)
            toast.success('Budget enregistré avec succès')
        } catch (error) {
            console.error('Add budget failed:', error)
        }
    }

    const updateBudget = async (id: string, data: BudgetForm) => {
        try {
            const response = await budgetService.update(id, data)
            const index = budgetList.value.findIndex((budget) => budget.id === id)
            if (index !== -1) {
                budgetList.value[index] = response
                toast.success('Budget mis à jour avec succès')
            } else {
                console.warn(`Budget with id ${id} not found in the list`)
            }
        } catch (error) {
            console.error('Update budget failed:', error)
        }
    }

    return { budgetList, addBudget, updateBudget }
})
