import Swal from 'sweetalert2'
import loading from '@/assets/gif/loading.gif'

export const LoadIndicator = (message) => {
  Swal.fire({
    allowOutsideClick: false,
    title: message,
    imageUrl: loading,
    imageWidth: 300,
    imageHeight: 200,
    imageAlt: 'Custom image',
    showConfirmButton: false,
  })
}
