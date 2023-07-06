<template>
  <CCard class="mb-4">
    <CCardHeader>Change Logs</CCardHeader>
    <CCardBody>
      <br />
      <CRow>
        <CCol md="3">
          <CInputGroup class="mb-3">
            <CInputGroupText id="basic-addon1">Search</CInputGroupText>
            <CFormInput
                v-model="keyword"
                type="text"
                @keyup.enter="getData"
            />
          </CInputGroup>
        </CCol>
      </CRow>
      <CTable align="middle" class="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell class="text-center">No</CTableHeaderCell>
            <CTableHeaderCell class="text-center">Material</CTableHeaderCell>
            <CTableHeaderCell class="text-center">Status</CTableHeaderCell>
            <CTableHeaderCell class="text-center">Updated By</CTableHeaderCell>
            <CTableHeaderCell class="text-center">Role</CTableHeaderCell>
            <CTableHeaderCell class="text-center">Date Updated</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="(item, index) in dataList" :key="item.id">
            <CTableDataCell class="text-center">
              <div>{{ (currentPage*itemsPerPage) + index + 1 }}</div>
            </CTableDataCell>
            <CTableDataCell class="text-center">
              <div>{{ item.dataId }}</div>
            </CTableDataCell>
            <CTableDataCell class="text-center">
              <div v-if="item.status == 'UPLOADED'">
                <CBadge color="primary" shape="rounded-pill"> {{ item.status }}</CBadge>
              </div>
              <div v-else-if="item.status == 'ASSIGNED'">
                <CBadge color="secondary" shape="rounded-pill"> {{ item.status }}</CBadge>
              </div>
              <div v-else-if="item.status == 'SUBMITTED'">
                <CBadge color="warning" shape="rounded-pill"> {{ item.status }}</CBadge>
              </div>
              <div v-else>
                <CBadge color="success" shape="rounded-pill"> {{ item.status }}</CBadge>
              </div>
            </CTableDataCell>
            <CTableDataCell class="text-center">
              <div>{{ item.updatedBy }}</div>
            </CTableDataCell>
            <CTableDataCell class="text-center">
              <div>{{ item.userType }}</div>
            </CTableDataCell>
            <CTableDataCell class="text-center">
              <div>{{ formatDate(item.updatedAt) }}</div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow></CTableRow>
        </CTableBody>
      </CTable>
      <br />
      <CPagination size="sm" aria-label="Page navigation example">
        <CPaginationItem @click="onPrevPagination" :style="{ cursor: 'pointer' }">Previous</CPaginationItem>
        <div v-for = "item in paginationCurrentNumber">
          <CPaginationItem @click="changePage(item - 1)" :style="{ cursor: 'pointer' }">{{ item }}</CPaginationItem>
        </div>
        <CPaginationItem @click="onNextPagination" :style="{ cursor: 'pointer' }">Next</CPaginationItem>
      </CPagination>
    </CCardBody>
  </CCard>
</template>

<script>
import axiosInstance from "@/lib/api-auth";
import Swal from "sweetalert2"
import {LoadIndicator} from "@/lib/load-indicator";
import router from "@/router";

export default {
  name: 'Logs',
  data() {
    return {
      currentPage: 0,
      itemsPerPage: 10,
      totalPage: 0,
      keyword: '',
      paginationCurrentNumber: [1,2,3],
      dataList: [],
    }
  },
  methods: {
    changePage(page) {
      this.currentPage = page
      this.getData()
    },
    onNextPagination() {
      if (this.paginationCurrentNumber.length > 2 && this.paginationCurrentNumber[2] != this.totalPage) {
        const tempArray = [this.paginationCurrentNumber[0] + 1, this.paginationCurrentNumber[1] + 1, this.paginationCurrentNumber[2] + 1]
        this.paginationCurrentNumber = tempArray
      }
    },
    onPrevPagination() {
      if (this.paginationCurrentNumber.length > 2 && this.paginationCurrentNumber[0] != 1) {
        const tempArray = [this.paginationCurrentNumber[0] - 1, this.paginationCurrentNumber[1] - 1, this.paginationCurrentNumber[2] - 1]
        this.paginationCurrentNumber = tempArray
      }
    },
    getData() {
      const data = {
        page: this.currentPage,
        size: this.itemsPerPage,
        search: this.keyword
      }

      axiosInstance.post('/base/log', data)
          .then((response) => {
            this.dataList = response.data.data.data
            this.totalPage = response.data.data.totalPages
            if (this.totalPage == 1) {
              this.paginationCurrentNumber = [1]
            } else if (this.totalPage == 2) {
              this.paginationCurrentNumber = [1,2]
            }
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
