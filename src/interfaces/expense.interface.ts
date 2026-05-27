import type { ExpenseCategory, ExpensePriority } from '@/enums/expense.enum'

export interface Expense {
    id: string
    description: string
    month: string
    amount: number
    category: ExpenseCategory
    priority: ExpensePriority
    allocated: boolean
    createdAt: string
    updatedAt: string
    // options: BudgetOption[]
}

export interface ExpenseForm {
    month: Date
    amount: number
    description: string
    category: string
    priority: string
    // options?: BudgetOption[]
}
