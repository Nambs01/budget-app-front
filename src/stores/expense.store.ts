import type { Expense, ExpenseForm } from '@/interfaces/expense.interface'
import { ExpenseService } from '@/services/expense.service'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useAuthStore } from './auth.store'
import { useToastService } from '@/composables/useToastService'
import { useBudgetStore } from './budget.store'
import { ExpensePriority } from '@/enums/expense.enum'

const PRIORITY_VALUE: Record<ExpensePriority, number> = {
    [ExpensePriority.ESSENTIAL]: 1,
    [ExpensePriority.IMPORTANT]: 2,
    [ExpensePriority.OPTIONAL]: 3,
}

export const useExpenseStore = defineStore('expense', () => {
    const listExpenses = ref<Expense[]>([])
    const { month } = storeToRefs(useAuthStore())

    const expenseService = ExpenseService.getInstance()
    const toast = useToastService()

    const addExpense = async (data: ExpenseForm) => {
        try {
            const response = await expenseService.create(data)
            listExpenses.value.unshift(response)
            await useBudgetStore().fetchAllocationBudget()
            toast.success('Dépense enregistré avec succès')
        } catch (error) {
            console.error('Add expense failed:', error)
        }
    }

    const updateExpense = async (id: string, data: ExpenseForm) => {
        const response = await expenseService.update(id, data)
        const index = listExpenses.value.findIndex((expense) => expense.id === id)
        if (index !== -1) {
            listExpenses.value[index] = response
            await useBudgetStore().fetchAllocationBudget()
            toast.success('Dépense mis à jour avec succès')
        } else {
            console.warn(`Expense with id ${id} not found in the list`)
        }
    }

    const fetchExpensesOfMonth = async () => {
        try {
            const data = await expenseService.getAllOfMonth(month.value)
            listExpenses.value = data
        } catch (error) {
            console.error('Fetch expenses of month failed:', error)
        }
    }

    const stats = computed(() => {
        const totalAmount = listExpenses.value.reduce((sum, expense) => sum + expense.amount, 0)
        const totalAllocated = listExpenses.value
            .filter((expense) => expense.allocated)
            .reduce((sum, expense) => sum + expense.amount, 0)

        const totalByCategories = listExpenses.value.reduce<Record<string, number>>(
            (accumulator, expense) => {
                const category = expense.category
                const amount = expense.amount

                if (!accumulator[category]) accumulator[category] = 0

                accumulator[category] += amount
                return accumulator
            },
            {},
        )

        const topCategory = Object.entries(totalByCategories).reduce<{
            category: string
            total: number
        } | null>((top, [category, total]) => {
            if (!top || total > top.total) {
                return { category, total }
            }
            return top
        }, null)

        return {
            total: { amount: totalAmount, transaction: listExpenses.value.length },
            topCategory,
            thrift: totalAllocated,
        }
    })

    const updateAllocation = (expenseAllocated: string[]) => {
        listExpenses.value = listExpenses.value.map((expense) => {
            return { ...expense, allocated: expenseAllocated.includes(expense.id) }
        })
    }

    const expenseSortedAllocation = computed(() => {
        const expensesSorted = [...listExpenses.value].sort((a, b) => {
            const priorityA = PRIORITY_VALUE[a.priority as ExpensePriority]
            const priorityB = PRIORITY_VALUE[b.priority as ExpensePriority]

            if (priorityA !== priorityB) return priorityA - priorityB
            return a.amount - b.amount
        })
        return expensesSorted
    })

    return {
        listExpenses,
        addExpense,
        updateExpense,
        fetchExpensesOfMonth,
        month,
        stats,
        updateAllocation,
        expenseSortedAllocation,
    }
})
