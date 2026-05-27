<template>
    <div class="expense">
        <HeaderPage
            :text="{
                title: 'Gestion des Dépenses',
                subtitle: 'Suivez et catégorisez vos dépenses',
            }"
            :button="{
                label: 'Ajouter une dépense',
                handleClick: () => showExpenseForm(),
            }"
        />
        <div class="container">
            <StatsCards
                mode="expenses"
                :total="expenseStore.stats.total"
                :topCategory="expenseStore.stats.topCategory"
                :thrift="expenseStore.stats.thrift"
            />
            <CustomDataTable
                title="Historique des dépenses"
                type="expense"
                :data="expenseStore.listExpenses"
                :columns="columns"
                :openForm="showExpenseForm"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/interfaces/table.inteface'
import { useDialogService } from '@/composables/useDialogService'
import type { Expense } from '@/interfaces/expense.interface'
import { useExpenseStore } from '@/stores/expense.store'
import { watch } from 'vue'

const expenseStore = useExpenseStore()
const dialogService = useDialogService()

const showExpenseForm = (data?: Expense) => dialogService.openExpenseForm(data)

watch(
    () => expenseStore.month,
    () => {
        expenseStore.fetchExpensesOfMonth()
    },
    { immediate: true },
)

const columns: TableColumn[] = [
    {
        field: 'description',
        header: 'Décription',
    },
    {
        field: 'category',
        header: 'Catégorie',
    },
    {
        field: 'priority',
        header: 'Priorité',
    },
    {
        field: 'allocated',
        header: 'Allocation budget',
    },
    {
        field: 'amount',
        header: 'Montant',
        type: 'currency',
    },
    {
        field: 'actions',
        header: 'Actions',
    },
]
</script>
<style lang="scss" scoped>
.expense {
    .container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
}
</style>
