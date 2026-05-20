export interface IncomeForm {
    title: string
    source: string
    category: string
    amount: number
    date: string
}

export interface Income extends IncomeForm {
    id: string
    createdAt: string
    updatedAt: string
}

export interface IncomeApiResponse {
    income: Income
    amountUser: number
}
