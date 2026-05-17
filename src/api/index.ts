import axios from 'axios'
import { toastService } from '@/services/toast.service'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
})

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status

        if (status === 401) toastService.error('Session expirée, veuillez vous reconnecter')
        else if (status === 403) toastService.error('Accès non autorisé')
        else if (status === 404) toastService.warning('Ressource introuvable')
        else if (status >= 500) toastService.error('Erreur serveur, réessayez plus tard')
        else toastService.fromApiError(error.response?.data)

        return Promise.reject(error)
    },
)

export default axiosInstance
