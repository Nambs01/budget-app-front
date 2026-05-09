<template>
    <div class="auth-layout">
        <div class="container">
            <div class="header">
                <h1>Bienvenue sur Budget Manager</h1>
                <p>Connectez-vous ou inscrivez-vous pour continuer</p>
            </div>
            <div class="menu-bar">
                <div
                    :class="{ 'menu-item': true, active: activedLogin }"
                    @click="navigateToRegister(false)"
                >
                    Connexion
                </div>
                <div
                    :class="{ 'menu-item': true, active: !activedLogin }"
                    @click="navigateToRegister()"
                >
                    Inscription
                </div>
            </div>
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const activedLogin = ref(true)
const router = useRouter()

const navigateToRegister = (param: boolean = true) => {
    if (param == activedLogin.value) {
        activedLogin.value = !param

        if (param) {
            router.push('/auth/register')
        } else {
            router.push('/auth/login')
        }
    }
}
</script>

<style scoped lang="scss">
.auth-layout {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
        width: 500px;
        background-color: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;

        .header {
            h1 {
                font-size: 2rem;
            }
        }
        .menu-bar {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
            padding: 0.15rem;
            border-radius: 18px;
            background-color: rgba(37, 99, 235, 0.1);
            gap: 5px;

            .menu-item {
                cursor: pointer;
                text-decoration: none;
                font-weight: 600;
                padding: 0.4rem;
                border-radius: 18px;
                font-size: 0.9rem;
                width: 100%;
                transition: background-color 0.3s ease;

                &:hover {
                    background-color: white;
                }
                &.active {
                    background-color: var(--primary-color);
                    color: white;
                }
            }
        }
    }
}
</style>
