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
                            :onClick="() => openForm()"
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
                            <div :class="{ 'col-header': true, center: col.field == 'allocated' }">
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
                                        type === 'income'
                                            ? IncomeCategoryLabels[
                                                  slotProps.data
                                                      .category as keyof typeof IncomeCategoryLabels
                                              ]
                                            : ExpenseCategoryLabels[
                                                  slotProps.data
                                                      .category as keyof typeof ExpenseCategoryLabels
                                              ]
                                    "
                                    severity="primary"
                                    variant="outlined"
                                    size="small"
                                    rounded
                                />
                            </template>

                            <template v-else-if="col.field === 'priority'">
                                <Tag
                                    :value="
                                        ExpensePriorityLabels[
                                            slotProps.data
                                                .priority as keyof typeof ExpensePriorityLabels
                                        ]
                                    "
                                    :severity="severityOfPriority(slotProps.data.priority)"
                                    rounded
                                />
                            </template>

                            <template v-else-if="col.field == 'allocated'">
                                <i
                                    class="pi allocation-status"
                                    :class="
                                        slotProps.data.allocated
                                            ? 'pi-check-circle success-icon'
                                            : 'pi-times-circle danger-icon'
                                    "
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
                                        :onClick="() => openForm(slotProps.data)"
                                    />
                                    <Button
                                        icon="fa-solid fa-trash-can"
                                        severity="contrast"
                                        variant="text"
                                        rounded
                                        aria-label="Star"
                                    />
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
import { ExpenseCategoryLabels, ExpensePriority, ExpensePriorityLabels } from '@/enums/expense.enum'
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
        required: true,
    },
    data: {
        type: Array,
        required: true,
    },
    removeAction: {
        type: Function,
        required: false,
    },
    openForm: {
        type: Function,
        required: true,
    },
})

const severityOfPriority = (priority: ExpensePriority) => {
    switch (priority) {
        case ExpensePriority.ESSENTIAL:
            return 'danger'

        case ExpensePriority.IMPORTANT:
            return 'warn'

        case ExpensePriority.OPTIONAL:
            return 'info'
    }
}
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

        .allocation-status {
            font-size: 1.2rem;
            margin-left: 4rem;
            &.success-icon {
                color: #16a34a;
            }

            &.danger-icon {
                color: #dc2626;
            }
        }
    }
}
</style>
