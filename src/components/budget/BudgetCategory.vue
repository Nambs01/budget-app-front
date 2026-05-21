<script setup lang="ts">
import { computed } from 'vue'

import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'

interface Budget {
    categoryBudgets: Record<string, number>
}

interface Props {
    budget: Budget
    expensesByCategory: Record<string, number>
    categoryLabels: Record<string, string>
}

const props = defineProps<Props>()

const categories = computed(() => {
    return Object.entries(props.budget.categoryBudgets).map(([category, budgetAmount]) => {
        const spent = props.expensesByCategory[category] || 0

        const percentage = budgetAmount ? (spent / budgetAmount) * 100 : 0

        const remaining = budgetAmount - spent

        return {
            category,
            budgetAmount,
            spent,
            percentage,
            remaining,
        }
    })
})

const getProgressClass = (percentage: number) => {
    if (percentage > 100) {
        return 'progress-red'
    }

    if (percentage > 80) {
        return 'progress-orange'
    }

    return 'progress-green'
}

const getTagSeverity = (percentage: number) => {
    return percentage > 100 ? 'danger' : 'secondary'
}
</script>

<template>
    <Card class="category-budget-card">
        <template #header>
            <div class="header">
                <div class="title">
                    <div class="icon">
                        <i class="pi pi-arrow-down-right"></i>
                    </div>

                    <span>Budgets par Catégorie</span>
                </div>
            </div>
        </template>

        <template #content>
            <div class="category-budget-grid">
                <Card v-for="item in categories" :key="item.category" class="category-item-card">
                    <template #header>
                        <div class="header">
                            <h3 class="title">
                                {{ categoryLabels[item.category] }}
                            </h3>

                            <Tag
                                :value="`${item.percentage.toFixed(0)}%`"
                                :severity="getTagSeverity(item.percentage)"
                            />
                        </div>
                    </template>

                    <template #content>
                        <div class="content">
                            <div class="row">
                                <span class="label">Budget</span>

                                <span class="value"> {{ item.budgetAmount.toFixed(2) }}€ </span>
                            </div>

                            <div class="row">
                                <span class="label">Dépensé</span>

                                <span
                                    class="value"
                                    :class="{
                                        'text-red': item.spent > item.budgetAmount,
                                    }"
                                >
                                    {{ item.spent.toFixed(2) }}€
                                </span>
                            </div>

                            <ProgressBar
                                :value="Math.min(item.percentage, 100)"
                                :class="getProgressClass(item.percentage)"
                            />

                            <div
                                class="remaining"
                                :class="{
                                    'text-green': item.remaining >= 0,
                                    'text-red': item.remaining < 0,
                                }"
                            >
                                Reste: {{ item.remaining.toFixed(2) }}€
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </template>
    </Card>
</template>

<style scoped lang="scss">
.category-budget-card {
    border-radius: 12px;

    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.05),
        0 4px 12px rgba(0, 0, 0, 0.08);

    .header {
        padding: 1.5rem 1.5rem 0.75rem;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        font-size: 1.1rem;
        font-weight: 700;
    }

    .icon {
        width: 2rem;
        height: 2rem;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 10px;

        background: #f3e8ff;
        color: #9333ea;

        i {
            font-size: 0.9rem;
        }
    }
}

.category-budget-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.category-item-card {
    border: 2px solid #e5e7eb;
    border-radius: 12px;

    .header {
        padding: 1.25rem 1.25rem 0.75rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title {
        margin: 0;

        font-size: 1rem;
        font-weight: 700;
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .label {
            font-size: 0.875rem;
            color: #6b7280;
        }

        .value {
            font-size: 0.875rem;
            font-weight: 600;
        }
    }

    .remaining {
        font-size: 0.875rem;
        font-weight: 700;
    }
}

/* Couleurs */
.text-red {
    color: #dc2626;
}

.text-orange {
    color: #ea580c;
}

.text-green {
    color: #16a34a;
}

/* ProgressBar */
:deep(.p-progressbar) {
    height: 0.75rem;
    border-radius: 999px;
}

:deep(.progress-red .p-progressbar-value) {
    background: #dc2626;
}

:deep(.progress-orange .p-progressbar-value) {
    background: #ea580c;
}

:deep(.progress-green .p-progressbar-value) {
    background: #16a34a;
}
</style>
