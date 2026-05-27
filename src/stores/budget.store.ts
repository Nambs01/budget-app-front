import { ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useToastService } from '@/composables/useToastService'
import { BudgetService } from '@/services/budget.service'
import type { Budget, BudgetForm, StatsAllocation } from '@/interfaces/budget.interface'
import { useAuthStore } from './auth.store'
import { useExpenseStore } from './expense.store'
import type { Expense } from '@/interfaces/expense.interface'

export const useBudgetStore = defineStore('budget', () => {
    const toast = useToastService()
    const expenseStore = useExpenseStore()
    const authStore = useAuthStore()
    const budgetService = BudgetService.getInstance()

    const budget = ref<Budget>()
    const stats = ref<StatsAllocation>()

    const { month } = storeToRefs(useAuthStore())

    const fetchBudgetOfMonth = async () => {
        try {
            const data = await budgetService.fetchBudgetOfMonth(month.value)
            budget.value = data
            await fetchAllocationBudget()
        } catch (error) {
            console.error('Fetch budget of month failed:', error)
        }
    }

    const addBudget = async (data: BudgetForm) => {
        try {
            const response = await budgetService.create(data)
            budget.value = response
            await fetchAllocationBudget()
            toast.success('Budget enregistré avec succès')
        } catch (error) {
            console.error('Add budget failed:', error)
        }
    }

    const updateBudget = async (id: string, data: BudgetForm) => {
        try {
            const response = await budgetService.update(id, data)
            budget.value = response
            await fetchAllocationBudget()
            toast.success('Budget mis à jour avec succès')
        } catch (error) {
            console.error('Update budget failed:', error)
        }
    }

    const fetchAllocationBudget = async () => {
        try {
            if (budget.value) {
                const data = await budgetService.fetchAllocationBudgetOfMonth(month.value)
                stats.value = data.stats
                if (data.newAmountUser) authStore.updateAmount(data.newAmountUser)
                if (!expenseStore.listExpenses.length) await expenseStore.fetchExpensesOfMonth()
                expenseStore.updateAllocation(data.expenseAllocated)
            }
        } catch (error) {
            console.error('Fetch budget of month failed:', error)
        }
    }

    return {
        budget,
        fetchBudgetOfMonth,
        addBudget,
        updateBudget,
        month,
        fetchAllocationBudget,
        stats,
    }
})
