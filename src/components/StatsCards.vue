<script setup lang="ts">
import { ExpenseCategory, ExpenseCategoryLabels } from '@/enums/expense.enum'
import { IncomeCategory, IncomeCategoryLabels } from '@/enums/income.enum'
import { formatAriary } from '@/utils/currency.util'
import { computed } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'expenses' | 'income'

interface Props {
    mode?: Mode
    total: { amount: number; transaction: number }
    topCategory?: {
        category: string
        total: number
    } | null
    thrift: number
}

interface ModeConfig {
    label: string
    catLabel: string
    budgetLabel: string
    suffix: string
    txLabel: string
    modifier: string
}

// ─── Props ────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<Props>(), {})

// ─── Computed ─────────────────────────────────────────────────────────────────

const isExpenses = computed<boolean>(() => props.mode === 'expenses')

const config = computed<ModeConfig>(() => ({
    label: isExpenses.value ? 'Total des dépenses' : 'Total des revenus',
    catLabel: isExpenses.value ? 'Catégorie principale' : 'Source principale',
    budgetLabel: isExpenses.value ? 'Dépense alloué' : 'Épargne possible',
    suffix: isExpenses.value ? ' dépensés' : ' reçus',
    txLabel: isExpenses.value ? 'transaction(s) ce mois' : 'entrée(s) ce mois',
    modifier: isExpenses.value ? 'expenses' : 'income',
}))

const nameOfCategory = computed(() => {
    if (!props.topCategory) return 'Aucun'
    else {
        if (props.mode === 'expenses')
            return ExpenseCategoryLabels[props.topCategory.category as ExpenseCategory]
        else return IncomeCategoryLabels[props.topCategory.category as IncomeCategory]
    }
})

const budgetPercent = computed<number>(() =>
    props.total.amount > 0 ? Math.min(100, (props.thrift / props.total.amount) * 100) : 0,
)
</script>

<template>
    <div class="stats-cards">
        <!-- Carte 1 — Total -->
        <Card
            class="stats-cards__card stats-cards__card--accent"
            :class="`stats-cards__card--${config.modifier}`"
        >
            <template #header>
                <div class="stats-cards__header">
                    <span class="stats-cards__label">{{ config.label }}</span>
                    <div
                        class="stats-cards__icon-wrap"
                        :class="`stats-cards__icon-wrap--${config.modifier}`"
                    >
                        <i
                            class="stats-cards__icon fa-solid"
                            :class="isExpenses ? 'fa-arrow-trend-down' : 'fa-arrow-trend-up'"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </template>
            <template #content>
                <div class="stats-cards__total" :class="`stats-cards__total--${config.modifier}`">
                    {{ formatAriary(total.amount) }}
                </div>
                <p class="stats-cards__sub">{{ props.total.transaction }} {{ config.txLabel }}</p>
            </template>
        </Card>

        <!-- Carte 2 — Catégorie / Source principale -->
        <Card class="stats-cards__card">
            <template #header>
                <div class="stats-cards__header">
                    <span class="stats-cards__label">{{ config.catLabel }}</span>
                </div>
            </template>
            <template #content>
                <template v-if="props.topCategory">
                    <div class="stats-cards__category-name">{{ nameOfCategory }}</div>
                    <p class="stats-cards__sub">
                        {{ formatAriary(props.topCategory.total) }} {{ config.suffix }}
                    </p>
                </template>
                <p v-else class="stats-cards__empty">Aucune donnée</p>
            </template>
        </Card>

        <!-- Carte 3 — Budget / Épargne -->
        <Card class="stats-cards__card">
            <template #header>
                <div class="stats-cards__header">
                    <span class="stats-cards__label">{{ config.budgetLabel }}</span>
                </div>
            </template>
            <template #content>
                <div class="stats-cards__budget">{{ formatAriary(thrift) }}</div>
                <div class="stats-cards__progress">
                    <div
                        class="stats-cards__progress-bar"
                        :class="`stats-cards__progress-bar--${config.modifier}`"
                        :style="{ width: budgetPercent + '%' }"
                        role="progressbar"
                        :aria-valuenow="budgetPercent"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    />
                </div>
                <p class="stats-cards__sub">{{ budgetPercent.toFixed(0) }}% du total</p>
            </template>
        </Card>
    </div>
</template>

<style lang="scss">
// ─── Tokens ────────────────────────────────────────────────────────────────────
$color-expenses: #dc2626;
$color-expenses-bg: #fef2f2;
$color-income: #16a34a;
$color-income-bg: #f0fdf4;
$color-budget: #2563eb;

$border-accent-width: 4px;
$card-gap: 1.5rem;
$icon-size: 2.5rem;
$radius: 0.5rem;

// ─── Grid ─────────────────────────────────────────────────────────────────────
.stats-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: $card-gap;

    @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
    }
}

// ─── Card base ─────────────────────────────────────────────────────────────────
.stats-cards__card {
    &.p-card {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

        .p-card-body {
            padding: 0;
        }
    }

    // Accent border variant
    &--accent {
        &.p-card {
            border-left: $border-accent-width solid transparent;
            border-radius: $radius;
        }

        &.stats-cards__card--expenses.p-card {
            border-left-color: $color-expenses;
        }

        &.stats-cards__card--income.p-card {
            border-left-color: $color-income;
        }
    }
}

// ─── Header ────────────────────────────────────────────────────────────────────
.stats-cards__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem 0.5rem;
}

.stats-cards__label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-text-muted-color);
}

// ─── Icon ──────────────────────────────────────────────────────────────────────
.stats-cards__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: $icon-size;
    height: $icon-size;
    border-radius: $radius;

    &--expenses {
        background-color: $color-expenses-bg;

        .stats-cards__icon {
            color: $color-expenses;
        }
    }

    &--income {
        background-color: $color-income-bg;

        .stats-cards__icon {
            color: $color-income;
        }
    }
}

.stats-cards__icon {
    font-size: 1.125rem;
}

// ─── Content ───────────────────────────────────────────────────────────────────
.stats-cards__card {
    .p-card-content {
        padding: 0 1.25rem 1rem;
    }
}

.stats-cards__total {
    font-size: 1.875rem;
    font-weight: 700;
    line-height: 1.2;

    &--expenses {
        color: $color-expenses;
    }
    &--income {
        color: $color-income;
    }
}

.stats-cards__category-name {
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--p-text-color);
}

.stats-cards__budget {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-budget;
}

.stats-cards__sub {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
}

.stats-cards__empty {
    font-size: 0.875rem;
    color: var(--p-text-muted-color);
}

// ─── Progress bar ──────────────────────────────────────────────────────────────
.stats-cards__progress {
    margin-top: 0.625rem;
    height: 6px;
    background-color: var(--p-content-border-color);
    border-radius: 99px;
    overflow: hidden;
}

.stats-cards__progress-bar {
    height: 100%;
    border-radius: 99px;
    transition: width 0.4s ease;
    background-color: $color-budget;
}
</style>
