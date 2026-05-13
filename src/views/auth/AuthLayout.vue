<template>
    <div class="auth-layout">
        <div class="container">
            <div class="header">
                <Logo :size="2" />
                <h1>Bienvenue sur Budget Manager</h1>
                <p>Connectez-vous ou inscrivez-vous pour continuer</p>
            </div>
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">
import Logo from '@/components/Logo.vue'
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
            display: flex;
            flex-direction: column;
            align-items: center;
            h1 {
                font-size: 2rem;
            }
        }
    }
}
</style>
