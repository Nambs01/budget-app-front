<template>
    <div class="logo">
        <i class="pi pi-dollar" :style="`font-size: ${size + 0.5}rem`"></i>
    </div>
</template>

<style lang="scss" scoped>
.logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: min-content;
    padding: 16px;
    border-radius: 20px;
    background: var(--primary-color);
    i {
        font-weight: bold;
        color: #fff;
    }
}
</style>

<script lang="ts" setup>
defineProps<{
    size: number
}>()
</script>
