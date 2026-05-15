<template>
    <div class="income-form">
        <Form class="form" v-slot="$form">
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
                <Select :options="optionsCategory" optionLabel="label" optionValue="value" />
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
                    inputId="amount"
                    mode="currency"
                    currency="MGA"
                    locale="fr-MG"
                    :minFractionDigits="0"
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
                <DatePicker name="date" dateFormat="dd/mm/yy" showIcon fluid iconDisplay="input" />
                <Message v-if="$form.date?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.date.error?.message }}
                </Message>
            </div>
            <Button
                fluid
                type="submit"
                severity="primary"
                label="Ajouter"
                :pt="{
                    label: { style: 'font-weight: bold;' },
                }"
            />
            <!-- :label="submitLabel"
                :loading="isLoading" -->
        </Form>
    </div>
</template>

<script setup lang="ts">
import { IncomeCategory, IncomeCategoryLabels } from '@/enums/income.enum'

const optionsCategory = Object.values(IncomeCategory).map((value) => ({
    label: IncomeCategoryLabels[value],
    value,
}))
</script>

<style lang="scss" scoped>
.income-form {
    height: 100%;
    .form {
        height: 100%;
    }
}
</style>
