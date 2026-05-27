import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { IncomeService } from '@/services/income.service'
import { useToastService } from '@/composables/useToastService'
import type { Income, IncomeForm } from '@/interfaces/income.interface'
import { useAuthStore } from './auth.store'
import { IncomeCategoryLabels } from '@/enums/income.enum'
import { useBudgetStore } from './budget.store'

export const useIncomeStore = defineStore('income', () => {
    const authStore = useAuthStore()
    const toast = useToastService()
    const incomeService = IncomeService.getInstance()
    const listIncomes = ref<Income[]>([])

    const { month } = storeToRefs(useAuthStore())
    const { budget } = storeToRefs(useBudgetStore())

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

    const fetchIncomesOfMonth = async () => {
        const data = await incomeService.fetchIncomesOfMonth(authStore.month)
        listIncomes.value = data
    }

    const stats = computed(() => {
        const totalAmount = listIncomes.value.reduce((sum, income) => sum + income.amount, 0)

        const totalByCategories = listIncomes.value.reduce<Record<string, number>>(
            (accumulator, income) => {
                const category = income.category
                const amount = income.amount

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

        const thrift = Math.max(0, totalAmount - (budget.value?.amount ?? 0))

        return {
            total: { amount: totalAmount, transaction: listIncomes.value.length },
            topCategory,
            thrift,
        }
    })

    return { listIncomes, addIncome, updateIncome, fetchIncomesOfMonth, month, stats }
})
