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
          <CCol md="7">
            <div v-if="isAdmin()">
              <CButton color="primary" @click="exportToExcel">
                <CIcon icon="cil-cloud-download" />
              </CButton>
            </div>
          </CCol>
        </CRow>
        <CRow class="mb-4">
          <CTable align="middle" class="mb-0 border text-sm-center"  hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell class="text-center" style="width: 100px;" >Item Number</CTableHeaderCell>
                <CTableHeaderCell class="text-center" style="width: 100px;">Component</CTableHeaderCell>
                <CTableHeaderCell class="text-center" style="width: 100px;">Sort</CTableHeaderCell>
                <CTableHeaderCell class="text-center" style="width: 50px;">QTY</CTableHeaderCell>
                <CTableHeaderCell class="text-center" style="width: 70px;">UOM</CTableHeaderCell>
                <CTableHeaderCell class="text-center" style="width: 200px;">Text Line 1</CTableHeaderCell>
                <CTableHeaderCell class="text-center" style="width: 200px;">Text Line 2</CTableHeaderCell>
                <CTableHeaderCell class="text-center" style="width: 70px;">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(item, index) in dataList" :key="item.id">
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].itemNumber"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].component"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].sortString"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].quantity"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].uom"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].textLine1"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="dataList[index].textLine2"
                      type="text"
                      :style="{ fontSize: '10px'}"
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
                      onresize="true"
                      v-model="data.itemNumber"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.component"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.sortString"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.quantity"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.uom"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.textLine1"
                      type="text"
                      :style="{ fontSize: '10px'}"
                  />
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CFormInput
                      v-model="data.textLine2"
                      type="text"
                      :style="{ fontSize: '10px'}"
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
import * as XLSX from "xlsx";

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
      if (this.equipmentId == '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Choose Equipment',
        })
      } else {
        axiosInstance.get('/bill/' + this.equipmentId)
            .then((response) => {
              this.dataList = response.data.data
            })
      }
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
    isAdmin() {
      return localStorage.getItem('role') === 'ADMIN'
    },
    exportToExcel() {
      if (this.equipmentId == '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Choose Equipment',
        })
      } else {
        LoadIndicator("Downloading data...");

        axiosInstance.get('/bill/' + this.equipmentId)
            .then((response) => {
              const worksheet = XLSX.utils.json_to_sheet(
                  this.modifyJSONData(response.data.data)
              );
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
              const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

              this.downloadExcelFile(excelBuffer, `[Bill of Material] - ${this.equipmentId}.xlsx`);

              Swal.close();
            })
            .catch((error) => {
              // Handle error
              console.log(error)
              Swal.close();
            });
      }
    },
    modifyJSONData(json) {
      const excludeFields = ['id', 'plant']

      return json.map(item => {
        const modifiedItem = {
          "Equipment Tag No": item.equipmentId,
          "Item Number": item.itemNumber,
          "Item Category": item.itemCategory,
          Component: item.component,
          Quantity: item.quantity,
          UOM: item.uom,
          "Sort String": item.sortString,
          "Text Line 1": item.textLine1,
          "Text Line 2": item.textLine2,
          "PO Text": item.poText,
          ...item.jsonData
        };
        excludeFields.forEach(field => delete modifiedItem[field]);
        return modifiedItem;
      });

    },
    downloadExcelFile(buffer, fileName) {
      const data = new Blob([buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
