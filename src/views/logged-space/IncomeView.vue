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
    </div>
</template>

<script setup lang="ts">
import IncomeForm from '@/components/income/IncomeForm.vue'
import { useDialog } from 'primevue'

const dialog = useDialog()

const showAddIncome = () => {
    dialog.open(IncomeForm, {
        props: {
            header: 'Ajouter un revenu',
        },
    })
}
</script>
