import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthLayout from '@/views/auth/AuthLayout.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import { useAuthStore } from '@/stores/auth.store'

const routes = [
    { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
    {
        path: '/auth',
        component: AuthLayout,
        redirect: '/auth/login',
        children: [
            {
                path: 'login',
                name: 'Login',
                component: LoginView,
            },
            {
                path: 'register',
                name: 'Register',
                component: RegisterView,
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !useAuthStore().isAuthenticated) {
        next('/auth/login')
    } else {
        next()
    }
})

export default router
