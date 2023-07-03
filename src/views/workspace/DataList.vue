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
                    <CCol md="3">
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
                @keyup.enter="getData"
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
            <CFormSelect aria-label="Default select example" :value="itemsPerPage" @input="itemsPerPage = $event.target.value; getData()">
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
              <CTableHeaderCell class="text-center">Material</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Manufacturer</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Description</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Assignee</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Noun Modifier</CTableHeaderCell>
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
                <div>{{ item.dataId }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div v-if="item.issuer">{{ item.issuer }}</div>
                <div v-else>Not defined</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.description }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div v-if="item.assignee">{{ item.assignee }}</div>
                <div v-else>Not assigned</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.typeId }}</div>
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
          <CCardHeader>Material Master</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="5">
                <CRow>
                  <CCol>
                    <CButton  color="primary" disabled>
                      Auto Parse
                    </CButton>
                  </CCol>
                </CRow>
                <br />
                <CCard>
                  <CCardHeader>
                    <CRow>
                      <CCol md="9">
                        <strong>Material - {{selectedData.dataId}}</strong>
                      </CCol>
                      <CCol md="3">
                        <div v-if="selectedData.status == 'UPLOADED'">
                          <CBadge color="primary" shape="rounded-pill"> {{ selectedData.status }}</CBadge>
                        </div>
                        <div v-else-if="selectedData.status == 'ASSIGNED'">
                          <CBadge color="secondary" shape="rounded-pill"> {{ selectedData.status }}</CBadge>
                        </div>
                        <div v-else-if="selectedData.status == 'SUBMITTED'">
                          <CBadge color="warning" shape="rounded-pill"> {{ selectedData.status }}</CBadge>
                        </div>
                        <div v-else>
                          <CBadge color="success" shape="rounded-pill"> {{ selectedData.status }}</CBadge>
                        </div>
                      </CCol>
                    </CRow>
                  </CCardHeader>
                  <CListGroup flush>
                    <CListGroupItem>
                      <CRow>
                        <CCol md="12">
                          <CFormInput
                              v-model="manufacturer"
                              type="text"
                              label="Manufacturer"
                          />
                        </CCol>
                      </CRow>
                    </CListGroupItem>
                    <CListGroupItem><strong>Description:</strong><p @mouseup="handleSelect">{{selectedData.description}}</p></CListGroupItem>
                    <CListGroupItem>
                      <CRow>
                        <CCol md="3">
                          <strong>PO Text:</strong>
                        </CCol>
                        <CCol md="9">
                          <CFormSwitch
                              id="formSwitchCheckDefault"
                              :label="autoCopyEnabled ? 'auto-copy enabled' : 'auto-copy disabled'"
                              @input="autoCopyEnabled = !autoCopyEnabled"
                              v-model="autoCopyEnabled"
                          />
                        </CCol>
                      </CRow>
                      <CCard color="light">
                        <CCardBody>
                          <div class="text-container">
                            <p @mouseup="handleSelect">{{selectedData.detail}}</p>
                          </div>
                        </CCardBody>
                      </CCard>
                      <br />
                    </CListGroupItem>
                    <CListGroupItem><strong>Noun Modifier: </strong>{{ activeFormType.typeId }}</CListGroupItem>
                    <CListGroupItem>
                      <CRow>
                        <CCol md="12">
                          <CFormInput
                              v-model="linkReference"
                              type="text"
                              label="Link Reference"
                          />
                        </CCol>
                      </CRow>
                    </CListGroupItem>
                  </CListGroup>
                </CCard>
              </CCol>
              <CCol md="7">
                <CRow>
                  <CCol md="9"></CCol>
                  <CCol md="3">
                    <CRow>
                      <CButton  color="primary" @click="nextData">
                        Next Data  >>
                      </CButton>
                    </CRow>
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6" v-for="(item, index) in dataFormList">
                    <CFormInput
                        v-model="dataDetail[item.key]"
                        :label="(index+1) + '-' + item.tagName"
                        placeholder="Input data..."
                        type="text"
                    />
                    <br />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CButton  color="secondary" @click="saveAsDraft" :disabled="selectedData.status != 'ASSIGNED'">
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
            <CCol md="3"></CCol>
            <CCol md="3">
              <CButton @click="exportToExcel(true)" color="primary" variant="outline">Horizontal
              </CButton>
            </CCol>
            <CCol md="3">
              <CButton @click="exportToExcel(false)" color="primary" variant="outline">Vertical
              </CButton>
            </CCol>
            <CCol md="3"></CCol>
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
      manufacturer: '',
      linkReference: '',
      showModal: false,
      showModalView: false,
      showModalDownload: false,
      dataList: [],
      file: null,
      issuer: '',
      switchValue: false,
      comment: '',
      keyword: '',
      dataDetail: {},
      dataFormList: [],
      activeFormType: {}
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
    handleFileChange(event) {
      this.file = event.target.files[0]
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
    getData() {
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

      axiosInstance.get('/type/' + this.dataList[index].typeId)
          .then((response) => {
            this.activeFormType = response.data.data
            this.dataFormList = response.data.data.attributes
            if (this.dataList[index].jsonData) {
              this.dataDetail = this.dataList[index].jsonData
            } else {
              this.dataDetail = response.data.data.jsonFormat
            }
          })

      // this.selectedIndex = index
      // this.selectedData = this.dataList[index]
      // const jsonData = this.selectedData.jsonData
      // this.manufacturer = this.selectedData.issuer
      // this.linkReference = this.selectedData.reference
      // if (jsonData) {
      //   this.dataDetail = jsonData
      // }
      this.$refs.cardComponent.scrollIntoView({ behavior: 'smooth' });
    },
    nextData() {
      this.clearData()
      if (this.selectedIndex + 1 >= this.dataList.length) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No more data!',
        })
      } else {
        this.selectedIndex = this.selectedIndex + 1
        this.selectedData = this.dataList[this.selectedIndex]

        axiosInstance.get('/type/' + this.dataList[this.selectedIndex].typeId)
            .then((response) => {
              this.dataFormList = response.data.data.attributes
              if (this.dataList[this.selectedIndex].jsonData) {
                this.dataDetail = this.dataList[this.selectedIndex].jsonData
              } else {
                this.dataDetail = response.data.data.jsonFormat
              }
            })

        // const jsonData = this.selectedData.jsonData
        // if (jsonData) {
        //   this.dataDetail = jsonData
        // }
      }
    },
    handleSelect() {
      const text = window.getSelection().toString()
      if (this.autoCopyEnabled && text != '') {
        this.selectedText = text
        this.showModal = true
      }
    },
    putToForm(key) {
      this.dataDetail[key] = this.selectedText
      this.showModal = false
    },
    isAdmin() {
      return localStorage.getItem('role') === 'ADMIN'
    },
    isStaff() {
      return localStorage.getItem('role') === 'STAFF'
    },
    saveAsDraft() {
      const data = {
        dataId: this.selectedData.dataId,
        issuer: this.selectedData.issuer,
        jsonData: this.dataDetail,
        linkReference: this.linkReference
      }

      axiosInstance
          .post('/base/draft', data)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Data saved as draft!',
            })
            this.getData()
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
      const data = {
        dataId: this.selectedData.dataId,
        issuer: this.manufacturer,
        jsonData: this.dataDetail,
        linkReference: this.linkReference
      }

      axiosInstance
          .post('/base/submit', data)
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
      const excludeFields = ['detail', 'status', 'assignee', 'comment', 'uploadedBy', 'uploadedAt', 'submittedBy', 'submittedAt', 'checkedBy', 'checkedAt']

      return json.map(item => {
        const modifiedItem = {
          Material: item.dataId,
          Manufacturer: item.issuer,
          Description: item.description,
          // PoText: item.detail,
          Reference : item.reference,
          ...item.jsonData
        };
        excludeFields.forEach(field => delete modifiedItem[field]);
        Object.entries(this.tagName).forEach(([key, value]) => {
          if (modifiedItem[key]) {
            modifiedItem[value] = modifiedItem[key];
            delete modifiedItem[key];
          }
        });
        return modifiedItem;
      });

    },
    modifyJSONDataTypeB(json) {
      return json.map(item => {
        const transformedItems = Object.keys(item.jsonData).map(key => ({
          Material: item.dataId,
          Manufacturer: item.issuer,
          Description: item.description,
          PoText: item.detail,
          Reference : item.reference,
          Attribute: this.tagName[key],
          Value: item.jsonData[key]
        }));

        return transformedItems;
      }).flat();
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
  },
}
</script>

<style>
.text-container {
  white-space: pre-line;
}
</style>
