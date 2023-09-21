<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>Task List</CCardHeader>
      <CCardBody>
        <div v-if="isAdmin()">
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
          <br/>
        </div>
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
            <div v-if="isAdmin()">
              <CButton color="primary" class="float-end" @click="() => { showModalDownload = true }">
                <CIcon icon="cil-cloud-download" />
              </CButton>
            </div>
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
              <CTableHeaderCell class="text-center">No</CTableHeaderCell>
              <CTableHeaderCell class="text-center">EquipmentId</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Category</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Description</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Catalog Profile</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Status</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="(item, index) in dataList" :key="item.id">
              <CTableDataCell class="text-center">
                <div>{{ (currentPage*itemsPerPage) + index + 1 }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.equipmentId }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.category }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.description }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.typeId }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div v-if="item.status == 'DRAFT'">
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
                <div v-if="isStaff()">
                  <CButton color="primary" @click="expandData(index)">
                    <CIcon icon="cil-pencil" />
                  </CButton>
                </div>
                <div v-else>
                  <CButton color="primary" @click="viewData(index)">
                    <CIcon icon="cil-cursor" />
                  </CButton>
                </div>
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
    <div ref="cardComponent">
      <div v-if="isStaff()">
        <CCard class="mb-4">
          <CCardHeader><strong>Equipment Master</strong></CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="6">
                <CCard>
                  <CCardHeader>
                    <CRow>
                      <CCol md="9">
                        <strong>General Data</strong>
                      </CCol>
                    </CRow>
                  </CCardHeader>
                  <CCard class="border-white">
                    <CCardBody>
                      <CRow class="mb-4">
                        <CCol>
                          <CFormInput
                              v-model="dataForm.equipmentId"
                              type="text"
                              floating-label="Equipment ID:"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-4">
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.description"
                              type="text"
                              floating-label="Description:"
                          />
                        </CCol>
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.identificationNo"
                              type="text"
                              floating-label="Technical ID:"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-4">
                        <CCol md="12">
                          <CFormSelect v-model="catalogProfile" :on-change="onChangeCatalogProfile()">
                            <option value="">Catalog Profile</option>
                            <option
                                v-for="option in dataCatalogProfile"
                                :value="option.typeId"
                                :key="option"
                            >
                              {{ option.typeId }} - {{ option.description }}
                            </option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                      <CRow class="mb-4">
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.weight"
                              type="text"
                              floating-label="Weight:"
                          />
                        </CCol>
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.uom"
                              type="text"
                              floating-label="Unit of Measure:"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-4">
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.size"
                              type="text"
                              floating-label="Size/dimension:"
                          />
                        </CCol>
                        <CCol md="6">
                          <CFormInput
                              v-model="constYearMonth"
                              type="text"
                              floating-label="Conts Year/Month:"
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCard>
                <br/>
                <CCard>
                  <CCardHeader>
                    <CRow>
                      <CCol md="9">
                        <strong>Additional Data</strong>
                      </CCol>
                    </CRow>
                  </CCardHeader>
                  <CCard class="border-white">
                    <CCardBody>
                      <CRow class="mb-4">
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.category"
                              type="text"
                              floating-label="Category:"
                          />
                        </CCol>
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.location"
                              type="text"
                              floating-label="Location:"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-4">
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.drawingNo"
                              type="text"
                              floating-label="Drawing No:"
                          />
                        </CCol>
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.partNo"
                              type="text"
                              floating-label="Manufacture Part No:"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-4">
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.functionalLocation"
                              type="text"
                              floating-label="Functional location:"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-4">
                        <CCol md="12">
                          <CFormInput id="inputGroupFile02" type="file" @change="handleFileChangeReference" label="File Reference"/>
                        </CCol>
                      </CRow>
                      <CRow class="mb-4">
                        <CCol md="10"></CCol>
                        <CCol md="2" class="d-grid gap-2 d-md-flex justify-content-md-end">
                          <CButton class="d-flex" color="primary" @click="uploadFileReference" alignment="right">
                            Upload
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCard>
              </CCol>
              <CCol md="6">
                <CCard>
                  <CCardHeader>
                    <CRow>
                      <CCol md="9">
                        <strong>Organization</strong>
                      </CCol>
                    </CRow>
                  </CCardHeader>
                  <CCard class="border-white">
                    <CCardBody>
                      <CRow class="mb-4">
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.manufacturer"
                              type="text"
                              floating-label="Manufacturer:"
                          />
                        </CCol>
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.originCountry"
                              type="text"
                              floating-label="Manufacturer country:"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-4">
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.model"
                              type="text"
                              floating-label="Model number:"
                          />
                        </CCol>
                        <CCol md="6">
                          <CFormInput
                              v-model="dataForm.serialNo"
                              type="text"
                              floating-label="Manufacturer Serial No:"
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCard>
                <br/>
                <CCard>
                  <CCardHeader>
                    <CRow>
                      <CCol md="9">
                        <strong>Classification</strong>
                      </CCol>
                    </CRow>
                  </CCardHeader>
                  <CCard class="border-white">
                    <CCardBody>
                      <CRow>
                        <CCol md="6" v-for="item in dataFormList">
                          <CFormInput
                              v-model="dataDetail[item.key]"
                              :floating-label="item.tagName"
                              type="text"
                          />
                          <br />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCard>
                <br/>
                <CRow>
                  <CCol md="3">
                    <CButton  color="secondary" @click="saveAsDraft">
                      Save as Draft
                    </CButton>
                  </CCol>
                  <CCol md="2">
                    <CButton  color="primary"  @click="submitData">
                      Submit
                    </CButton>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </div>
      <CModal size="lg" alignment="center" :visible="showModalView" @close="() => { showModalView = false }">
        <CModalHeader>
          <strong>Material - {{selectedData.dataId}}</strong>
        </CModalHeader>
        <CModalBody>
        </CModalBody>
      </CModal>
      <CModal alignment="center" :visible="showModal" @close="() => { showModal = false }">
        <CModalHeader>
          <CModalTitle>Add "{{selectedText}}" to :</CModalTitle>
        </CModalHeader>
        <CModalBody>
        </CModalBody>
      </CModal>
      <CModal alignment="center" :visible="showModalDownload" @close="() => { showModalDownload = false }">
        <CModalHeader>
          <CModalTitle>Download Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md="8">
              <p>Which format you want to download ?</p>
            </CCol>
          </CRow>
          <CRow>
            <CCol md="2"></CCol>
            <CCol md="8">
              <CButton @click="exportToExcel(true)" color="primary" variant="outline">Equipment Master
              </CButton>
              &nbsp;
