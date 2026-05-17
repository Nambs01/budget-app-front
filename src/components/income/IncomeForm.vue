<template>
    <div class="income-form">
        <Form
            class="form"
            v-slot="$form"
            :initialValues="initialValues"
            :resolver="resolver"
            @submit="onSubmit"
        >
            <div class="form-group">
                <label>Nom</label>
                <InputText name="title" type="text" placeholder="Exemple : Salaire mensuel" fluid />
                <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.title.error?.message }}
                </Message>
            </div>
            <div class="form-group">
                <label>Source</label>
                <InputText name="source" type="text" placeholder="Exemple : Entreprise" fluid />
                <Message
                    v-if="$form.source?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ $form.source.error?.message }}
                </Message>
            </div>
            <div class="form-group">
                <label>Catégorie</label>
                <Select
                    name="category"
                    :options="optionsCategory"
                    optionLabel="label"
                    optionValue="value"
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
                <label>Montant (Ar)</label>
                <InputNumber
                    fluid
                    name="amount"
                    inputId="amount"
                    mode="currency"
                    currency="MGA"
                    locale="fr-MG"
                    :minFractionDigits="0"
                    :min="0"
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
            <div class="form-group">
                <label>Date</label>
                <DatePicker
                    v-model="date"
                    dateFormat="dd/mm/yy"
                    showIcon
                    fluid
                    iconDisplay="input"
                    :maxDate="new Date()"
                />
                <Message v-if="$form.date?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.date.error?.message }}
                </Message>
            </div>
            <Button
                fluid
                type="submit"
                severity="primary"
                :label="submitLabel"
                :loading="isLoading"
                :pt="{
                    label: { style: 'font-weight: bold;' },
                }"
            />
        </Form>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { IncomeCategory, IncomeCategoryLabels } from '@/enums/income.enum'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import type { Income, IncomeCreate } from '@/interfaces/income.interface'
import type { FormSubmitEvent } from '@primevue/forms'
import { useIncomeStore } from '@/stores/income.store'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'

const isLoading = ref(false)
const incomeStore = useIncomeStore()
const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')
const data = dialogRef?.value.data
const updateMode = dialogRef?.value.data ? true : false

const date = ref<Date>(new Date())
onMounted(() => {
    if (data) date.value = new Date(data.date)
})

const submitLabel = updateMode ? 'Enregistrer' : 'Ajouter'

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
    const payload: IncomeCreate = {
        ...event.values,
        date: date.value.toDateString(),
    } as IncomeCreate
    try {
        if (updateMode) {
            // await incomeStore.updateIncome(payload)
        } else {
            await incomeStore.addIncome(payload)
        }
        dialogRef?.value.close()
    } finally {
        isLoading.value = false
    }
}
</script>

<style lang="scss" scoped>
.income-form {
    height: 100%;
    .form {
        height: 100%;
    }
}
</style>
