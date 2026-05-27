<template>
    <div class="budget-allocation">
        <!-- Stats -->
        <section class="stats-grid">
            <Card class="stat-card blue">
                <template #content>
                    <div class="stat-content">
                        <span class="stat-label">Budget Total</span>

                        <div class="stat-value blue-text">
                            {{ formatAriary(budgetStore.budget?.amount ?? 0) }}
                        </div>

                        <small>Disponible ce mois</small>
                    </div>
                </template>
            </Card>

            <Card class="stat-card green">
                <template #content>
                    <div class="stat-content">
                        <span class="stat-label">Budget Alloué</span>

                        <div class="stat-value green-text">
                            {{ formatAriary(budgetAllocated) }}
                        </div>

                        <small> {{ budgetAllocatedPercent }}% du budget </small>
                    </div>
                </template>
            </Card>

            <Card class="stat-card purple">
                <template #content>
                    <div class="stat-content">
                        <span class="stat-label">Budget Restant</span>

                        <div class="stat-value purple-text">
                            {{ formatAriary(budgetStore.stats?.budgetAvailable ?? 0) }}
                        </div>

                        <small> {{ (100 - budgetAllocatedPercent).toFixed(2) }}% disponible </small>
                    </div>
                </template>
            </Card>
        </section>

        <!-- Summary -->
        <Card class="section-card">
            <template #title>
                <div class="card-title">
                    <div class="icon-box blue-bg">
                        <i class="pi pi-calculator"></i>
                    </div>

                    <span>Tableau de bord d'Allocation</span>
                </div>
            </template>

            <template #content>
                <div class="summary-grid">
                    <div
                        v-for="(stats, priority) in budgetStore.stats?.expense"
                        :key="priority"
                        class="summary-item"
                        :class="priority"
                    >
                        <div class="summary-header">
                            <span class="capitalize">
                                {{ ExpensePriorityLabels[priority] }}
                            </span>

                            <Tag :value="`${stats.count} dépenses`" severity="secondary" />
                        </div>

                        <div class="summary-value">{{ formatAriary(stats.allocated) }}</div>

                        <small> sur {{ formatAriary(stats.total) }} demandés </small>

                        <ProgressBar
                            class="progress"
                            :value="
                                stats.total > 0
                                    ? Math.round((stats.allocated / stats.total) * 100)
                                    : 0
                            "
                        />
                    </div>
                </div>
            </template>
        </Card>

        <!-- Allocations -->
        <Card class="section-card">
            <template #title>
                <div>
                    <div>Ordre d'Allocation (Priorité Décroissante)</div>

                    <small class="card-description">
                        L'algorithme glouton traite d'abord les dépenses essentielles, puis
                        importantes, puis optionnelles
                    </small>
                </div>
            </template>

            <template #content>
                <div v-if="budgetStore.stats?.expense" class="allocations-list">
                    <div
                        v-for="(expense, index) in expenseStore.expenseSortedAllocation"
                        :key="expense.id"
                        class="allocation-item"
                        :class="expense.allocated ? 'success' : 'danger'"
                    >
                        <div class="allocation-left">
                            <div class="allocation-order">
                                {{ index + 1 }}
                            </div>

                            <i
                                class="pi allocation-status"
                                :class="
                                    expense.allocated
                                        ? 'pi-check-circle success-icon'
                                        : 'pi-times-circle danger-icon'
                                "
                            />

                            <div class="allocation-details">
                                <div class="expense-title">
                                    {{ expense.description }}
                                </div>

                                <div class="allocation-tags">
                                    <Tag
                                        severity="info"
                                        :value="ExpenseCategoryLabels[expense.category]"
                                    />

                                    <Tag
                                        :value="ExpensePriorityLabels[expense.priority]"
                                        :severity="prioritySeverities[expense.priority]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="allocation-right">
                            <div
                                class="expense-amount"
                                :class="expense.allocated ? 'green-text' : 'red-text'"
                            >
                                {{ formatAriary(expense.amount) }}
                            </div>

                            <small>
                                {{ expense.allocated ? 'Budget suffisant' : 'Budget insuffisant' }}
                            </small>
                        </div>
                    </div>
                </div>

                <div v-else class="empty-state">Aucune dépense à allouer ce mois</div>
            </template>
        </Card>

        <!-- Explanation -->
        <Card class="info-card">
            <template #title>
                <div class="card-title blue-text-dark">
                    <i class="pi pi-exclamation-triangle"></i>

                    <span> Comment fonctionne l'algorithme glouton ? </span>
                </div>
            </template>

            <template #content>
                <div class="info-content">
                    <p>
                        <strong>Principe :</strong>
                        L'algorithme glouton alloue le budget de manière optimale en priorisant les
                        dépenses par ordre d'importance.
                    </p>

                    <ol>
                        <li>
                            Trie toutes les dépenses par priorité (Essentiel → Important →
                            Optionnel)
                        </li>

                        <li>
                            Pour les dépenses de même priorité, favorise les moins chères pour
                            maximiser le nombre de dépenses couvertes
                        </li>

                        <li>Alloue le budget séquentiellement jusqu'à épuisement</li>
                    </ol>

                    <p>
                        <strong>Avantage :</strong>
                        Garantit que les besoins essentiels sont toujours couverts en premier, tout
                        en maximisant le nombre total de dépenses satisfaites.
                    </p>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import type { Expense } from '@/interfaces/expense.interface'
