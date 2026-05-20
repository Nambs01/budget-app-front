<template>
    <Form
        :resolver="resolver"
        :initialValues="initialValues"
        class="form"
        @submit="onSubmit"
        v-slot="$form"
    >
        <!-- Mois + Montant -->
        <div class="form-row cols-2">
            <div class="form-group">
                <label for="budget-month">Mois</label>
                <DatePicker
                    name="mounth"
                    id="budget-month"
                    view="month"
                    dateFormat="MM yy"
                    placeholder="Sélectionner un mois"
                    :showIcon="true"
                    class="w-full"
                    :invalid="$form.mounth?.invalid"
                />
                <span class="form-error" v-if="$form.mounth?.invalid">
                    {{ $form.mounth.error?.message }}
                </span>
            </div>

            <div class="form-group">
                <label for="budget-amount"> Montant total</label>
                <InputNumber
                    name="amount"
                    mode="currency"
                    id="budget-amount"
                    placeholder="0"
                    :min="0"
                    :max="maxAmount"
                    :useGrouping="true"
                    currency="MGA"
                    locale="fr-MG"
                    :minFractionDigits="0"
                    class="w-full"
                    @value-change="currentAmount = $event ?? 0"
                    :invalid="$form.amount?.invalid"
                />
                <span class="form-error" v-if="$form.amount?.invalid">
                    {{ $form.amount.error?.message }}
                </span>
            </div>
        </div>

        <!-- Répartition par catégorie -->
        <div class="form-section">
            <div class="form-section-header">
                <div class="form-section-title">
                    Répartition par catégorie
                    <span class="form-section-badge">{{ options.length }}</span>
                </div>
                <Button
                    type="button"
                    label="Ajouter"
                    icon="pi pi-plus"
                    size="small"
                    outlined
                    @click="addOption"
                />
            </div>

            <TransitionGroup name="form-list" tag="div" class="form-list">
                <div v-for="(option, i) in options" :key="i" class="form-list-row">
                    <span class="form-list-index">{{ i + 1 }}</span>

                    <div class="form-list-fields">
                        <div class="form-group" style="margin-bottom: 0">
                            <label>Catégorie</label>
                            <Select
                                v-model="option.category"
                                :options="getOptionsCategoryAvailable(i)"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Choisir…"
                                class="w-full"
                            />
                        </div>
                        <!-- :defaultValue="optionsCategoryAvailable[0]?.value" -->
                        <div class="form-group" style="margin-bottom: 0">
                            <label>Montant <span class="unit">Ar</span></label>
                            <InputNumber
                                v-model="option.amount"
                                mode="currency"
                                placeholder="0"
                                :min="0"
                                :max="availableAmount + option.amount"
                                :useGrouping="true"
                                currency="MGA"
                                locale="fr-MG"
                                :minFractionDigits="0"
                                class="w-full"
                            />
                        </div>
                    </div>

                    <Button
                        type="button"
                        icon="pi pi-trash"
                        severity="danger"
                        text
                        rounded
                        @click="removeOption(i)"
                    />
                </div>
            </TransitionGroup>

            <!-- Barre d'allocation -->
            <div class="form-progress" v-if="options.length > 0 && currentAmount > 0">
                <div class="form-progress-info" :class="{ over: allocatedTotal > currentAmount }">
                    <span>Alloué</span>
                    <span>{{ fmt(allocatedTotal) }} / {{ fmt(currentAmount) }} Ar</span>
                </div>
                <div class="form-progress-track">
                    <div
                        class="form-progress-fill"
                        :class="{ over: allocatedTotal > currentAmount }"
                        :style="{
                            width: Math.min((allocatedTotal / currentAmount) * 100, 100) + '%',
                        }"
                    />
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="form-footer">
            <Button type="button" label="Annuler" text severity="secondary" @click="close" />
            <Button type="submit" label="Enregistrer" icon="pi pi-check" :loading="isLoading" />
        </div>
    </Form>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { inject } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import {
    BudgetCategory,
    BudgetCategoryLabels,
    type BudgetForm,
    type BudgetOption,
} from '@/interfaces/budget.interface'
import { useToastService } from '@/composables/useToastService'
import { useAuthStore } from '@/stores/auth.store'
import { useBudgetStore } from '@/stores/budget.store'
import { is } from 'zod/locales'

const toast = useToastService()
const authStore = useAuthStore()
const budgetStore = useBudgetStore()

const isLoading = ref(false)

// ── Zod schema ───────────────────────────────────────────
const schema = z.object({
    mounth: z.date().min(1, 'Le mois est requis.'),
    amount: z.number().min(1, 'Le montant doit être supérieur à 0.'),
})

const resolver = zodResolver(schema)

const initialValues = { mounth: '', amount: 0 }

// ── Options select ───────────────────────────────────────
const optionsCategory = Object.values(BudgetCategory).map((value) => ({
    label: BudgetCategoryLabels[value],
    value,
}))

function getOptionsCategoryAvailable(index: number) {
    return optionsCategory.filter(
        (opt) => !options.value.some((o, i) => i !== index && o.category === opt.value),
    )
}

// ── Dynamic options (hors Form pour le tableau) ──────────
const options = ref<BudgetOption[]>([])

// Montant courant du champ Form (pour la barre d'allocation)
const currentAmount = ref(0)
const maxAmount = computed(() => authStore.currentUser?.amount)

const availableAmount = computed(
    () => currentAmount.value - options.value.reduce((sum, o) => sum + (o.amount ?? 0), 0),
)

const allocatedTotal = computed(() => options.value.reduce((s, o) => s + (o.amount || 0), 0))

function addOption() {
    if (options.value.length >= optionsCategory.length) {
        toast.warning('Toutes les catégories ont déjà été ajoutées.')
        return
    }

    const defaultValue = getOptionsCategoryAvailable(options.value.length)[0]?.value
    options.value.push({ category: defaultValue ?? BudgetCategory.OTHER, amount: 0 })
}
function removeOption(i: number) {
    options.value.splice(i, 1)
}

const fmt = (n: number) => new Intl.NumberFormat('fr-MG').format(n)

// ── DynamicDialog ────────────────────────────────────────
const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')
const updateMode = dialogRef?.value.data ? true : false

async function onSubmit({ valid, values }: { valid: boolean; values: Record<string, unknown> }) {
    if (!valid) return

    isLoading.value = true
    try {
        const payload: BudgetForm = {
            mounth: values.mounth as Date,
            amount: values.amount as number,
            options: options.value.length ? [...options.value] : undefined,
        }

        if (updateMode) {
            // await budgetStore.updateBudget(data.id, payload)
        } else {
            await budgetStore.addBudget(payload)
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
