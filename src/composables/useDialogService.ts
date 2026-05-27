import BudgetForm from '@/components/budget/BudgetForm.vue'
import ExpenseForm from '@/components/expense/ExpenseForm.vue'
import IncomeForm from '@/components/income/IncomeForm.vue'
import type { Budget } from '@/interfaces/budget.interface'
import type { Expense } from '@/interfaces/expense.interface'
import type { Income } from '@/interfaces/income.interface'
import { useDialog } from 'primevue/usedialog'
import { h, type Component } from 'vue'

interface DialogHeader {
    icon: string
    title: string
    subtitle: string
}

function makeHeader({ icon, title, subtitle }: DialogHeader) {
    return h('div', { style: 'display:flex;align-items:center;gap:0.875rem;width:100%' }, [
        h('span', {
            class: 'dialog-icon',
            innerHTML: `<i class="${icon}" style="font-size:1rem"></i>`,
        }),
        h('div', { class: 'dialog-title-group' }, [
            h('span', { class: 'p-dialog-title' }, title),
            h('span', { class: 'dialog-subtitle' }, subtitle),
        ]),
    ])
}

export function useDialogService() {
    const dialog = useDialog()

    function openDialog(component: Component, header: DialogHeader, data?: Income | Budget) {
        dialog.open(component, {
            props: {
                modal: true,
                draggable: false,
                breakpoints: { '640px': '95vw' },
                class: 'finance-dialog',
            },
            data,
            templates: {
                header: () => makeHeader({ ...header }),
            },
        })
    }

    function openBudgetForm(data?: Budget) {
        const header: DialogHeader = {
            icon: 'pi pi-wallet',
            title: data ? 'Modifier le budget' : 'Nouveau budget',
            subtitle: data ? `Budget du mois de ${data.month}` : 'Définissez votre budget mensuel',
        }
        openDialog(BudgetForm, header, data)
    }

    function openIncomeForm(data?: Income) {
        const header: DialogHeader = {
            icon: 'fa-solid fa-arrow-trend-up',
            title: data ? 'Modifier le revenu' : 'Nouveau revenu',
            subtitle: data ? `Revenu : ${data.title}` : 'Enregistrez une source de revenu',
        }
        openDialog(IncomeForm, header, data)
    }

    function openExpenseForm(data?: Expense) {
        const header: DialogHeader = {
            icon: 'fa-solid fa-arrow-trend-up',
            title: data ? 'Modifier une dépense' : 'Nouvelle dépense',
            subtitle: data
                ? `Modifiication d'une dépense`
                : 'Enregistrez une nouvelle dépense avec sa catégorie et priorité',
        }
        openDialog(ExpenseForm, header, data)
    }

    return { openBudgetForm, openIncomeForm, openExpenseForm }
}
