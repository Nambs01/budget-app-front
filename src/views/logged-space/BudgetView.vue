<template>
    <div class="budget logged-space-page">
        <HeaderPage
            :text="{
                title: 'Gestion des Budgets',
                subtitle: 'Planifiez et suivez vos budgets mensuels',
            }"
            :button="{
                icon: 'pi pi-cog',
                label: 'Configurer le budget',
                handleClick: showConfigBudget,
            }"
        />
        <div class="container">
            <BudgetNone />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDialogService } from '@/composables/useDialogService'

const dialogService = useDialogService()
const showConfigBudget = () => dialogService.openBudgetForm()
</script>
