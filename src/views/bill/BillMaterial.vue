<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>Bill of Material</CCardHeader>
      <CCardBody>
        <CRow class="mb-4">
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
                  <CCol md="3" class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton class="d-flex" color="primary" @click="uploadFile" alignment="right">
                      Upload
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow class="mb-4">
          <CCol md="3">
            <CFormSelect v-model="equipmentId">
              <option value="">Choose Equipment</option>
              <option
                  v-for="option in equipmentList"
                  :value="option.equipmentId"
                  :key="option"
              >
                {{ option.equipmentId }}
              </option>
            </CFormSelect>
          </CCol>
          <CCol md="2">
            <CButton color="primary" @click="getMaterials">Show</CButton>
          </CCol>
        </CRow>
        <CRow class="mb-4">
          <CTable align="middle" class="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell class="text-center">Item Number</CTableHeaderCell>
                <CTableHeaderCell class="text-center">Component</CTableHeaderCell>
                <CTableHeaderCell class="text-center">Sort String</CTableHeaderCell>
                <CTableHeaderCell class="text-center">Quantity</CTableHeaderCell>
                <CTableHeaderCell class="text-center">UOM</CTableHeaderCell>
                <CTableHeaderCell class="text-center">Text 1</CTableHeaderCell>
                <CTableHeaderCell class="text-center">Text 2</CTableHeaderCell>
                <CTableHeaderCell class="text-center">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(item, index) in dataList" :key="item.id">
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].itemNumber"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].component"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].sortString"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].quantity"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].uom"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].textLine1"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].textLine2"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CButton color="primary" @click="saveData(index)">
                    Save
                  </CButton>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.itemNumber"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.component"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.sortString"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.quantity"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.uom"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.textLine1"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.textLine2"
                      type="text"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CButton color="primary" @click="saveData(null)">
                    Add
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CRow>
      </CCardBody>
    </CCard>
  </div>
  <div>
    <CModal size="lg" alignment="center" :visible="showModal" @close="() => { showModal = false }">
      <CModalHeader>
        <CModalTitle>Bill of Material</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow class="mb-4">
          <CCol md="6">
            <CFormInput
                v-model="equipmentId"
                type="text"
                floating-label="Equipment ID:"
                disabled
            />
          </CCol>
          <CCol md="6">
            <CFormInput
                v-model="data.uom"
                type="text"
                floating-label="Unit of Measure:"
            />
          </CCol>
        </CRow>
        <CRow class="mb-2">
          <CCol md="6">
            <CFormInput
                v-model="data.itemNumber"
                type="text"
                floating-label="Item Number:"
            />
          </CCol>
          <CCol md="6">
            <CFormInput
                v-model="data.itemCategory"
                type="text"
                floating-label="Item Category:"
            />
          </CCol>
        </CRow>
        <CRow class="mb-4">
          <CCol md="6">
            <CFormInput
                v-model="data.component"
                type="text"
                floating-label="Component:"
            />
          </CCol>
          <CCol md="6">
            <CFormInput
                v-model="data.quantity"
                type="text"
                floating-label="Quantity:"
            />
          </CCol>
        </CRow>
        <CRow class="mb-4">
          <CCol md="6">
            <CFormInput
                v-model="data.plant"
                type="text"
                floating-label="Plant:"
            />
          </CCol>
          <CCol md="6">
            <CFormInput
                v-model="data.sortString"
                type="text"
                floating-label="Sort String:"
            />
          </CCol>
        </CRow>
        <CRow class="mb-4">
          <CCol md="6">
            <CFormTextarea
                v-model="data.textLine1"
                type="text"
                floating-label="Text Line 1:"
            />
          </CCol>
          <CCol md="6">
            <CFormTextarea
                v-model="data.textLine2"
                type="text"
                floating-label="Text Line 2:"
            />
          </CCol>
        </CRow>
        <CRow class="mb-4">
          <CCol md="6">
            <CFormTextarea
                v-model="data.poText"
                type="text"
                floating-label="PO Text:"
                rows="3"
            />
          </CCol>
        </CRow>
        <CRow class="mb-4">
          <CCol md="12" class="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton color="primary" @click="saveData()">Save</CButton>
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  </div>
</template>

<script>
import axiosInstance from "@/lib/api-auth"
import Swal from "sweetalert2"
import {LoadIndicator} from "@/lib/load-indicator"
import router from "@/router"
import dataList from "@/views/workspace/DataList.vue";

export default {
  name: 'Bill of Material',
  data() {
    return {
      file: null,
      equipmentList: [],
      equipmentId: '',
      showModal: false,
      dataList: [],
      data: {
        id: null,
        equipmentId: '',
        uom: '',
        itemNumber: '',
        component: '',
        quantity: '',
        sortString: '',
        textLine1: '',
        textLine2: ''
      }
    }
  },
  methods: {
    getAllEquipment() {
      axiosInstance.get('/base')
          .then((response) => {
            this.equipmentList = response.data.data
          })
    },
    getMaterials() {
      axiosInstance.get('/bill/' + this.equipmentId)
          .then((response) => {
            this.dataList = response.data.data
          })
    },
    addNew() {
      this.clearForm()
      this.showModal = true
    },
    showData(dataTable) {
      this.data = dataTable
      this.showModal = true
    },
    saveData(index) {
      if (index != null) {
        this.data.id = this.dataList[index].id
        this.data.uom = this.dataList[index].uom
        this.data.itemNumber = this.dataList[index].itemNumber
        this.data.component = this.dataList[index].component
        this.data.quantity = this.dataList[index].quantity
        this.data.sortString = this.dataList[index].sortString
        this.data.textLine1 = this.dataList[index].textLine1
        this.data.textLine2 = this.dataList[index].textLine2
      }

      this.data.equipmentId = this.equipmentId

      axiosInstance.post('/bill/save', this.data)
          .then(() => {
            this.getMaterials()
            this.clearForm()
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Data added!',
            })
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to save data',
            })
          })
    },
    clearForm() {
      this.data = {
        id: null,
        equipmentId: '',
        plant: '',
        itemNumber: '',
        itemCategory: '',
        component: '',
        quantity: '',
        sortString: '',
        textLine1: '',
        textLine2: '',
        poText: ''
      }
    },
    handleFileChange(event) {
      this.file = event.target.files[0]
    },
    uploadFile() {
      LoadIndicator('Uploading file...')
      const formData = new FormData();
      formData.append('file', this.file);

      axiosInstance.post('/upload/bill', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
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
      this.getAllEquipment()
      Swal.close()
    }
  }
}
</script>
