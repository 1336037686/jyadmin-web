<template>
  <el-row>
    <el-col :span="8" style="padding: 10px">
      <el-card shadow="hover" style="height: 400px">
        <div slot="header" class="clearfix">
          <span style="line-height: 30px">系统信息</span>
          <el-button style="float: right;" icon="el-icon-refresh" circle size="mini" @click="getSystemInfo()" />
        </div>
        <div>
          <el-table
            v-loading="systemInfoLoading"
            border
            :show-header="false"
            :empty-text="'暂无数据'"
            :data="systemInfoRecord"
            element-loading-text="加载中，请稍后..."
            element-loading-spinner="el-icon-loading"
            style="width: 100%"
          >
            <el-table-column prop="label" width="150" align="center" />
            <el-table-column prop="value" />
          </el-table>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8" style="padding: 10px">
      <el-card shadow="hover" style="height: 400px">
        <div slot="header" class="clearfix">
          <span style="line-height: 30px">CPU信息</span>
          <span style="float: right;">
            <el-button icon="el-icon-s-grid" circle size="mini" @click="cpuInfoShowType = (cpuInfoShowType === 'table' ? 'chart' : 'table')" />
            <el-button icon="el-icon-refresh" circle size="mini" @click="getCpuInfo()" />
          </span>
        </div>
        <div v-show="cpuInfoShowType === 'table'">
          <el-scrollbar style="height:300px" wrap-style="overflow-x:hidden;">
            <el-table
              v-loading="cpuInfoLoading"
              border
              :show-header="false"
              :empty-text="'暂无数据'"
              :data="cpuInfoRecord"
              element-loading-text="加载中，请稍后..."
              element-loading-spinner="el-icon-loading"
              style="width: 100%"
            >
              <el-table-column prop="label" width="180" align="center" />
              <el-table-column prop="value" show-overflow-tooltip />
            </el-table>
          </el-scrollbar>
        </div>
        <div v-show="cpuInfoShowType === 'chart'">
          <div id="cpuInfo" style="height: 300px;width: 500px">1</div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8" style="padding: 10px">
      <el-card shadow="hover" style="height: 400px">
        <div slot="header" class="clearfix">
          <span style="line-height: 30px">内存信息</span>
          <span style="float: right;">
            <el-button icon="el-icon-s-grid" circle size="mini" @click="memoryInfoShowType = (memoryInfoShowType === 'table' ? 'chart' : 'table')" />
            <el-button icon="el-icon-refresh" circle size="mini" @click="getMemoryInfo()" />
          </span>
        </div>
        <div v-show="memoryInfoShowType === 'table'">
          <el-scrollbar style="height:300px" wrap-style="overflow-x:hidden;">
            <el-table
              v-loading="memoryInfoLoading"
              border
              :show-header="false"
              :empty-text="'暂无数据'"
              :data="memoryInfoRecord"
              element-loading-text="加载中，请稍后..."
              element-loading-spinner="el-icon-loading"
              style="width: 100%"
            >
              <el-table-column prop="label" width="180" align="center" />
              <el-table-column prop="value" show-overflow-tooltip />
            </el-table>
          </el-scrollbar>
        </div>
        <div v-show="memoryInfoShowType === 'chart'">
          <div id="memoryInfo" style="height: 300px;width: 500px">1</div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8" style="padding: 10px">
      <el-card shadow="hover" style="height: 400px">
        <div slot="header" class="clearfix">
          <span style="line-height: 30px">网络信息</span>
          <span style="float: right;">
            <el-button icon="el-icon-refresh" circle size="mini" @click="getNetworkInfo()" />
          </span>
        </div>
        <div>
          <el-scrollbar style="height:300px" wrap-style="overflow-x:hidden;">
            <el-table
              v-loading="networkInfoLoading"
              border
              :empty-text="'暂无数据'"
              :data="networkInfoRecord"
              element-loading-text="加载中，请稍后..."
              element-loading-spinner="el-icon-loading"
              style="width: 100%"
            >
              <el-table-column prop="displayName" label="网卡名称" align="center" show-overflow-tooltip />
              <el-table-column prop="macAddr" label="MAC地址" align="center" show-overflow-tooltip />
              <el-table-column prop="ipv4Addr" label="IPV4地址" align="center" show-overflow-tooltip />
              <el-table-column prop="ipv6Addr" label="IPV6地址" align="center" show-overflow-tooltip />
              <el-table-column prop="speed" label="速率" align="center" show-overflow-tooltip />
            </el-table>
          </el-scrollbar>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8" style="padding: 10px">
      <el-card shadow="hover" style="height: 400px">
        <div slot="header" class="clearfix">
          <span style="line-height: 30px">磁盘信息</span>
          <span style="float: right;">
            <el-button icon="el-icon-refresh" circle size="mini" @click="getDiskInfo()" />
          </span>
        </div>
        <div>
          <el-scrollbar style="height:300px" wrap-style="overflow-x:hidden;">
            <el-table
              v-loading="diskInfoLoading"
              border
              :empty-text="'暂无数据'"
              :data="diskInfoRecord"
              element-loading-text="加载中，请稍后..."
              element-loading-spinner="el-icon-loading"
              style="width: 100%"
            >
              <el-table-column prop="dirName" label="盘符路径" align="center" show-overflow-tooltip />
              <!--              <el-table-column prop="sysTypeName" label="盘符类型" width="100" align="center" show-overflow-tooltip />-->
              <!--              <el-table-column prop="typeName" label="文件类型"  width="100" align="center" show-overflow-tooltip />-->
              <el-table-column prop="total" label="总大小" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ (scope.row.total / 1024 / 1024 / 1024 ).toFixed(2) + ' GB' }}
                </template>
              </el-table-column>
              <el-table-column prop="used" label="已经使用量" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ (scope.row.used / 1024 / 1024 / 1024 ).toFixed(2) + ' GB' }}
                </template>
              </el-table-column>
              <el-table-column prop="free" label="剩余大小" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ (scope.row.free / 1024 / 1024 / 1024 ).toFixed(2) + ' GB' }}
                </template>
              </el-table-column>
              <el-table-column prop="usage" label="资源使用率" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ (scope.row.usage * 100) + ' %' }}
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8" style="padding: 10px">
      <el-card shadow="hover" style="height: 400px">
        <div slot="header" class="clearfix">
          <span style="line-height: 30px">JVM信息</span>
          <span style="float: right;">
            <el-button icon="el-icon-refresh" circle size="mini" @click="getJvmInfo()" />
          </span>
        </div>
        <div>
          <el-scrollbar style="height:300px" wrap-style="overflow-x:hidden;">
            <el-table
              v-loading="jvmInfoLoading"
              border
              :show-header="false"
              :empty-text="'暂无数据'"
              :data="jvmInfoRecord"
              element-loading-text="加载中，请稍后..."
              element-loading-spinner="el-icon-loading"
              style="width: 100%"
            >
              <el-table-column prop="label" width="180" align="center" />
              <el-table-column prop="value" show-overflow-tooltip />
            </el-table>
          </el-scrollbar>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import echarts from 'echarts'
