<template>
    <div class="login">
        <div class="flex justify-center">
            <Form
                v-slot="$form"
                :resolver="resolver"
                :initialValues="initialValues"
                @submit="onFormSubmit"
                class="form"
            >
                <div class="form-group">
                    <label for="email">Adresse email</label>
                    <InputText name="email" type="type" placeholder="example@gmail.com" fluid />
                    <Message
                        v-if="$form.email?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.email.error?.message }}</Message
                    >
                </div>
                <div class="form-group">
                    <label for="password">Mots de passe</label>
                    <Password
                        name="password"
                        placeholder="Votre mots de passe"
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
                        {{ $form.password.error.message }}
                    </Message>
                </div>
                <Button
                    type="submit"
                    severity="primary"
                    label="Se connecter"
                    class="btn-submit"
                    :pt="{
                        root: {
                            style: 'width: 100%;',
                        },
                        label: {
                            style: 'font-weight: bold;',
                        },
                    }"
                />
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
import { ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import type { Credential } from '@/interfaces/credential.interface'
import { useAuthStore } from '@/stores/auth.store'

const initialValues = ref({
    email: '',
    password: '',
})

const resolver = ref(
    zodResolver(
        z.object({
            email: z
                .string()
                .min(1, { message: 'Email obligatoire' })
                .email({ message: 'Email invalide' }),
            password: z.string().min(1, { message: 'Entrer votre mots de passe' }),
        }),
    ),
)

const onFormSubmit = async (event: FormSubmitEvent) => {
    if (event.valid) {
        const formValues = event.values as Credential
        await useAuthStore().login(formValues)
    }
}
</script>

<style scoped lang="scss">
.login {
    padding-top: 1rem;

    .p-button .btn-submit {
        margin-top: 1rem;
        :deep(.p-button-label) {
            font-weight: bold;
        }
    }
}
</style>
