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
        <CustomDataTable
            title="Historique des revenus"
            type="income"
            :data="incomeStore.listIncomes"
            :columns="columns"
            :openForm="showIncomeForm"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useIncomeStore } from '@/stores/income.store'
import CustomDataTable from '@/components/CustomDataTable.vue'
import type { TableColumn } from '@/interfaces/table.inteface'
import { useDialogService } from '@/composables/useDialogService'
import type { Income } from '@/interfaces/income.interface'

const incomeStore = useIncomeStore()
const dialogService = useDialogService()

onMounted(() => {
    incomeStore.fetchIncomeList()
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
