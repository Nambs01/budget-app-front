<template>
    <Form
        class="form"
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        @submit="onSubmit"
    >
        <!-- Nom -->
        <div class="form-group">
            <label for="income-title">Nom</label>
            <InputText
                id="income-title"
                name="title"
                type="text"
                placeholder="Exemple : Salaire mensuel"
                fluid
                :invalid="$form.title?.invalid"
            />
            <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">
                {{ $form.title.error?.message }}
            </Message>
        </div>

        <!-- Source -->
        <div class="form-group">
            <label for="income-source">Source</label>
            <InputText
                id="income-source"
                name="source"
                type="text"
                placeholder="Exemple : Entreprise"
                fluid
                :invalid="$form.source?.invalid"
            />
            <Message v-if="$form.source?.invalid" severity="error" size="small" variant="simple">
                {{ $form.source.error?.message }}
            </Message>
        </div>

        <!-- Catégorie + Montant -->
        <div class="form-row cols-2">
            <div class="form-group">
                <label for="income-category">Catégorie</label>
                <Select
                    id="income-category"
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
                <label for="income-amount">Montant <span class="unit">Ar</span></label>
                <InputNumber
                    id="income-amount"
                    name="amount"
                    fluid
                    mode="currency"
                    currency="MGA"
                    locale="fr-MG"
                    :minFractionDigits="0"
                    :min="0"
                    :invalid="$form.amount?.invalid"
                />
                <Message
                    v-if="$form.amount?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ $form.amount.error?.message }}
                </Message>
            </div>
        </div>

        <!-- Date -->
        <div class="form-group">
            <label for="income-date">Date</label>
            <DatePicker
                id="income-date"
                v-model="date"
                dateFormat="dd/mm/yy"
                showIcon
                fluid
                iconDisplay="input"
                :maxDate="new Date()"
                :invalid="$form.date?.invalid"
            />
            <Message v-if="$form.date?.invalid" severity="error" size="small" variant="simple">
                {{ $form.date.error?.message }}
            </Message>
        </div>

        <!-- Footer -->
        <div class="form-footer">
            <Button type="button" label="Annuler" text severity="secondary" @click="close" />
            <Button type="submit" label="Enregistrer" icon="pi pi-check" :loading="isLoading" />
        </div>
    </Form>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { IncomeCategory, IncomeCategoryLabels } from '@/enums/income.enum'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import type { Income, IncomeForm } from '@/interfaces/income.interface'
import type { FormSubmitEvent } from '@primevue/forms'
import { useIncomeStore } from '@/stores/income.store'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'

const isLoading = ref(false)
const incomeStore = useIncomeStore()
const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')
const data: Income = dialogRef?.value.data
const updateMode = dialogRef?.value.data ? true : false

const date = ref<Date>(new Date())
onMounted(() => {
    if (data) date.value = new Date(data.date)
})

const optionsCategory = Object.values(IncomeCategory).map((value) => ({
    label: IncomeCategoryLabels[value],
    value,
}))

const incomeSchema = z.object({
    title: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    source: z.string().min(2, 'La source est obligatoire'),
    category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
    amount: z.number().min(1, 'Le montant est obligatoire'),
})

const initialValues = computed(() => {
    if (data) {
        return {
            title: data.title,
            source: data.source,
            category: data.category,
            amount: data.amount,
        }
    }

    return {
        title: '',
        source: '',
        category: IncomeCategory.SALARY,
        amount: 0,
    }
})

const resolver = zodResolver(incomeSchema)

const onSubmit = async (event: FormSubmitEvent) => {
    console.log(event.values)
    if (!event.valid || isLoading.value) return

    isLoading.value = true
    const payload: IncomeForm = {
        ...event.values,
        date: date.value.toDateString(),
    } as IncomeForm
    try {
        if (updateMode) {
            await incomeStore.updateIncome(data.id, payload)
        } else {
            await incomeStore.addIncome(payload)
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
