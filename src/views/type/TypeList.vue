<template>
  <CCard class="mb-4">
    <CCardHeader>Type Management</CCardHeader>
    <CCardBody>
      <CRow>
        <CCol md="6">
          <CCard>
            <CCardHeader>Upload Data</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CFormInput id="inputGroupFile01" type="file" @change="handleFileChange"/>
                </CCol>
              </CRow>
              <br/>
              <CRow>
                <CCol md="9"></CCol>
                <CCol md="3">
                  <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton class="d-flex" color="primary" @click="uploadFile" alignment="right">
                      Upload
                    </CButton>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <br />
      <CTable align="middle" class="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell class="text-center">Catalog Profile</CTableHeaderCell>
            <CTableHeaderCell class="text-center">Description</CTableHeaderCell>
            <CTableHeaderCell class="text-center"
            >Action
            </CTableHeaderCell
            >
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="(item, index) in dataList" :key="item.typeId">
            <CTableDataCell class="text-center">
              <div>{{ item.typeId }}</div>
            </CTableDataCell>
            <CTableDataCell class="text-center">
              <div>{{ item.description }}</div>
            </CTableDataCell>
            <CTableDataCell class="text-center">
              <CButton color="primary" @click="viewAttribute(index)">
                View Attribute
              </CButton>
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
  <CModal size="lg" alignment="center" :visible="showModalAttribute" @close="() => { showModalAttribute = false }">
    <CModalHeader>
      <strong>{{ selectedTypeId }}</strong>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol md="6" v-for="item in attributeList">
          <div class="d-grid gap-2">
            <CButton color="primary" shape="rounded-0">{{ item.tagName }}</CButton>
          </div>
          <br />
        </CCol>
      </CRow>
    </CModalBody>
  </CModal>
</template>

<script>
import axiosInstance from "@/lib/api-auth";
import Swal from "sweetalert2"
import {LoadIndicator} from "@/lib/load-indicator";
import router from "@/router";

export default {
  name: 'Type Data',
  data() {
    return {
      currentPage: 0,
      itemsPerPage: 10,
      totalPage: 0,
      paginationCurrentNumber: [1,2,3],
      dataList: [],
      attributeList: [],
      showModalAttribute: false,
      selectedTypeId : '',
      file: null
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
        search: ''
      }

      axiosInstance.post('/type', data)
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
    viewAttribute(index) {
      this.attributeList = this.dataList[index].attributes
      this.showModalAttribute = true
      this.selectedTypeId = this.dataList[index].typeId
    },
    handleFileChange(event) {
      this.file = event.target.files[0]
    },
    uploadFile() {
      LoadIndicator('Uploading file...')
      const formData = new FormData();
      formData.append('file', this.file);

      axiosInstance.post('/upload/type', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            this.getData()
            this.file = null
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'File uploaded success',
            })
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Something bad happen',
            })
          });
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
      this.getData()
      Swal.close()
    }
  }
}
</script>
