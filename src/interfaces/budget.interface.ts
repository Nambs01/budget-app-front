import type { ExpensePriority } from '@/enums/expense.enum'
import { FinanceCategory, FinanceCategoryLabels } from '@/enums/finance.enum'
import type { Expense } from './expense.interface'

export const BudgetCategory = FinanceCategory
export type BudgetCategory = FinanceCategory

export const BudgetCategoryLabels = FinanceCategoryLabels
export type BudgetCategoryLabels = typeof FinanceCategoryLabels

export interface Budget {
    id: string
    month: string
    amount: number
    createdAt: string
    updatedAt: string
    // options: BudgetOption[]
}

export interface BudgetForm {
    month: Date
    amount: number
    // options?: BudgetOption[]
}

export interface BudgetOption {
    category: BudgetCategory
    amount: number
}

export interface StatsAllocation {
    budgetAvailable: number
    expense: Record<ExpensePriority, { count: number; total: number; allocated: number }>
}

export interface Allocation {
    stats: StatsAllocation
    expenseAllocated: string[]
    newAmountUser: number | undefined
}
