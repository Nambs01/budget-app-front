<template>
    <div class="home">
        <div class="sticky">
            <div class="header">
                <div class="left">
                    <Logo :size="1" />
                    <div class="content">
                        <span class="title">Budget Manager</span>
                        <span class="subtitle">Bienvenue, {{ currentUser.name }}</span>
                    </div>
                </div>
                <div class="right">
                    <Button
                        severity="danger"
                        variant="outlined"
                        label="Déconnexion"
                        icon="pi pi-sign-out"
                        :pt="{
                            label: { style: 'font-weight: bold;' },
                        }"
                    />
                </div>
            </div>
            <div class="navigation-bar">
                <div class="menu-bar">
                    <template v-for="(menu, index) in menus" :key="index">
                        <RouterLink
                            :to="menu.path"
                            :class="{ 'menu-item': true, active: activedRoutePath === menu.path }"
                        >
                            <i :class="menu.icon"></i>
                            <span>{{ menu.label }}</span>
                        </RouterLink>
                    </template>
                </div>
                <MonthNavigator />
                <div class="amount-available">
                    <span class="label">Solde :</span>
                    <span class="value">{{ formatAriary(currentUser.amount) }}</span>
                </div>
            </div>
        </div>
        <div class="body">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import Logo from '@/components/Logo.vue'
import { useAuthStore } from '@/stores/auth.store'
import MonthNavigator from '@/components/MonthNavigator.vue'
import { formatAriary } from '@/utils/currency.util'

const currentUser = useAuthStore().currentUser
const route = useRoute()
const activedRoutePath = ref('/budget')

const menus = [
    // {
    //     path: '/dashboard',
    //     icon: 'pi pi-objects-column',
    //     label: 'Tableau de bord',
    // },
    {
        path: '/budget',
        icon: 'pi pi-wallet',
        label: 'Budgets',
    },
    {
        path: '/expense',
        icon: 'fa-solid fa-arrow-trend-down',
        label: 'Dépenses',
    },
    {
        path: '/income',
        icon: 'fa-solid fa-arrow-trend-up',
        label: 'Revenus',
    },
]

watch(
    () => route.path,
    (newRoute, oldRoute) => {
        activedRoutePath.value = newRoute
    },
)
</script>

<style lang="scss" scoped>
.home {
    position: relative;
    .sticky {
        background-color: #fff;
        box-shadow: 0px 1px 28px 5px rgba(0, 0, 0, 0.08);
        position: sticky;
        top: 0;
        z-index: 10;
        & > div {
            padding: 1.5rem 10%;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 0.2px rgb(227, 226, 226) solid;

            .left {
                display: flex;
                align-items: center;
                gap: 1rem;

                .content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 5px;

                    .title {
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: var(--primary-color);
                    }
                    .subtitle {
                        color: var(--subtitle-color);
                    }
                }
            }
        }

        .navigation-bar {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;

            .menu-bar {
                display: flex;
                gap: 10px;

                .menu-item {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 10px;
                    font-weight: bold;
                    font-size: 0.9rem;
                    border-radius: 8px;
                    text-decoration: none;
                    color: #000;
                    transition: background-color 0.3s ease;

                    &:hover {
                        background-color: var(--primary-color-background);
                        color: var(--primary-color);
                    }

                    &.active {
                        color: #fff;
                        background-color: var(--primary-color);
                    }
                }
            }
            .amount-available {
                justify-self: end;
                background-color: #f0f9ff;
                padding: 6px 14px;
                border-radius: 30px;
                font-weight: bold;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                transition: all 0.2s ease;

                .value {
                    font-size: 1.2rem;
                    font-family: monospace;
                    letter-spacing: 0.5px;
                    color: #1e6f3f;
                }

                .label {
                    margin-right: 6px;
                    font-size: 0.8rem;
                    color: #2c7a4a;
                    text-transform: uppercase;
                }
            }
        }
    }

    .body {
        padding: 2rem 10%;
    }
}
</style>
