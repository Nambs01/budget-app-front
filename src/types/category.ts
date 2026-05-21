export interface Category {
    id: number
    name: string
    icon: string
    budget: number
    spent: number
}

export interface CategoryWithStats extends Category {
    pct: number
    reste: number
}

export interface NewCategory {
    name: string
    icon: string
    budget: number
    spent: number
}
