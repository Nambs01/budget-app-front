import { useToast as usePrimeToast } from 'primevue/usetoast'

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'

export interface ToastOptions {
    title?: string
    duration?: number
    closable?: boolean
    group?: string
}

export interface ToastItem {
    severity: ToastSeverity
    message: string
    options?: ToastOptions
}

class ToastService {
    private toast: ReturnType<typeof usePrimeToast> | null = null
    private openToasts: ReturnType<ReturnType<typeof usePrimeToast>['add']>[] = []

    /** À appeler une fois dans un composant (contexte Vue actif) */
    init() {
        this.toast = usePrimeToast()
    }

    private get instance() {
        if (!this.toast) {
            throw new Error('[ToastService] Not initialized. Call init() inside a Vue component.')
        }
        return this.toast
    }

    // ─── Core method ──────────────────────────────────────────────

    show(severity: ToastSeverity, message: string, options: ToastOptions = {}) {
        this.instance.add({
            severity,
            summary: options.title ?? this.getDefaultTitle(severity),
            detail: message,
            life: options.duration ?? 3000,
            closable: options.closable ?? true,
            group: options.group,
        })
    }

    // ─── Semantic shortcuts ───────────────────────────────────────

    success(message: string, options?: ToastOptions) {
        this.show('success', message, { title: 'Succès', ...options })
    }

    info(message: string, options?: ToastOptions) {
        this.show('info', message, { title: 'Information', ...options })
    }

    warning(message: string, options?: ToastOptions) {
        this.show('warn', message, { title: 'Attention', duration: 5000, ...options })
    }

    error(message: string, options?: ToastOptions) {
        this.show('error', message, {
            title: 'Erreur',
            duration: 6000,
            closable: true,
            ...options,
        })
    }

    // ─── Persistent toast (no auto-dismiss) ───────────────────────

    sticky(severity: ToastSeverity, message: string, options?: ToastOptions) {
        this.instance.add({
            severity,
            summary: options?.title ?? this.getDefaultTitle(severity),
            detail: message,
            life: undefined,
            closable: true,
            group: options?.group,
        })
    }

    // ─── Toast from API error ─────────────────────────────────────

    fromApiError(error: unknown, fallbackMessage = 'Une erreur est survenue') {
        const message = this.extractErrorMessage(error, fallbackMessage)
        this.error(message)
    }

    // ─── Multiple toasts ──────────────────────────────────────────

    batch(items: ToastItem[]) {
        items.forEach(({ severity, message, options }) => {
            this.show(severity, message, options)
        })
    }

    // ─── Clear ────────────────────────────────────────────────────

    clear() {
        this.instance.removeAllGroups()
    }

    // ─── Private helpers ──────────────────────────────────────────

    private getDefaultTitle(severity: ToastSeverity): string {
        const titles: Record<ToastSeverity, string> = {
            success: 'Succès',
            info: 'Information',
            warn: 'Attention',
            error: 'Erreur',
            secondary: 'Notice',
            contrast: 'Notice',
        }
        return titles[severity]
    }

    private extractErrorMessage(error: unknown, fallback: string): string {
        if (error instanceof Error) return error.message
        if (typeof error === 'object' && error !== null) {
            const err = error as Record<string, unknown>
            if (typeof err['message'] === 'string') return err['message']
            if (Array.isArray(err['message'])) return (err['message'] as string[]).join(', ')
            if (typeof err['error'] === 'string') return err['error']
        }
        if (typeof error === 'string') return error
        return fallback
    }
}

export const toastService = new ToastService()
