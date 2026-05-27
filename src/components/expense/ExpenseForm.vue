<template>
    <Form
        class="form"
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        @submit="onSubmit"
    >
        <div class="form-row cols-2">
            <div class="form-group">
                <label for="expense-description">Description</label>
                <InputText
                    id="expense-description"
                    name="description"
                    type="text"
                    placeholder="Loyer"
                    fluid
                    :invalid="$form.title?.invalid"
                />
                <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.title.error?.message }}
                </Message>
            </div>

            <div class="form-group">
                <label for="expense-month">Mois</label>
                <DatePicker
                    v-model="month"
                    name="month"
                    id="expense-month"
                    view="month"
                    dateFormat="MM yy"
                    placeholder="Sélectionner un mois"
                    :showIcon="true"
                    class="w-full"
                    :invalid="$form.month?.invalid"
                />
                <span class="form-error" v-if="$form.month?.invalid">
                    {{ $form.month.error?.message }}
                </span>
            </div>
        </div>

        <div class="form-row cols-2">
            <div class="form-group">
                <label for="expense-category">Catégorie</label>
                <Select
                    id="expense-category"
                    name="category"
                    :options="optionsCategory"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Choisir…"
                    fluid
                    :invalid="$form.category?.invalid"
                />
                <Message
                    v-if="$form.category?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ $form.category.error?.message }}
                </Message>
            </div>

            <div class="form-group">
                <label for="expense-priority">Priorité</label>
                <Select
                    id="expense-priority"
                    name="priority"
                    :options="optionsPriority"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Choisir…"
                    fluid
                    :invalid="$form.category?.invalid"
                />
                <Message
                    v-if="$form.category?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ $form.category.error?.message }}
                </Message>
            </div>
        </div>

        <div class="form-group">
            <label for="expense-amount">Montant <span class="unit">Ar</span></label>
            <InputNumber
                id="expense-amount"
                name="amount"
                fluid
                mode="currency"
                currency="MGA"
                locale="fr-MG"
                :minFractionDigits="0"
                :min="0"
                :invalid="$form.amount?.invalid"
                :readonly="data?.allocated || false"
            />
            <Message v-if="$form.amount?.invalid" severity="error" size="small" variant="simple">
                {{ $form.amount.error?.message }}
            </Message>
        </div>

        <div class="form-footer">
            <Button type="button" label="Annuler" text severity="secondary" @click="close" />
            <Button type="submit" label="Enregistrer" icon="pi pi-check" :loading="isLoading" />
        </div>
    </Form>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { computed, inject, ref, type Ref } from 'vue'
import type { FormSubmitEvent } from '@primevue/forms'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import {
    ExpenseCategory,
    ExpenseCategoryLabels,
    ExpensePriority,
    ExpensePriorityLabels,
} from '@/enums/expense.enum'
import type { Expense, ExpenseForm } from '@/interfaces/expense.interface'
import { useAuthStore } from '@/stores/auth.store'
import { useExpenseStore } from '@/stores/expense.store'

const isLoading = ref(false)
const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')
const data: Expense = dialogRef?.value.data
const updateMode = dialogRef?.value.data ? true : false

const authStore = useAuthStore()
const expenseStore = useExpenseStore()
const month = ref(authStore.month)

const optionsPriority = Object.values(ExpensePriority).map((value) => ({
    label: ExpensePriorityLabels[value],
    value,
}))

const optionsCategory = Object.values(ExpenseCategory).map((value) => ({
    label: ExpenseCategoryLabels[value],
    value,
}))

const expenseSchema = z.object({
    description: z.string().min(2, 'La déscription doit contenir au moins 2 caractères'),
    priority: z.string().min(1, 'Veuillez sélectionner la priorité'),
    amount: z.number().min(1, 'Le montant est obligatoire'),
    category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
})

const initialValues = computed(() => {
    if (data) {
        month.value = new Date(data.month)
        return {
            description: data.description,
            priority: data.priority,
            amount: data.amount,
            category: data.category,
        }
    }
    month.value = authStore.month
    return {
        title: '',
        priority: ExpensePriority.IMPORTANT,
        amount: 0,
        category: ExpenseCategory.FOOD,
    }
})

const resolver = zodResolver(expenseSchema)

const onSubmit = async (event: FormSubmitEvent) => {
    if (!event.valid || isLoading.value) return

    isLoading.value = true
    const payload: ExpenseForm = {
        ...event.values,
        month: month.value,
    } as ExpenseForm
    try {
        if (updateMode) {
            await expenseStore.updateExpense(data.id, payload)
        } else {
            await expenseStore.addExpense(payload)
        }
        close()
    } finally {
        isLoading.value = false
    }
}

function close() {
    dialogRef?.value.close()
}
</script>
