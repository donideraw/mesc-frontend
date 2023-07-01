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
            <span class="fs-6 fw-normal">
            (-12.4% <CIcon icon="cil-arrow-bottom"/>)
          </span>
          </template>
          <template #title>Total Task Data</template>
          <template #action>
            <CDropdown placement="bottom-end">
              <CDropdownToggle
                  :caret="false"
                  class="p-0 text-white"
                  color="transparent"
              >
                <CIcon class="text-high-emphasis-inverse" icon="cil-options"/>
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#">Action</CDropdownItem>
                <CDropdownItem href="#">Another action</CDropdownItem>
                <CDropdownItem href="#">Something else here</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </template>
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
                  data: [68, 59, 84, 84, 51, 55, 40],
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
            <span class="fs-6 fw-normal">
            (-12.4% <CIcon icon="cil-arrow-bottom"/>)
          </span>
          </template>
          <template #title>Assigned To You</template>
          <template #action>
            <CDropdown placement="bottom-end">
              <CDropdownToggle
                  :caret="false"
                  class="p-0 text-white"
                  color="transparent"
              >
                <CIcon class="text-high-emphasis-inverse" icon="cil-options"/>
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#">Action</CDropdownItem>
                <CDropdownItem href="#">Another action</CDropdownItem>
                <CDropdownItem href="#">Something else here</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </template>
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
                  data: [68, 59, 84, 84, 51, 55, 40],
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
            <span class="fs-6 fw-normal">
            (-12.4% <CIcon icon="cil-arrow-bottom"/>)
          </span>
          </template>
          <template #title>Total Completed Task</template>
          <template #action>
            <CDropdown placement="bottom-end">
              <CDropdownToggle
                  :caret="false"
                  class="p-0 text-white"
                  color="transparent"
              >
                <CIcon class="text-high-emphasis-inverse" icon="cil-options"/>
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#">Action</CDropdownItem>
                <CDropdownItem href="#">Another action</CDropdownItem>
                <CDropdownItem href="#">Something else here</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </template>
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
                  data: [68, 59, 84, 84, 51, 55, 40],
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
      dashboardData: {}
    }
  },
  methods: {
    getDashboardData() {
      axiosInstance.get('/base/dashboard')
          .then((response) => {
            console.log(response.data)
            this.dashboardData = response.data.data
          })
    }
  },
  beforeMount() {
    this.name = localStorage.getItem('name')
    this.getDashboardData()
  }
}
</script>