import type { StatsAllocation } from '@/interfaces/budget.interface'
import { formatAriary } from '@/utils/currency.util'
import { useBudgetStore } from '@/stores/budget.store'
import { computed } from 'vue'
import { ExpenseCategoryLabels, ExpensePriorityLabels } from '@/enums/expense.enum'
import { useExpenseStore } from '@/stores/expense.store'

const budgetStore = useBudgetStore()
const expenseStore = useExpenseStore()

const budgetAllocated = computed(
    () => (budgetStore.budget?.amount ?? 0) - (budgetStore.stats?.budgetAvailable ?? 0),
)
const budgetAllocatedPercent = computed(() =>
    ((budgetAllocated.value / (budgetStore.budget?.amount ?? 0)) * 100).toFixed(2),
)

const prioritySeverities = {
    essential: 'danger',
    important: 'warn',
    optional: 'info',
}
</script>

<style scoped lang="scss">
.budget-allocation {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
    }
}

.stat-card {
    border-left: 5px solid transparent;

    &.blue {
        border-color: #3b82f6;
    }

    &.green {
        border-color: #10b981;
    }

    &.purple {
        border-color: #8b5cf6;
    }
}

.stat-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.stat-label {
    color: #6b7280;
    font-size: 0.9rem;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
}

.blue-text {
    color: #2563eb;
}

.green-text {
    color: #059669;
}

.purple-text {
    color: #7c3aed;
}

.red-text {
    color: #dc2626;
}

.blue-text-dark {
    color: #1e3a8a;
}

.section-card {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.card-description {
    display: block;
    margin-top: 0.5rem;
    color: #6b7280;
}

.icon-box {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;

    i {
        font-size: 1rem;
    }

    &.blue-bg {
        background: #dbeafe;
        color: #2563eb;
    }

    &.orange-bg {
        background: #fed7aa;
        color: #ea580c;
    }
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
    }
}

.summary-item {
    padding: 1rem;
    border-radius: 12px;
    border: 2px solid;

    &.essential {
        background: #fef2f2;
        border-color: #fca5a5;
    }

    &.important {
        background: #fffbeb;
        border-color: #fcd34d;
    }

    &.optional {
        background: #e7f1ff;
        border-color: #3b82f6;
    }
}

.summary-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.summary-value {
    font-size: 1.75rem;
    font-weight: 700;
}

.progress {
    margin-top: 1rem;
}

.capitalize {
    text-transform: capitalize;
}

.suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.suggestion-item {
    padding: 1rem;
    border-radius: 10px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
}

.allocations-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.allocation-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 1rem;
    border-radius: 12px;
    border: 2px solid;

    &.success {
        background: #f0fdf4;
        border-color: #86efac;
    }

    &.danger {
        background: #fef2f2;
        border-color: #fca5a5;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
}

.allocation-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.allocation-order {
    width: 2rem;
    height: 2rem;

    border-radius: 50%;
    border: 2px solid #d1d5db;
    background: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: 700;
}

.allocation-status {
    font-size: 1.2rem;
}

.success-icon {
    color: #16a34a;
}

.danger-icon {
    color: #dc2626;
}

.allocation-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.expense-title {
    font-weight: 600;
}

.allocation-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.allocation-right {
    text-align: right;

    @media (max-width: 768px) {
        text-align: left;
    }
}

.expense-amount {
    font-size: 1.2rem;
    font-weight: 700;
}

.empty-state {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
}

.info-card {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
}

.info-content {
    color: #1e3a8a;

    ol {
        padding-left: 1.5rem;
    }

    li {
        margin-bottom: 0.5rem;
    }
}
</style>
