<template>
    <div class="expense">
        <HeaderPage
            :text="{
                title: 'Gestion des Dépenses',
                subtitle: 'Suivez et catégorisez vos dépenses',
            }"
            :button="{
                label: 'Ajouter un revenu',
                handleClick: () => console.log('Add expense'),
            }"
        />
        <CustomDataTable
            title="Historique des dépenses"
            type="expense"
            :data="[]"
            :columns="columns"
        />
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/interfaces/table.inteface'

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
</script>
