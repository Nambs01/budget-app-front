export enum IncomeCategory {
    SALARY = 'salary',
    FREELANCE = 'freelance',
    INVESTMENT = 'investment',
    BUSINESS = 'business',
    GIFT = 'gift',
    OTHER = 'other',
}

export const IncomeCategoryLabels: Record<IncomeCategory, string> = {
    [IncomeCategory.SALARY]: 'Salaire',
    [IncomeCategory.INVESTMENT]: 'Investissement',
    [IncomeCategory.BUSINESS]: 'Business',
    [IncomeCategory.GIFT]: 'Cadeau',
    [IncomeCategory.FREELANCE]: 'Freelance',
    [IncomeCategory.OTHER]: 'Autre',
}
