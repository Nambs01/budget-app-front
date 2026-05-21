<script setup lang="ts">
import { computed } from 'vue'

import { formatAriary } from '@/utils/currency.util'

interface Props {
    totalBudget: number
    totalSpent: number
}

const props = defineProps<Props>()

const budgetProgress = computed(() => {
    if (props.totalBudget === 0) return 0

    return (props.totalSpent / props.totalBudget) * 100
})

const progressColorClass = computed(() => {
    if (budgetProgress.value > 100) {
        return 'progress-red'
    }

    if (budgetProgress.value > 80) {
        return 'progress-orange'
    }

    return 'progress-green'
})

const remainingBudget = computed(() => {
    return props.totalBudget - props.totalSpent
})
</script>

<template>
    <Card class="budget-card">
        <template #header>
            <div class="header">
                <div class="title">
                    <div class="icon">
                        <i class="pi pi-wallet"></i>
                    </div>

                    <span>Budget Total</span>
                </div>
            </div>
        </template>

        <template #content>
            <div class="content">
                <div class="summary">
                    <div>
                        <p class="amount">{{ formatAriary(totalBudget) }}</p>

                        <p class="label">Budget mensuel défini</p>
                    </div>

                    <div class="summary-right">
                        <p class="spent">{{ formatAriary(totalSpent) }}</p>

                        <p class="label">Dépensé ce mois</p>
                    </div>
                </div>

                <div class="progress-section">
                    <div class="progress-header">
                        <span>Progression</span>

                        <span
                            class="progress-value"
                            :class="{
                                'text-red': budgetProgress > 100,
                                'text-orange': budgetProgress > 80 && budgetProgress <= 100,
                                'text-green': budgetProgress <= 80,
                            }"
                        >
                            {{ budgetProgress }}%
                        </span>
                    </div>

                    <ProgressBar
                        :value="Math.min(budgetProgress, 100)"
                        :class="progressColorClass"
                    />
                </div>

                <div v-if="budgetProgress > 100" class="alert">
                    <i class="pi pi-exclamation-triangle"></i>

                    <span>
                        Budget dépassé de
                        {{ formatAriary(totalSpent - totalBudget) }}
                    </span>
                </div>

                <div class="remaining">
                    <p class="label remaining-label">Reste disponible</p>

                    <p
                        class="remaining-value"
                        :class="{
                            'text-green': remainingBudget >= 0,
                            'text-red': remainingBudget < 0,
                        }"
                    >
                        {{ formatAriary(remainingBudget) }}
                    </p>
                </div>
            </div>
        </template>
    </Card>
</template>

<style scoped lang="scss">
.budget-card {
    border-left: 4px solid #3b82f6;
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
        background: #dbeafe;
        color: #2563eb;

        i {
            font-size: 0.9rem;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .summary-right {
        text-align: right;
    }

    .amount {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
    }

    .spent {
        margin: 0;
        font-size: 1.7rem;
        font-weight: 700;
        color: #dc2626;
    }

    .label {
        margin-top: 0.25rem;
        font-size: 0.875rem;
        color: #6b7280;
    }

    .progress-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .progress-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        font-weight: 600;
    }

    .progress-value {
        font-weight: 700;
    }

    .alert {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 10px;
        background: #fef2f2;
        color: #dc2626;
        font-size: 0.875rem;
        font-weight: 600;

        i {
            flex-shrink: 0;
        }
    }

    .remaining {
        padding: 1rem;
        border-radius: 10px;
        background: rgba(107, 114, 128, 0.08);
    }

    .remaining-label {
        margin-bottom: 0.25rem;
    }

    .remaining-value {
        margin: 0;

        font-size: 2rem;
        font-weight: 700;
    }
}

/* Couleurs texte */
.text-red {
    color: #dc2626;
}

.text-orange {
    color: #ea580c;
}

.text-green {
    color: #16a34a;
}

/* PrimeVue ProgressBar customization */
:deep(.p-progressbar) {
    height: 0.8rem;
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
