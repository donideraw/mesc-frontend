import axios from 'axios'
import authService from '@/lib/auth'
import Swal from 'sweetalert2'

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BE_URL,
    headers: {},
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = authService.getToken()
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            authService.deleteToken()
            setTimeout(function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Session Expired',
                    text: 'Please login again',
                    allowOutsideClick: false,
                }).then(function () {
                    window.location.href = '/#/pages/login'
                })
            }, 0)
        }
        return Promise.reject(error)
    },
)

export default axiosInstance
