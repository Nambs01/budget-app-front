<template>
    <div class="budget logged-space-page">
        <HeaderPage
            :text="{
                title: 'Allocation Intelligente du Budget',
                subtitle: 'Algorithme glouton pour optimiser l\'allocation de votre budget',
            }"
            :button="{
                icon: 'pi pi-cog',
                label: 'Configurer le budget',
                handleClick: showConfigBudget,
            }"
        />
        <div class="container">
            <template v-if="budgetStore.budget">
                <BudgetAllocation />
            </template>
            <template v-else>
                <BudgetNone />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDialogService } from '@/composables/useDialogService'
import { useAuthStore } from '@/stores/auth.store'
import { useBudgetStore } from '@/stores/budget.store'
import { watch } from 'vue'

const budgetStore = useBudgetStore()

watch(
    () => budgetStore.month,
    () => {
        budgetStore.fetchBudgetOfMonth()
    },
    { immediate: true },
)

const dialogService = useDialogService()
const showConfigBudget = () => dialogService.openBudgetForm(budgetStore.budget)

interface Budget {
    totalBudget: number
}

type Priority = 'essential' | 'important' | 'optional'

interface Expense {
    id: number
    description: string
    amount: number
    category: string
    priority: Priority
}

interface Allocation {
    expense: Expense
    allocated: boolean
    order: number
    reason: string
}

interface AllocationResult {
    totalAllocated: number
    remainingBudget: number
    allocations: Allocation[]
    summary: {
        essential: { count: number; total: number; allocated: number }
        important: { count: number; total: number; allocated: number }
        optional: { count: number; total: number; allocated: number }
    }
}

// ===============================
// STATIC DATA
// ===============================

const budget: Budget = {
    totalBudget: 2500,
}

const allocationResult: AllocationResult = {
    totalAllocated: 2100,
    remainingBudget: 400,

    summary: {
        essential: {
            count: 3,
            allocated: 1200,
            total: 1200,
        },

        important: {
            count: 2,
            allocated: 700,
            total: 900,
        },

        optional: {
            count: 2,
            allocated: 200,
            total: 500,
        },
    },

    allocations: [
        {
            order: 1,

            allocated: true,

            reason: 'Budget suffisant',

            expense: {
                id: 1,
                description: 'Loyer appartement',
                amount: 800,
                category: 'housing',
                priority: 'essential',
            },
        },

        {
            order: 2,

            allocated: true,

            reason: 'Budget suffisant',

            expense: {
                id: 2,
                description: 'Courses alimentaires',
                amount: 250,
                category: 'food',
                priority: 'essential',
            },
        },

        {
            order: 3,

            allocated: true,

            reason: 'Budget suffisant',

            expense: {
                id: 3,
                description: 'Facture internet',
                amount: 150,
                category: 'utilities',
                priority: 'essential',
            },
        },

        {
            order: 4,

            allocated: true,

            reason: 'Budget suffisant',

            expense: {
                id: 4,
                description: 'Transport mensuel',
                amount: 300,
                category: 'transport',
                priority: 'important',
            },
        },

        {
            order: 5,

            allocated: true,

            reason: 'Budget partiellement disponible',

            expense: {
                id: 5,
                description: 'Formation en ligne',
                amount: 400,
                category: 'education',
                priority: 'important',
            },
        },

        {
            order: 6,

            allocated: false,

            reason: 'Budget insuffisant',

            expense: {
                id: 6,
                description: 'Abonnement Netflix',
                amount: 120,
                category: 'entertainment',
                priority: 'optional',
            },
        },

        {
            order: 7,

            allocated: false,

            reason: 'Budget insuffisant',

            expense: {
                id: 7,
                description: 'Nouveau casque gaming',
                amount: 380,
                category: 'shopping',
                priority: 'optional',
            },
        },
    ],
}

const suggestions = [
    'Réduire les dépenses optionnelles pour augmenter votre épargne.',
    'Reporter l’achat du casque gaming au mois prochain.',
    'Optimiser les frais de transport avec un abonnement réduit.',
]

const categoryLabels: Record<string, string> = {
    housing: 'Logement',
    food: 'Alimentation',
    utilities: 'Services',
    transport: 'Transport',
    education: 'Éducation',
    entertainment: 'Divertissement',
    shopping: 'Shopping',
}

const priorityLabels: Record<string, string> = {
    essential: 'Essentiel',
    important: 'Important',
    optional: 'Optionnel',
}

const allocationPercent = (allocationResult.totalAllocated / budget.totalBudget) * 100
</script>

<style lang="scss" scoped>
.budget {
    .container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin: 1rem 0;
    }
}
</style>
