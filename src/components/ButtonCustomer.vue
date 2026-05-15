<template>
    <button class="btn" @click="onClick">
        <i :class="icon" v-if="icon"></i>
        <span>{{ label }}</span>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    label: string
    icon?: string
    onClick: () => void
}>()
</script>

<style lang="scss" scoped>
.btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 10px;
    font-weight: bold;
    font-size: 0.9rem;
    border-radius: 8px;
    border: none;
    color: #fff;
    background-color: var(--primary-color);
}
</style>
