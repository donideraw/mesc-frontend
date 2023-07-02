<template>
  <div>
    <CRow>
      <CCol md="6"></CCol>
      <h2>Welcome back,&nbsp; {{ name }}!</h2>
    </CRow>
    <br/>
    <CRow>
      <CCol :xs="4">
        <CWidgetStatsA class="mb-4" color="primary">
          <template #value
          >{{dashboardData.totalTask}}
<!--            <span class="fs-6 fw-normal">-->
<!--            (-12.4% <CIcon icon="cil-arrow-bottom"/>)-->
<!--          </span>-->
          </template>
          <template #title>Total Task Data</template>
          <template #chart>
            <CChart
                :data="{
              labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
              ],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: '#321fdb',
                  data: [10, 11, 12, 13, 14, 15, 16],
                },
              ],
            }"
                :options="{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
                y: {
                  min: 30,
                  max: 89,
                  display: false,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
              elements: {
                line: {
                  borderWidth: 1,
                  tension: 0.4,
                },
                point: {
                  radius: 4,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }"
                class="mt-3 mx-3"
                style="height: 70px"
                type="line"
            />
          </template>
        </CWidgetStatsA>
      </CCol>
      <CCol :xs="4">
        <CWidgetStatsA class="mb-4" color="warning">
          <template #value
          >{{dashboardData.totalAssigned}}
          </template>
          <template #title>Assigned To You</template>
          <template #chart>
            <CChart
                :data="{
              labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
              ],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: '#321fdb',
                  data: [0, 0, 0, 0, 0, 0, 0],
                },
              ],
            }"
                :options="{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
                y: {
                  min: 30,
                  max: 89,
                  display: false,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
              elements: {
                line: {
                  borderWidth: 1,
                  tension: 0.4,
                },
                point: {
                  radius: 4,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }"
                class="mt-3 mx-3"
                style="height: 70px"
                type="line"
            />
          </template>
        </CWidgetStatsA>
      </CCol>
      <CCol :xs="4">
        <CWidgetStatsA class="mb-4" color="success">
          <template #value
          >{{dashboardData.totalCompleted}}
<!--            <span class="fs-6 fw-normal">-->
<!--            (-12.4% <CIcon icon="cil-arrow-bottom"/>)-->
<!--          </span>-->
          </template>
          <template #title>Total Completed Task</template>
          <template #chart>
            <CChart
                :data="{
              labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
              ],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: '#321fdb',
                  data: [0, 0, 0, 0, 0, 0, 0],
                },
              ],
            }"
                :options="{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
                y: {
                  min: 30,
                  max: 89,
                  display: false,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
              elements: {
                line: {
                  borderWidth: 1,
                  tension: 0.4,
                },
                point: {
                  radius: 4,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }"
                class="mt-3 mx-3"
                style="height: 70px"
                type="line"
            />
          </template>
        </CWidgetStatsA>
      </CCol>
    </CRow>
    <CRow>
      <CCol md="6">
        <CCard>
          <CCardHeader><strong>To Do</strong></CCardHeader>
          <CCardBody>
            <CTable align="middle" class="mb-0 border" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell class="text-center" color="primary">Material</CTableHeaderCell>
                  <CTableHeaderCell class="text-center" color="primary">Manufacturer</CTableHeaderCell>
                  <CTableHeaderCell class="text-center" color="primary"
                  >Status
                  </CTableHeaderCell
                  >
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="item in todoList" :key="item.dataId">
                  <CTableDataCell class="text-center">
                    <div>{{ item.dataId }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <div>{{ item.issuer }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <div>{{ item.status }}</div>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow></CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md="6">
        <CCard>
          <CCardHeader><strong>Request For Change</strong></CCardHeader>
          <CCardBody>
            <CTable align="middle" class="mb-0 border" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell class="text-center" color="primary">Material</CTableHeaderCell>
                  <CTableHeaderCell class="text-center" color="primary">Manufacturer</CTableHeaderCell>
                  <CTableHeaderCell class="text-center" color="primary"
                  >Status
                  </CTableHeaderCell
                  >
                  <CTableHeaderCell class="text-center" color="primary">Requester</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="item in requestedList" :key="item.dataId">
                  <CTableDataCell class="text-center">
                    <div>{{ item.dataId }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <div>{{ item.issuer }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <div>{{ item.status }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <div>{{ item.checkedBy }}</div>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow></CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import {CChart} from '@coreui/vue-chartjs'
import axiosInstance from "@/lib/api-auth";

export default {
  name: 'Dashboard',
  components: {
    CChart,
  },
  data() {
    return {
      name: '',
      dashboardData: {},
      todoList: [],
      requestedList: []
    }
  },
  methods: {
    getDashboardData() {
      axiosInstance.get('/base/dashboard')
          .then((response) => {
            this.dashboardData = response.data.data
            this.todoList = response.data.data.todo
            this.requestedList = response.data.data.requested
          })
    }
  },
  beforeMount() {
    this.name = localStorage.getItem('name')
    this.getDashboardData()
  }
}
</script>
