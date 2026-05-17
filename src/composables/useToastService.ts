import { onMounted } from 'vue'
import { toastService } from '@/services/toast.service'

export function useToastService() {
    onMounted(() => {
        toastService.init()
    })

    return toastService
}
