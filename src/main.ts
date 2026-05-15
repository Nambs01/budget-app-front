import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primevue/themes'
import DialogService from 'primevue/dialogservice'

import './assets/base.scss'
import 'primeicons/primeicons.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}',
        },
    },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: 'none',
        },
    },
    pt: {
        dialog: {
            mask: {
                style: 'background-color: rgba(0, 0, 0, 0.5);',
            },
            root: {
                style: { width: '25vw' },
            },
        },
    },
})
app.use(DialogService)

app.mount('#app')
