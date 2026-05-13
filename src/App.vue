<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.store'

onMounted(() => {
    useAuthStore().fetchCurrentUser()
})
</script>

<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>

<style scoped lang="scss"></style>
