<template>
    <Card class="datatable-card">
        <template #header>
            <div class="header">
                <h4>{{ title }}</h4>
            </div>
        </template>
        <template #content>
            <template v-if="data?.length === 0">
                <div class="data-none">
                    <i
                        :class="[
                            'fa-solid',
                            type === 'income' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down',
                        ]"
                    ></i>
                    <h2>{{ `Aucun ${type === 'income' ? 'revenu' : 'dépense'} ce mois` }}</h2>
                    <p>
                        {{
                            `Commencez à enregistrer vos ${type === 'income' ? 'revenus' : 'dépenses'}`
                        }}
                    </p>
                    <div class="btn-container">
                        <ButtonCustomer
                            :label="`Ajouter un ${type === 'income' ? 'revenu' : 'dépense'}`"
                            :onClick="() => console.log('click')"
                        />
                    </div>
                </div>
            </template>

            <template v-else>
                <DataTable :value="data" class="datatable-content" removableSort>
                    <Column
                        v-for="col of columns"
                        :key="col.field"
                        :field="col.field"
                        :sortable="col.field !== 'actions'"
                    >
                        <template #header>
                            <div class="col-header">
                                <span>{{ col.header }}</span>
                            </div>
                        </template>
                        <template #body="slotProps">
                            <template v-if="col.type === 'date'">
                                {{ formatDate(slotProps.data.date) }}
                            </template>

                            <template v-else-if="col.field === 'category'">
                                <Button
                                    :label="
                                        IncomeCategoryLabels[
                                            slotProps.data
                                                .category as keyof typeof IncomeCategoryLabels
                                        ]
                                    "
                                    severity="primary"
                                    variant="outlined"
                                    size="small"
                                    rounded
                                />
                            </template>

                            <template v-else-if="col.type == 'currency'">
                                <p :class="['amount', type]">
                                    <span>{{ type == 'income' ? '+' : '-' }}</span>
                                    <span> {{ formatAriary(slotProps.data.amount) }} </span>
                                </p>
                            </template>
                            <template v-else-if="col.field == 'actions'">
                                <div class="action">
                                    <Button
                                        icon="fa-solid fa-pencil"
                                        severity="contrast"
                                        variant="text"
                                        rounded
                                        aria-label="Star"
                                    />
                                    <Button
                                        icon="fa-solid fa-trash-can"
                                        severity="contrast"
                                        variant="text"
                                        rounded
                                        aria-label="Star"
                                    />
                                    <!-- icon="pi pi-trash" -->
                                </div>
                            </template>
                            <template v-else>
                                {{ slotProps.data[col.field] }}
                            </template>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import { IncomeCategoryLabels } from '@/enums/income.enum'
import type { TableColumn } from '@/interfaces/table.inteface'
import { formatAriary } from '@/utils/currency.util'
import { formatDate } from '@/utils/date.util'

defineProps({
    title: String,
    type: {
        type: String,
        required: true,
        validator: (value: string) => ['income', 'expense'].includes(value),
    },
    columns: {
        type: Array<TableColumn>,
        requered: true,
    },
    data: {
        type: Array,
        requered: true,
    },
    updateAction: {
        type: Function,
        requered: false,
    },
    removeAction: {
        type: Function,
        requered: false,
    },
})
</script>

<style lang="scss" scoped>
.datatable-card {
    .data-none {
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

    .header {
        padding-left: 1.25rem;
        color: #000;
    }
    .datatable-content {
        .col-header {
            color: #000;
        }
        .amount {
            font-weight: bold;
            &.income {
                color: var(--p-green-500);
            }
            &.expense {
                color: var(--p-red-500);
            }
        }
        .action {
            display: flex;
            gap: 1rem;
        }
    }
}
</style>
