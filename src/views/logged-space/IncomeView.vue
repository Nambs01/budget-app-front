<template>
    <div class="income">
        <HeaderPage
            :text="{
                title: 'Gestion des Revenus',
                subtitle: 'Suivez toutes vos sources de revenus',
            }"
            :button="{
                label: 'Ajouter un revenu',
                handleClick: () => showIncomeForm(),
            }"
        />
        <div class="container">
            <StatsCards
                mode="income"
                :total="incomeStore.stats.total"
                :topCategory="incomeStore.stats.topCategory"
                :thrift="incomeStore.stats.thrift"
            />
            <CustomDataTable
                title="Historique des revenus"
                type="income"
                :data="incomeStore.listIncomes"
                :columns="columns"
                :openForm="showIncomeForm"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useIncomeStore } from '@/stores/income.store'
import CustomDataTable from '@/components/CustomDataTable.vue'
import type { TableColumn } from '@/interfaces/table.inteface'
import { useDialogService } from '@/composables/useDialogService'
import type { Income } from '@/interfaces/income.interface'
import StatsCards from '@/components/StatsCards.vue'

const incomeStore = useIncomeStore()
const dialogService = useDialogService()

watch(
    () => incomeStore.month,
    () => {
        incomeStore.fetchIncomesOfMonth()
    },
    { immediate: true },
)

const data = {
    totalIncome: 5000,
    incomeThisMonth: [
        {
            id: 1,
            date: '2024-06-01',
            title: 'Salaire',
            source: 'Entreprise X',
            category: 'Salaire',
            amount: 3000,
        },
        {
            id: 2,
            date: '2024-06-10',
            title: 'Freelance',
            source: 'Client Y',
            category: 'Freelance',
            amount: 2000,
        },
    ],
    incomeByCategory: {
        salary: 3000,
        freelance: 2000,
    },
    categoryLabels: {
        salary: 'Salaire',
        freelance: 'Freelance',
    },
}

onMounted(() => {
    incomeStore.fetchIncomesOfMonth()
})

const columns: TableColumn[] = [
    {
        field: 'date',
        header: 'Date',
        type: 'date',
    },
    {
        field: 'title',
        header: 'Titre',
    },
    {
        field: 'source',
        header: 'Source',
    },
    {
        field: 'category',
        header: 'Catégorie',
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

const showIncomeForm = (data?: Income) => dialogService.openIncomeForm(data)
</script>

<style lang="scss" scoped>
.income {
    .container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
}
</style>
