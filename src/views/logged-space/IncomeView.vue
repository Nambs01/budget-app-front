<template>
    <div class="income">
        <HeaderPage
            :text="{
                title: 'Gestion des Revenus',
                subtitle: 'Suivez toutes vos sources de revenus',
            }"
            :button="{
                label: 'Ajouter un revenu',
                handleClick: showAddIncome,
            }"
        />
        <CustomDataTable
            title="Historique des revenus"
            type="income"
            :data="[]"
            :columns="columns"
        />
    </div>
</template>

<script setup lang="ts">
import IncomeForm from '@/components/income/IncomeForm.vue'
import { onMounted } from 'vue'
import { useDialog } from 'primevue'
import { useIncomeStore } from '@/stores/income.store'
import CustomDataTable from '@/components/CustomDataTable.vue'
import type { TableColumn } from '@/interfaces/table.inteface'

const incomeStore = useIncomeStore()
const dialog = useDialog()

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

const showAddIncome = () => {
    dialog.open(IncomeForm, {
        props: {
            header: 'Ajouter un revenu',
        },
    })
}
</script>
