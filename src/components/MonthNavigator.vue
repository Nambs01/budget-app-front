<template>
    <div class="month-navigator">
        <Button
            text
            rounded
            icon="pi pi-chevron-left"
            class="nav-btn"
            @click="previousMonth"
            aria-label="Mois précédent"
        />
        <span class="month-label">{{ formattedMonth }}</span>
        <Button
            text
            rounded
            icon="pi pi-chevron-right"
            class="nav-btn"
            @click="nextMonth"
            aria-label="Mois suivant"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const formattedMonth = computed(() => {
    return authStore.month
        .toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric',
        })
        .replace(/^\w/, (c) => c.toUpperCase())
})

function previousMonth() {
    authStore.updateMonth(-1)
}

function nextMonth() {
    authStore.updateMonth(1)
}
</script>

<style scoped>
.month-navigator {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--p-content-border-color, #e5e7eb);
    border-radius: 999px;
    background: var(--p-content-background, #fff);
}

.month-label {
    min-width: 9rem;
    text-align: center;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--p-text-color, #1f2937);
    user-select: none;
}

.nav-btn {
    width: 2rem !important;
    height: 2rem !important;
    color: var(--p-text-muted-color, #6b7280) !important;
}

.nav-btn:hover {
    background: var(--p-content-hover-background, #f3f4f6) !important;
}
</style>
