<template>
    <div class="auth-form">
        <div class="menu-bar">
            <div
                :class="{ 'menu-item': true, active: mode === 'login' }"
                @click="$router.push('/auth/login')"
            >
                Connexion
            </div>
            <div
                :class="{ 'menu-item': true, active: mode === 'register' }"
                @click="$router.push('/auth/register')"
            >
                Inscription
            </div>
        </div>
        <div class="flex justify-center">
            <Form
                v-slot="$form"
                :resolver="resolver"
                :initialValues="initialValues"
                @submit="onFormSubmit"
                class="form"
            >
                <div class="form-group">
                    <label>Adresse email</label>
                    <InputText name="email" type="text" placeholder="example@gmail.com" fluid />
                    <Message
                        v-if="$form.email?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.email.error?.message }}
                    </Message>
                </div>

                <!-- Champ nom uniquement pour le register -->
                <div v-if="mode === 'register'" class="form-group">
                    <label>Nom complet</label>
                    <InputText name="name" type="text" placeholder="Jean Dupont" fluid />
                    <Message
                        v-if="$form.name?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.name.error?.message }}
                    </Message>
                </div>

                <div class="form-group">
                    <label>Mot de passe</label>
                    <Password
                        name="password"
                        placeholder="Votre mot de passe"
                        :feedback="false"
                        toggleMask
                        fluid
                    />
                    <Message
                        v-if="$form.password?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.password.error?.message }}
                    </Message>
                </div>

                <!-- Confirmation mot de passe uniquement pour le register -->
                <div v-if="mode === 'register'" class="form-group">
                    <label>Confirmer le mot de passe</label>
                    <Password
                        name="confirmPassword"
                        placeholder="Confirmer le mot de passe"
                        :feedback="false"
                        toggleMask
                        fluid
                    />
                    <Message
                        v-if="$form.confirmPassword?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.confirmPassword.error?.message }}
                    </Message>
                </div>

                <Button
                    type="submit"
                    severity="primary"
                    :label="submitLabel"
                    :loading="isLoading"
                    :pt="{
                        root: { style: 'width: 100%;' },
                        label: { style: 'font-weight: bold;' },
                    }"
                />

                <p class="auth-switch">
                    {{ switchText }}
                    <RouterLink :to="switchRoute">{{ switchLinkLabel }}</RouterLink>
                </p>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'
import { Button } from 'primevue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { ref, computed } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth.store'

type AuthMode = 'login' | 'register'

const props = defineProps<{ mode: AuthMode }>()

const isLoading = ref(false)
const authStore = useAuthStore()

// --- Labels dynamiques ---
const submitLabel = computed(() => (props.mode === 'login' ? 'Se connecter' : "S'inscrire"))
const switchText = computed(() =>
    props.mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?',
)
const switchLinkLabel = computed(() => (props.mode === 'login' ? "S'inscrire" : 'Se connecter'))
const switchRoute = computed(() => (props.mode === 'login' ? '/auth/register' : '/auth/login'))

// --- Schémas Zod ---
const loginSchema = z.object({
    email: z.string().min(1, { message: 'Email obligatoire' }).email({ message: 'Email invalide' }),
    password: z.string().min(1, { message: 'Entrez votre mot de passe' }),
})

const registerSchema = z
    .object({
        email: z
            .string()
            .min(1, { message: 'Email obligatoire' })
            .email({ message: 'Email invalide' }),
        name: z.string().min(2, { message: 'Nom obligatoire (2 caractères min)' }),
        password: z.string().min(4, { message: '4 caractères minimum' }),
        confirmPassword: z.string().min(1, { message: 'Confirmation obligatoire' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    })

const resolver = ref(zodResolver(props.mode === 'login' ? loginSchema : registerSchema))

// --- Valeurs initiales ---
const initialValues = ref(
    props.mode === 'login'
        ? { email: '', password: '' }
        : { email: '', name: '', password: '', confirmPassword: '' },
)

// --- Soumission ---
const onFormSubmit = async (event: FormSubmitEvent) => {
    if (!event.valid || !isLoading.value) return

    isLoading.value = true
    try {
        if (props.mode === 'login') {
            await authStore.login(event.values as { email: string; password: string })
        } else {
            await authStore.register(
                event.values as { email: string; name: string; password: string },
            )
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped lang="scss">
.auth-form {
    padding-top: 1.5rem;

    .menu-bar {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.5rem;
        padding: 4px;
        border-radius: 18px;
        background-color: rgba(37, 99, 235, 0.1);
        gap: 5px;

        .menu-item {
            cursor: pointer;
            font-weight: 600;
            padding: 0.4rem;
            border-radius: 14px;
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

    .form {
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .auth-switch {
        text-align: center;
        margin-top: 0.75rem;
        font-size: 0.875rem;

        a {
            font-weight: bold;
            color: var(--p-primary-color);
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>
