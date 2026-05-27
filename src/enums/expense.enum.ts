import { FinanceCategory, FinanceCategoryLabels } from './finance.enum'

export const ExpenseCategory = FinanceCategory
export type ExpenseCategory = FinanceCategory

export const ExpenseCategoryLabels = FinanceCategoryLabels
export type ExpenseCategoryLabels = typeof FinanceCategoryLabels

export enum ExpensePriority {
    ESSENTIAL = 'essential',
    IMPORTANT = 'important',
    OPTIONAL = 'optional',
}

export const ExpensePriorityLabels: Record<ExpensePriority, string> = {
    [ExpensePriority.ESSENTIAL]: 'Essentiel',
    [ExpensePriority.IMPORTANT]: 'Imporant',
    [ExpensePriority.OPTIONAL]: 'Optionnel',
}
