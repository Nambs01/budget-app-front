import { FinanceCategory, FinanceCategoryLabels } from '@/enums/finance.enum'

export const BudgetCategory = FinanceCategory
export type BudgetCategory = FinanceCategory

export const BudgetCategoryLabels = FinanceCategoryLabels
export type BudgetCategoryLabels = typeof FinanceCategoryLabels

export interface Budget {
    id: string
    month: string
    amount: number
    options: BudgetOption[]
}

export interface BudgetForm {
    month: Date
    amount: number
    options?: BudgetOption[]
}

export interface BudgetOption {
    category: BudgetCategory
    amount: number
}
