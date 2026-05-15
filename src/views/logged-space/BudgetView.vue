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
                handleClick: () => console.log('click'),
            }"
        />
        <div class="container">
            <BudgetNone />
        </div>
    </div>
</template>
