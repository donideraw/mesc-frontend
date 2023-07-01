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
              <CButton color="primary" class="float-end" @click="exportToExcel">
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
              <CTableHeaderCell class="text-center">Date Uploaded</CTableHeaderCell>
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
                <div>{{ formatDate(item.uploadedAt) }}</div>
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
          <CCardHeader>Material Master - Spareparts</CCardHeader>
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
                        <strong>Material - {{selectedData.dataId}} -</strong>
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
                    <CListGroupItem><strong>Old Material:</strong> -</CListGroupItem>
                    <CListGroupItem><strong>Description:</strong><p @mouseup="handleSelect">{{selectedData.description}}</p></CListGroupItem>
                    <CListGroupItem><strong>MPN:</strong> </CListGroupItem>
                    <CListGroupItem>
                      <strong>PO Text:</strong>
                      <br /><br />
                      <CCard color="light">
                        <CCardBody>
                          <div class="text-container">
                            <p @mouseup="handleSelect">{{selectedData.detail}}</p>
                          </div>
                        </CCardBody>
                      </CCard>
                      <br />
                    </CListGroupItem>
                    <CListGroupItem><strong>Noun Modif:</strong> </CListGroupItem>
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
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.mescNumber"
                        label="1-MESC-NUMBER"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.mescShortDesc"
                        label="2-MESC-SHORT-DESC"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.partName"
                        label="3-PART-NAME"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.mpn"
                        label="4-MPN"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.mfr"
                        label="5-MFR"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.dimensiRatingPart"
                        label="6-DIMENSI-RATING-PART"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.materialPart"
                        label="7-MATERIAL-PART"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.partFor"
                        label="8-PART-FOR"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqModel"
                        label="9-EQ-MODEL"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.assemblyLoc"
                        label="10-ASSEMBLY-LOC"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqSizeDimension"
                        label="11-EQ-SIZE-DIMENSION"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqMaterial"
                        label="12-EQ-MATERIAL"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqSerialNum"
                        label="13-EQ-SERIAL-NUM"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqPositionNum"
                        label="14-EQ-POSITION-NUM"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqDwgNum"
                        label="15-EQ-DWG-NUM"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.mfrOcmPartNum"
                        label="16-MFR-OCM-PART-NUM"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.mfrOcm"
                        label="17-MFR-OCM"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqPtmnDwgNum"
                        label="18-EQ-PTMN-DWG-NUM"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqProjNum"
                        label="19-EQ-PROJ-NUM"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqOrderNumber"
                        label="20-EQ-ORDER NUMBER"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqTagNum"
                        label="21-EQ-TAG-NUM"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.eqDocNum"
                        label="22-EQ-DOC-NUM"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.buildYear"
                        label="23-BUILD-YEAR"
                        type="text"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormInput
                        v-model="dataDetail.shippingParticularCode"
                        label="24-SHIPPING-PARTICULAR-CODE"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="12">
                    <CFormInput
                        v-model="dataDetail.other"
                        label="25-OTHER"
                        type="text"
                    />
                  </CCol>
                </CRow>
                <br />
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
          <strong>Material - {{selectedData.dataId}} -</strong>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.mescNumber"
                  label="1-MESC-NUMBER"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.mescShortDesc"
                  label="2-MESC-SHORT-DESC"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.partName"
                  label="3-PART-NAME"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.mpn"
                  label="4-MPN"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.mfr"
                  label="5-MFR"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.dimensiRatingPart"
                  label="6-DIMENSI-RATING-PART"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.materialPart"
                  label="7-MATERIAL-PART"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.partFor"
                  label="8-PART-FOR"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqModel"
                  label="9-EQ-MODEL"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.assemblyLoc"
                  label="10-ASSEMBLY-LOC"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqSizeDimension"
                  label="11-EQ-SIZE-DIMENSION"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqMaterial"
                  label="12-EQ-MATERIAL"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqSerialNum"
                  label="13-EQ-SERIAL-NUM"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqPositionNum"
                  label="14-EQ-POSITION-NUM"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqDwgNum"
                  label="15-EQ-DWG-NUM"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.mfrOcmPartNum"
                  label="16-MFR-OCM-PART-NUM"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.mfrOcm"
                  label="17-MFR-OCM"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqPtmnDwgNum"
                  label="18-EQ-PTMN-DWG-NUM"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqProjNum"
                  label="19-EQ-PROJ-NUM"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqOrderNumber"
                  label="20-EQ-ORDER NUMBER"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqTagNum"
                  label="21-EQ-TAG-NUM"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.eqDocNum"
                  label="22-EQ-DOC-NUM"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.buildYear"
                  label="23-BUILD-YEAR"
                  type="text"
              />
            </CCol>
            <CCol md="6">
              <CFormInput
                  v-model="selectedData.jsonData.shippingParticularCode"
                  label="24-SHIPPING-PARTICULAR-CODE"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="12">
              <CFormInput
                  v-model="selectedData.jsonData.other"
                  label="25-OTHER"
                  type="text"
              />
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol md="12">
              <CFormInput
                  v-model="comment"
                  label="Comment"
                  type="text"
              />
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
      <CModal alignment="center" :visible="showModal" @close="() => { showModal = false }">
        <CModalHeader>
          <CModalTitle>Add "{{selectedText}}" to :</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CButtonGroup role="group" aria-label="Basic example">
              <CButton @click="putToForm('mescNumber')" color="primary" variant="outline">1</CButton>
              <CButton @click="putToForm('mescShortDesc')" color="primary" variant="outline">2</CButton>
              <CButton @click="putToForm('partName')" color="primary" variant="outline">3</CButton>
              <CButton @click="putToForm('mpn')" color="primary" variant="outline">4</CButton>
              <CButton @click="putToForm('mfr')" color="primary" variant="outline">5</CButton>
              <CButton @click="putToForm('dimensiRatingPart')" color="primary" variant="outline">6</CButton>
              <CButton @click="putToForm('materialPart')" color="primary" variant="outline">7</CButton>
              <CButton @click="putToForm('partFor')" color="primary" variant="outline">8</CButton>
              <CButton @click="putToForm('eqModel')" color="primary" variant="outline">9</CButton>
            </CButtonGroup>
          </CRow>
          <br />
          <CRow>
            <CButtonGroup role="group" aria-label="Basic example">
              <CButton @click="putToForm('assemblyLoc')" color="primary" variant="outline">10</CButton>
              <CButton @click="putToForm('eqSizeDimension')" color="primary" variant="outline">11</CButton>
              <CButton @click="putToForm('eqMaterial')" color="primary" variant="outline">12</CButton>
              <CButton @click="putToForm('eqSerialNum')" color="primary" variant="outline">13</CButton>
              <CButton @click="putToForm('eqPositionNum')" color="primary" variant="outline">14</CButton>
              <CButton @click="putToForm('eqDwgNum')" color="primary" variant="outline">15</CButton>
              <CButton @click="putToForm('mfrOcmPartNum')" color="primary" variant="outline">16</CButton>
              <CButton @click="putToForm('mfrOcm')" color="primary" variant="outline">17</CButton>
            </CButtonGroup>
          </CRow>
          <br />
          <CRow>
            <CButtonGroup role="group" aria-label="Basic example">
              <CButton @click="putToForm('eqPtmnDwgNum')" color="primary" variant="outline">18</CButton>
              <CButton @click="putToForm('eqProjNum')" color="primary" variant="outline">19</CButton>
              <CButton @click="putToForm('eqOrderNumber')" color="primary" variant="outline">20</CButton>
              <CButton @click="putToForm('eqTagNum')" color="primary" variant="outline">21</CButton>
              <CButton @click="putToForm('eqDocNum')" color="primary" variant="outline">22</CButton>
              <CButton @click="putToForm('buildYear')" color="primary" variant="outline">23</CButton>
              <CButton @click="putToForm('shippingParticularCode')" color="primary" variant="outline">24</CButton>
              <CButton @click="putToForm('other')" color="primary" variant="outline">25</CButton>
            </CButtonGroup>
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
      itemsPerPage: 5,
      totalPage: 0,
      paginationCurrentNumber: [1,2,3],
      selectedIndex: null,
      selectedData: {},
      selectedText: '',
      manufacturer: '',
      linkReference: '',
      showModal: false,
      showModalView: false,
      dataList: [],
      file: null,
      issuer: '',
      switchValue: false,
      comment: '',
      keyword: '',
      dataDetail: {
        mescNumber: '',
        mescShortDesc: '',
        partName: '',
        mpn: '',
        mfr: '',
        dimensiRatingPart: '',
        materialPart: '',
        partFor: '',
        eqModel: '',
        assemblyLoc: '',
        eqSizeDimension: '',
        eqMaterial: '',
        eqSerialNum: '',
        eqPositionNum: '',
        eqDwgNum: '',
        mfrOcmPartNum: '',
        mfrOcm: '',
        eqPtmnDwgNum: '',
        eqProjNum: '',
        eqOrderNumber: '',
        eqTagNum: '',
        eqDocNum: '',
        buildYear: '',
        shippingParticularCode: '',
        other: ''
      },
      tagName: {
        mescNumber: '1-MESC-NUMBER',
        mescShortDesc: '2-MESC-SHORT-DESC',
        partName: '3-PART-NAME',
        mpn: '4-MPN',
        mfr: '5-MFR',
        dimensiRatingPart: '6-DIMENSI-RATING-PART',
        materialPart: '7-MATERIAL-PART',
        partFor: '8-PART-FOR',
        eqModel: '9-EQ-MODEL',
        assemblyLoc: '10-ASSEMBLY-LOC',
        eqSizeDimension: '11-EQ-SIZE-DIMENSION',
        eqMaterial: '12-EQ-MATERIAL',
        eqSerialNum: '13-EQ-SERIAL-NUM',
        eqPositionNum: '14-EQ-POSITION-NUM',
        eqDwgNum: '15-EQ-DWG-NUM',
        mfrOcmPartNum: '16-MFR-OCM-PART-NUM',
        mfrOcm: '17-MFR-OCM',
        eqPtmnDwgNum: '18-EQ-PTMN-DWG-NUM',
        eqProjNum: '19-EQ-PROJ-NUM',
        eqOrderNumber: '20-EQ-ORDER-NUMBER',
        eqTagNum: '21-EQ-TAG-NUM',
        eqDocNum: '22-EQ-DOC-NUM',
        buildYear: '23-BUILD-YEAR',
        shippingParticularCode: '24-SHIPPING-PARTICULAR-CODE',
        other: '25-OTHER'
      },
    }
  },
  methods: {
    handleSwitchChange() {
      this.switchValue = !this.switchValue
    },
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
    },
    expandData(index) {
      this.clearData()
      this.selectedIndex = index
      this.selectedData = this.dataList[index]
      const jsonData = this.selectedData.jsonData
      this.manufacturer = this.selectedData.issuer
      this.linkReference = this.selectedData.reference
      if (jsonData) {
        this.dataDetail = jsonData
      }
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
        const jsonData = this.selectedData.jsonData
        if (jsonData) {
          this.dataDetail = jsonData
        }
      }
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      const date = new Date(dateString);
      return date.toLocaleString('en-US', options);
    },
    handleSelect() {
      const text = window.getSelection().toString()
      if (text != '') {
        this.selectedText = text
        this.showModal = true
      }
    },
    putToForm(key) {
      this.dataDetail[key] = this.selectedText
      this.showModal = false
      console.log(this.dataDetail.partFor)
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
    clearData() {
      this.dataDetail = {
        mescNumber: '',
        mescShortDesc: '',
        partName: '',
        mpn: '',
        mfr: '',
        dimensiRatingPart: '',
        materialPart: '',
        partFor: '',
        eqModel: '',
        assemblyLoc: '',
        eqSizeDimension: '',
        eqMaterial: '',
        eqSerialNum: '',
        eqPositionNum: '',
        eqDwgNum: '',
        mfrOcmPartNum: '',
        mfrOcm: '',
        eqPtmnDwgNum: '',
        eqProjNum: '',
        eqOrderNumber: '',
        eqTagNum: '',
        eqDocNum: '',
        buildYear: '',
        shippingParticularCode: '',
        other: ''
      }
    },
    exportToExcel() {
      const pageSize = 6000; // Number of rows per page/chunk
      let page = 0; // Current page number

      LoadIndicator("Downloading data...");

      const workbook = XLSX.utils.book_new(); // Create the workbook outside the loop

      const exportPage = () => {
        axiosInstance.post('/base', {
          page: page,
          size: pageSize,
          search: ''
        })
            .then((response) => {
              const worksheet = XLSX.utils.json_to_sheet(this.modifyJSONDataTypeB(response.data.data.data));
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
              const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

              this.downloadExcelFile(excelBuffer, `Report - Page ${page + 1}.xlsx`);

              if (page < response.data.data.totalPages-1) {
                page++;
                exportPage(); // Export next page
              } else {
                Swal.close();
              }
            })
            .catch((error) => {
              // Handle error
              console.log(error)
              Swal.close();
            });
      };

      exportPage(); // Start exporting the first page
    },
    // exportToExcel() {
    //   LoadIndicator("Downloading data...")
    //
    //   axiosInstance.get('/base')
    //       .then((response) => {
    //         const worksheet = XLSX.utils.json_to_sheet(this.modifyJSONDataTypeB(response.data.data));
    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    //         const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //
    //         this.downloadExcelFile(excelBuffer, 'Report - ' + new Date().toLocaleDateString() + '.xlsx');
    //         Swal.close()
    //       })
    // },
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
  }
}
</script>

<style>
.text-container {
  white-space: pre-line;
}
</style>
