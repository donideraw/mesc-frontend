<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>Material Master</CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md="3">
            <CInputGroup class="mb-3">
              <CInputGroupText id="basic-addon1">Search</CInputGroupText>
              <CFormInput
                  v-model="keyword"
                  type="text"
                  @keyup.enter="getData(false)"
              />
            </CInputGroup>
          </CCol>
          <CCol md="7">
          </CCol>
          <CCol md="2">
            <CFormSelect aria-label="Default select example" :value="itemsPerPage" @input="itemsPerPage = $event.target.value; getData(false)">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CTable align="middle" class="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell class="text-center">Material</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Description</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Part Number</CTableHeaderCell>
              <CTableHeaderCell class="text-center">PO Text</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="(item, index) in dataList" :key="item.material">
              <CTableDataCell class="text-center">
                <div>{{ item.material }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.description }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.partNumber }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.poText }}</div>
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
  </div>
</template>

<script>
import axiosInstance from "@/lib/api-auth";
import Swal from "sweetalert2";
import router from "@/router";
import {LoadIndicator} from "@/lib/load-indicator";

export default {
  name: 'Material Master',
  data() {
    return {
      currentPage: 0,
      itemsPerPage: 10,
      totalPage: 0,
      paginationCurrentNumber: [1,2,3],
      keyword: '',
      dataList: []
    }
  },
  methods: {
    changePage(page) {
      this.currentPage = page
      this.getData(true)
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
    getData(isFromPage) {
      if (!isFromPage) {
        this.currentPage = 0
        this.paginationCurrentNumber = [1,2,3]
      }
      const data = {
        page: this.currentPage,
        size: this.itemsPerPage,
        search: this.keyword
      }

      axiosInstance.post('/material', data)
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
      this.getData(false)
      Swal.close()
    }
  },
}

</script>