<!--            </CCol>-->
<!--            <CCol md="3">-->
              <CButton @click="exportToExcel(false)" color="primary" variant="outline">Classification
              </CButton>
            </CCol>
            <CCol md="2"></CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/lib/api-auth"
import Swal from "sweetalert2"
import {LoadIndicator} from "@/lib/load-indicator"
import router from "@/router"
import * as XLSX from 'xlsx'

export default {
  name: 'Task List',
  data() {
    return {
      currentPage: 0,
      itemsPerPage: 10,
      totalPage: 0,
      autoCopyEnabled: true,
      paginationCurrentNumber: [1,2,3],
      selectedIndex: null,
      selectedData: {},
      selectedText: '',
      catProfSelected: {},

      catalogProfile:'',
      constYearMonth: '',
      dataForm: {
        equipmentId: '',
        description: '',
        typeId: '',
        category: '',
        weight: '',
        size: '',
        identificationNo: '',
        constructionYear: '',
        constructionMonth: '',
        filePath: '',

        uom: '',
        location: '',
        drawingNo: '',
        partNo: '',
        functionalLocation: '',

        manufacturer: '',
        originCountry: '',
        model: '',
        serialNo: '',

        classification: {}

      },

      manufacturer: '',
      linkReference: [''],
      showModal: false,
      showModalView: false,
      showModalDownload: false,
      dataList: [],
      file: null,
      fileReference: null,
      issuer: '',
      switchValue: false,
      comment: '',
      keyword: '',
      dataDetail: {},
      dataFormList: [],
      dataCatalogProfile: [],
      activeFormType: {}
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
    handleFileChange(event) {
      this.file = event.target.files[0]
    },
    handleFileChangeReference(event) {
      this.fileReference = event.target.files[0]
    },
    uploadFile() {
      LoadIndicator('Uploading file...')
      const formData = new FormData();
      formData.append('file', this.file);

      axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            this.getData(false)
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
    uploadFileReference() {
      LoadIndicator('Uploading file...')
      const formData = new FormData();
      formData.append('fileReference', this.fileReference);

      axiosInstance.post('/upload/reference', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            this.dataForm.filePath=response.data.data.filePath
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
    getDataCatalogProfile() {
      const data = {
        page: 0,
        size: 330,
        search: ''
      }

      axiosInstance.post('/type', data)
          .then((response) => {
            this.dataCatalogProfile = response.data.data.data
          })
    },
    onChangeCatalogProfile() {
      if (this.dataCatalogProfile.filter(catProf => catProf.typeId == this.catalogProfile)[0]) {
        const catprof = this.dataCatalogProfile.filter(catProf => catProf.typeId == this.catalogProfile)[0]
        this.dataFormList = catprof.attributes
        this.catProfSelected = catprof
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

      axiosInstance.post('/base', data)
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
    viewData(index) {
      this.clearData()
      this.selectedIndex = index
      this.selectedData = this.dataList[index]
      this.manufacturer = this.selectedData.issuer
      this.showModalView = true
      this.comment = this.selectedData.comment
    },
    expandData(index) {
      this.clearData()
      this.selectedIndex = index
      this.selectedData = this.dataList[index]

      this.dataForm = this.dataList[index]
      this.catalogProfile = this.dataForm.typeId
      this.constYearMonth = this.dataForm.constructionYear + '/' + this.dataForm.constructionMonth

      Object.assign(this.dataDetail, this.dataForm.classification);
      if (this.dataCatalogProfile.filter(catProf => catProf.typeId == this.catalogProfile)[0]) {
        const catprof = this.dataCatalogProfile.filter(catProf => catProf.typeId == this.catalogProfile)[0]
        this.dataFormList = catprof.attributes
        this.catProfSelected = catprof
      }

      this.$refs.cardComponent.scrollIntoView({ behavior: 'smooth' });
    },
    isAdmin() {
      return localStorage.getItem('role') === 'ADMIN'
    },
    isStaff() {
      return localStorage.getItem('role') === 'STAFF'
    },
    saveAsDraft() {

      this.dataForm.classification = this.dataDetail
      this.dataForm.typeId = this.catalogProfile
      this.dataForm.constructionYear = this.constYearMonth.substring(0,4)
      this.dataForm.constructionMonth = this.constYearMonth.substring(5)

      axiosInstance
          .post('/base/draft', this.dataForm)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Data saved as draft!',
            })
            this.getData()
            this.clearForm()
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to save data',
            })
          })
    },
    submitData() {
      this.dataForm.classification = this.dataDetail
      this.dataForm.typeId = this.catalogProfile
      this.dataForm.constructionYear = this.constYearMonth.substring(0,4)
      this.dataForm.constructionMonth = this.constYearMonth.substring(5)

      axiosInstance
          .post('/base/submit', this.dataForm)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Data saved as draft!',
            })
            this.getData()
            this.clearForm()
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to save data',
            })
          })
    },
    requestChangeData() {
      const data = {
        dataId: this.selectedData.dataId,
        comment: this.comment
      }

      axiosInstance
          .post('/base/request', data)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Data submitted successfully!',
            })
            this.getData()
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to submit data',
            })
          })
    },
    verifyData() {
      const data = {
        dataId: this.selectedData.dataId,
        comment: this.comment
      }

      axiosInstance
          .post('/base/approve', data)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Data submitted successfully!',
            })
            this.getData()
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to submit data',
            })
          })
    },
    clearData() {
      this.dataDetail = {}
    },
    clearForm() {
      this.dataDetail = {}
      this.catalogProfile = ''
      this.constYearMonth = ''
      this.dataForm = {
        equipmentId: '',
        description: '',
        typeId: '',
        category: '',
        weight: '',
        size: '',
        identificationNo: '',
        constructionYear: '',
        constructionMonth: '',

        uom: '',
        location: '',
        drawingNo: '',
        partNo: '',
        functionalLocation: '',

        manufacturer: '',
        originCountry: '',
        model: '',
        serialNo: '',

        classification: {}

      }
    },
    exportToExcel(isHorizontal) {
      const pageSize = isHorizontal ? 999999 : 6000; // Number of rows per page/chunk
      let page = 0; // Current page number

      LoadIndicator("Downloading data...");

      const workbook = XLSX.utils.book_new(); // Create the workbook outside the loop

      const exportPage = () => {
        axiosInstance.post('/base/download', {
          page: page,
          size: pageSize,
          search: ''
        })
            .then((response) => {
              const worksheet = XLSX.utils.json_to_sheet(
                  isHorizontal ? this.modifyJSONDataTypeA(response.data.data.data) :
                  this.modifyJSONDataTypeB(response.data.data.data)
              );
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
              const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

              this.downloadExcelFile(excelBuffer, `Report - Page ${page + 1}.xlsx`);

              if (page < response.data.data.totalPages-1) {
                page++;
                exportPage(); // Export next page
              } else {
                Swal.close();
                this.showModalDownload = false
              }
            })
            .catch((error) => {
              // Handle error
              console.log(error)
              Swal.close();
              this.showModalDownload = false
            });
      };

      exportPage(); // Start exporting the first page
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
    modifyJSONDataTypeA(json) {
      const excludeFields = ['classification', 'status', 'comment', 'submittedBy', 'submittedAt']

      return json.map(item => {
        const modifiedItem = {
          "Equipment Tag No": item.equipmentId,
          "Equipment Category": item.category,
          Description: item.description,
          Weight: item.weight,
          "UOM": item.uom,
          "Size/Dimension": item.size,
          "Location": item.location,
          "Functional Location": item.functionalLocation,
          "Technical Identification No": item.identificationNo,
          Manufacturer: item.manufacturer,
          "Model/Type": item.model,
          "Manufacturer Part No": item.partNo,
          "Manufacturer Serial No": item.serialNo,
          "Manufacturer Origin Country": item.originCountry,
          "Construction Year": item.constructionYear,
          "Construction Month": item.constructionMonth,
          ...item.jsonData
        };
        excludeFields.forEach(field => delete modifiedItem[field]);
        return modifiedItem;
      });

    },
    modifyJSONDataTypeB(json) {
      let formattedJson = []

      json.forEach(item => {
        const typeId = item.typeId;
        const classification = item.classification;

        for (const key in classification) {
          const formattedKey = key.replace(/([A-Z])/g, '-$1').toUpperCase();
          formattedJson.push({
            equipment: item.equipmentId,
            "Catalog Profile": typeId,
            char: formattedKey,
            value: classification[key]
          });
        }
      });
      return formattedJson;
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
      this.getDataCatalogProfile()
      this.getData(false)
      Swal.close()
    }
  },
}
</script>

<style>
.text-container {
  white-space: pre-line;
}
</style>
