<script setup lang="ts">
import { Card } from 'primevue'
import ButtonCustomer from '../ButtonCustomer.vue'
import { useDialogService } from '@/composables/useDialogService'

const dialogService = useDialogService()
const showConfigBudget = () => {
    dialogService.openBudgetForm()
}
</script>

<template>
    <div class="budget-none">
        <Card class="card-budget">
            <template #content>
                <i class="pi pi-wallet"></i>
                <h2>Aucun budget défini</h2>
                <p>Créez votre premier budget pour commencer à suivre vos dépenses</p>
                <div class="btn-container">
                    <ButtonCustomer
                        icon="pi pi-cog"
                        label="Configurer le budget"
                        :onClick="showConfigBudget"
                    />
                </div>
            </template>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
.budget-none {
    .card-budget {
        padding: 3rem 0;
        text-align: center;
        color: var(--subtitle-color);
        i {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        h2 {
            color: #000;
        }
        .btn-container {
            padding-top: 1rem;
            display: flex;
            justify-content: center;
        }
    }
}
</style>
