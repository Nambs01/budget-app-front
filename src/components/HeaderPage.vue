<template>
    <div class="header">
        <div class="left">
            <h1 class="title">{{ text.title }}</h1>
            <p class="subtitle" v-if="text.subtitle">{{ text.subtitle }}</p>
        </div>
        <div class="right">
            <ButtonCustomer
                :icon="button.icon ?? 'fa-solid fa-plus'"
                :label="button.label"
                :onClick="button.handleClick"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import ButtonCustomer from './ButtonCustomer.vue'

defineProps<{
    button: {
        label: string
        icon?: string
        handleClick: () => void
    }
    text: {
        title: string
        subtitle?: string
    }
}>()
</script>

<style scoped lang="scss">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    .left {
        .subtitle {
            color: var(--subtitle-color);
            line-height: 0;
        }
    }
}
</style>
