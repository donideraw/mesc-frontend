<template>
  <div>
    <CCard class="mb-4">
      <CCardBody>
        <CCardHeader>User Management</CCardHeader>
        <br/>
        <CRow>
          <CCol md="6">
            <CCard>
              <CCardHeader>Add New User</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol>
                    <CForm>
                      <CRow>
                        <CCol md="6">
                          <CFormInput
                              id="name"
                              v-model="name"
                              label="Name"
                              placeholder="Input name..."
                              type="text"
                          />
                        </CCol>
                        <CCol md="6">
                          <CFormInput
                              id="username"
                              v-model="username"
                              label="Username"
                              placeholder="Input username..."
                              type="text"
                          />
                        </CCol>
                      </CRow>
                      <br/>
                      <CRow>
                        <CCol md="6">
                          <CFormInput
                              id="Password"
                              v-model="password"
                              label="Password"
                              placeholder="Input password..."
                              type="password"
                          />
                        </CCol>
                        <CCol md="6">
                          <CFormSelect ref="userTypeSelect" v-model="userType" aria-label="Default select example" label="Role">
                            <option value="">Input Role</option>
                            <option value="staff">STAFF</option>
                            <option value="verificator">VERIFICATOR</option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCol>
                </CRow>
                <br/>
                <CRow>
                  <CCol md="10"></CCol>
                  <CCol md="2">
                    <CButton class="d-flex" color="primary" @click="addData">
                      Add
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <br/>
        <CTable align="middle" class="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell class="text-center">Name</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Username</CTableHeaderCell>
              <CTableHeaderCell class="text-center"
              >Date Created
              </CTableHeaderCell
              >
              <CTableHeaderCell class="text-center">Role</CTableHeaderCell>
              <CTableHeaderCell class="text-center"
              >Status
              </CTableHeaderCell
              >
              <CTableHeaderCell class="text-center"
              >Action
              </CTableHeaderCell
              >
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="item in userList" :key="item.id">
              <CTableDataCell class="text-center">
                <div>{{ item.name }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.username }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ formatDate(item.createdAt) }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div v-if="item.userType == 'ADMIN'">
                  <CBadge color="primary" shape="rounded-pill"> {{ item.userType }}</CBadge>
                </div>
                <div v-else-if="item.userType == 'STAFF'">
                  <CBadge color="warning" shape="rounded-pill"> {{ item.userType }}</CBadge>
                </div>
                <div v-else>
                  <CBadge color="secondary" shape="rounded-pill"> {{ item.userType }}</CBadge>
                </div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div v-if="item.isDeleted">
                  <CBadge color="danger" shape="rounded-pill"> INACTIVE</CBadge>
                </div>
                <div v-else>
                  <CBadge color="success" shape="rounded-pill"> ACTIVE</CBadge>
                </div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div v-if="item.isDeleted">
                  <CButton color="success" @click="activate(item.id)">
                    Activate
                  </CButton>
                </div>
                <div v-else>
                  <CButton color="danger" @click="deactivate(item.id)" :disabled="item.userType === 'ADMIN'">
                    Deactivate
                  </CButton>
                </div>
              </CTableDataCell>
            </CTableRow>
            <CTableRow></CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import axiosInstance from "@/lib/api-auth";
import Swal from "sweetalert2"
import {LoadIndicator} from "@/lib/load-indicator";
import router from "@/router";

export default {
  name: 'Login',
  data() {
    return {
      name: '',
      username: '',
      password: '',
      userType: '',
      userList: []
    }
  },
  methods: {
    clearData() {
      this.name = ''
      this.username = ''
      this.password = ''
      this.userType = ''
    },
    getData() {
      axiosInstance.get('/user')
          .then((response) => {
            this.userList = response.data.data
          })
    },
    addData() {

      if (this.username == '' || this.password == '' || this.name == '' || this.userType == '') {
        Swal.fire({
          icon: 'info',
          title: 'Please fill the form',
        })
      } else {

        const data = {
          username: this.username,
          password: this.password,
          name: this.name
        }

        axiosInstance
            .post('/register/' + this.userType, data)
            .then(() => {
              this.getData()
              this.clearData()
              Swal.fire({
                icon: 'success',
                title: 'Success',
              })
            })
      }
    },
    deactivate(id) {
      axiosInstance.get('/user/deactivate/' + id)
          .then(() => {
            this.getData()
            Swal.fire({
              icon: 'success',
              title: 'User deactivated!',
            })
          })
    },
    activate(id) {
      axiosInstance.get('/user/activate/' + id)
          .then(() => {
            this.getData()
            Swal.fire({
              icon: 'success',
              title: 'User activated!',
            })
          })
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      const date = new Date(dateString);
      return date.toLocaleString('en-US', options);
    }
  },
  beforeMount() {
    if (localStorage.getItem('token') == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'You must login first!',
      })
      router.push('/pages/login')
    } else {
      LoadIndicator('Loading data...')
      this.getData()
      Swal.close()
    }
  }
}
</script>