import api from '@/api/monitor/server/jy-server'
export default {
  data() {
    return {
      systemInfo: null,
      systemInfoRecord: [],
      cpuInfo: null,
      cpuInfoRecord: [],
      cpuInfoShowType: 'table',
      memoryInfo: null,
      memoryInfoRecord: [],
      memoryInfoShowType: 'table',
      jvmInfo: null,
      jvmInfoRecord: [],
      jvmInfoShowType: 'table',
      diskInfo: null,
      diskInfoRecord: [],
      networkInfo: null,
      networkInfoRecord: [],
      systemInfoLoading: false,
      cpuInfoLoading: false,
      memoryInfoLoading: false,
      networkInfoLoading: false,
      diskInfoLoading: false,
      jvmInfoLoading: false
    }
  },
  mounted() {
    this.getSystemInfo()
    this.getCpuInfo()
    this.getMemoryInfo()
    this.getJvmInfo()
    this.getDiskInfo()
    this.getNetworkInfo()
  },
  methods: {
    getSystemInfo() {
      this.systemInfoLoading = true
      api.getSystemInfo().then(res => {
        this.systemInfoLoading = false
        this.systemInfo = res.data
        this.systemInfoRecord = []
        this.systemInfoRecord.push({ label: '服务器名称', value: res.data.computerName })
        this.systemInfoRecord.push({ label: '服务器IP', value: res.data.computerIp })
        this.systemInfoRecord.push({ label: '操作系统', value: res.data.osName })
        this.systemInfoRecord.push({ label: '系统架构', value: res.data.osArch })
        this.systemInfoRecord.push({ label: '项目路径', value: res.data.userDir })
      }).catch(e => {
        this.systemInfoLoading = false
      })
    },
    getCpuInfo() {
      this.cpuInfoLoading = true
      api.getCpuInfo().then(res => {
        this.cpuInfoLoading = false
        this.cpuInfo = res.data
        this.cpuInfoRecord = []
        this.cpuInfoRecord.push({ label: 'CPU型号信息', value: res.data.cpuModel })
        this.cpuInfoRecord.push({ label: 'CPU核心数', value: res.data.cpuNum })
        this.cpuInfoRecord.push({ label: 'CPU当前使用率（%）', value: res.data.used })
        this.cpuInfoRecord.push({ label: 'CPU当前空闲率（%）', value: res.data.free })
        this.cpuInfoRecord.push({ label: 'CPU总使用率', value: res.data.toTal })
        this.cpuInfoRecord.push({ label: 'CPU系统使用率（%）', value: res.data.sys })
        this.cpuInfoRecord.push({ label: 'CPU用户使用率（%）', value: res.data.user })
        this.cpuInfoRecord.push({ label: 'CPU当前等待率（%）', value: res.data.wait })
        this.drawCpuInfoChart()
      }).catch(e => {
        this.cpuInfoLoading = false
      })
    },
    drawCpuInfoChart() {
      const chart = echarts.init(document.getElementById('cpuInfo'))
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: 'CPU使用',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            clockwise: false,
            data: [
              {
                value: this.cpuInfo.used,
                name: 'CPU使用率'
              },
              {
                value: this.cpuInfo.free,
                name: 'CPU空闲率'
              }
            ],
            label: {
              normal: {
                textStyle: {
                  color: '#999',
                  fontSize: 14
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 2,
                borderColor: '#ffffff'
              },
              emphasis: {
                borderWidth: 0,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        color: ['#c8efff', '#66bff5'],
        backgroundColor: '#fff'
      }

      chart.setOption(option)
    },
    getMemoryInfo() {
      this.memoryInfoLoading = true
      api.getMemoryInfo().then(res => {
        this.memoryInfoLoading = false
        this.memoryInfo = res.data
        this.memoryInfoRecord = []
        this.memoryInfoRecord.push({ label: '内存总量', value: (res.data.total / 1024 / 1024 / 1024).toFixed(2) + ' GB' })
        this.memoryInfoRecord.push({ label: '已用内存', value: (res.data.used / 1024 / 1024 / 1024).toFixed(2) + ' GB' })
        this.memoryInfoRecord.push({ label: '剩余内存', value: (res.data.free / 1024 / 1024 / 1024).toFixed(2) + ' GB' })
        this.drawMemoryInfoChart()
      }).catch(e => {
        this.memoryInfoLoading = false
      })
    },
    drawMemoryInfoChart() {
      const chart = echarts.init(document.getElementById('memoryInfo'))

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} GB ({d}%)'
        },
        series: [
          {
            name: '内存使用',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            clockwise: false,
            data: [
              {
                value: (this.memoryInfo.used / 1024 / 1024 / 1024).toFixed(2),
                name: '已用内存'
              },
              {
                value: (this.memoryInfo.free / 1024 / 1024 / 1024).toFixed(2),
                name: '剩余内存'
              }
            ],
            label: {
              normal: {
                textStyle: {
                  color: '#999',
                  fontSize: 14
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 2,
                borderColor: '#ffffff'
              },
              emphasis: {
                borderWidth: 0,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        color: ['#c8efff', '#66bff5'],
        backgroundColor: '#fff'
      }

      chart.setOption(option)
    },
    getJvmInfo() {
      this.jvmInfoLoading = true
      api.getJvmInfo().then(res => {
        this.jvmInfoLoading = false
        this.jvmInfo = res.data
        this.jvmInfoRecord = []
        this.jvmInfoRecord.push({ label: 'JVM名称', value: res.data.name })
        this.jvmInfoRecord.push({ label: 'JVM版本', value: res.data.version })
        this.jvmInfoRecord.push({ label: 'JVM厂商', value: res.data.vendor })
        this.jvmInfoRecord.push({ label: 'JDK路径', value: res.data.home })
        this.jvmInfoRecord.push({ label: 'JVM最大内存', value: (res.data.maxMemory / 1024 / 1024).toFixed(2) + ' MB' })
        this.jvmInfoRecord.push({ label: 'JVM空闲内存', value: (res.data.freeMemory / 1024 / 1024).toFixed(2) + ' MB' })
        this.jvmInfoRecord.push({ label: 'JVM已分配内存', value: (res.data.totalMemory / 1024 / 1024).toFixed(2) + ' MB' })
        this.jvmInfoRecord.push({ label: 'JVM最大可用内存', value: (res.data.usableMemory / 1024 / 1024).toFixed(2) + ' MB' })
      }).catch(e => {
        this.jvmInfoLoading = false
      })
    },
    getDiskInfo() {
      this.diskInfoLoading = true
      api.getDiskInfo().then(res => {
        this.diskInfoLoading = false
        this.diskInfo = res.data
        this.diskInfoRecord = res.data
      }).catch(e => {
        this.diskInfoLoading = false
      })
    },
    getNetworkInfo() {
      this.networkInfoLoading = true
      api.getNetworkInfo().then(res => {
        this.networkInfoLoading = false
        this.networkInfo = res.data
        this.networkInfoRecord = res.data
      }).catch(e => {
        this.networkInfoLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
