const authService = {
    getToken() {
        return localStorage.getItem('token')
    },
    setToken(accessToken, role, name) {
        localStorage.setItem('token', accessToken)
        localStorage.setItem('role', role)
        localStorage.setItem('name', name)
    },
    deleteToken() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('name')
    },
}

export default authService
