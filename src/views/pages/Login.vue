<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>MESC Apps</h1>
                  <p class="text-medium-emphasis">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user"/>
                    </CInputGroupText>
                    <CFormInput v-model="username" placeholder="Username"/>
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked"/>
                    </CInputGroupText>
                    <CFormInput
                        v-model="password"
                        placeholder="Password"
                        type="password"
                        @keyup.enter="login"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="8">
                      <CButton class="px-4" color="primary" @click="login">
                        Login
                      </CButton>
                    </CCol>
                    <CCol :xs="4" class="text-right">
                      <CButton class="px-0" color="link">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import {LoadIndicator} from "@/lib/load-indicator";
import Swal from 'sweetalert2'
import axiosInstance from "@/lib/api-auth"
import authService from "@/lib/auth";
import router from "@/router";

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async login() {
      LoadIndicator('Signing in...')

      const data = {
        username: this.username,
        password: this.password
      }

      await axiosInstance
          .post('/auth/login', data)
          .then((response) => {
            authService.setToken(response.data.data.token, response.data.data.userType, response.data.data.name)
            Swal.close()
            router.push('/dashboard')
          }).catch((error) => {
            if (error.response && error.response.status === 400) {
              Swal.fire({
                icon: 'error',
                title: error.response.data.statusDescription,
              })
            } else {
              // Handle other errors
              console.log(error)
            }
          })
    },
  },
}
</script>
