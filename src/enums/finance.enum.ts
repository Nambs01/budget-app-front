export enum FinanceCategory {
    FOOD = 'food',
    HOUSING = 'housing',
    TRANSPORTATION = 'transportation',
    HEALTH = 'health',
    LEISURE = 'leisure',
    EDUCATION = 'education',
    SHOPPING = 'shopping',
    UTILITIES = 'utilities',
    OTHER = 'other',
}

export const FinanceCategoryLabels: Record<FinanceCategory, string> = {
    [FinanceCategory.FOOD]: 'Alimentation',
    [FinanceCategory.HOUSING]: 'Logement',
    [FinanceCategory.TRANSPORTATION]: 'Transport',
    [FinanceCategory.HEALTH]: 'Santé',
    [FinanceCategory.LEISURE]: 'Loisirs',
    [FinanceCategory.EDUCATION]: 'Éducation',
    [FinanceCategory.SHOPPING]: 'Shopping',
    [FinanceCategory.UTILITIES]: 'Services publics',
    [FinanceCategory.OTHER]: 'Autre',
}
