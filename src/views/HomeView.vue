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
        </div>
        <div class="body">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Logo from '@/components/Logo.vue'
import { useAuthStore } from '@/stores/auth.store'

const currentUser = useAuthStore().currentUser
const route = useRoute()
const activedRoutePath = ref('/dashboard')

const menus = [
    {
        path: '/dashboard',
        icon: 'pi pi-objects-column',
        label: 'Tableau de bord',
    },
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
        position: sticky;
        top: 0;
        & > div {
            padding: 1rem 10%;
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
                        color: gray;
                    }
                }
            }
        }

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
                transition: background-color 0.3s ease;

                &:hover {
                    background-color: #2564eb24;
                    color: var(--primary-color);
                }

                &.active {
                    color: #fff;
                    background-color: var(--primary-color);
                }
            }
        }
    }

    .body {
        padding: 1rem 10%;
    }
}
</style>
