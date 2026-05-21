<template>
    <div class="budget logged-space-page">
        <HeaderPage
            :text="{
                title: 'Gestion des Budgets',
                subtitle: 'Planifiez et suivez vos budgets mensuels',
            }"
            :button="{
                icon: 'pi pi-cog',
                label: 'Configurer le budget',
                handleClick: showConfigBudget,
            }"
        />
        <div class="container">
            <BudgetDashboard :totalBudget="100000" :totalSpent="70000" />
            <template v-if="budget.categoryBudgets">
                <BudgetCategory
                    :budget="budget"
                    :expenses-by-category="expensesByCategory"
                    :category-labels="categoryLabels"
                />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import BudgetDashboard from '@/components/budget/BudgetDashboard.vue'
import { useDialogService } from '@/composables/useDialogService'

const dialogService = useDialogService()
const showConfigBudget = () => dialogService.openBudgetForm()

const budget = {
    categoryBudgets: {
        food: 500,
        transport: 200,
        entertainment: 300,
        shopping: 400,
    },
}

const expensesByCategory = {
    food: 420,
    transport: 260,
    entertainment: 180,
    shopping: 510,
}

const categoryLabels: Record<string, string> = {
    food: 'Alimentation',
    transport: 'Transport',
    entertainment: 'Loisirs',
    shopping: 'Shopping',
}
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
