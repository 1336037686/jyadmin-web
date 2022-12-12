import request from '@/utils/request-api'

export default {
  getSystemInfo() {
    return request({
      url: '/api/server-performance/query/system-info',
      method: 'get'
    })
  },
  getCpuInfo() {
    return request({
      url: '/api/server-performance/query/cpu-info',
      method: 'get'
    })
  },
  getMemoryInfo() {
    return request({
      url: '/api/server-performance/query/memory-info',
      method: 'get'
    })
  },
  getJvmInfo() {
    return request({
      url: '/api/server-performance/query/jvm-info',
      method: 'get'
    })
  },
  getDiskInfo() {
    return request({
      url: '/api/server-performance/query/disk-info',
      method: 'get'
    })
  },
  getNetworkInfo() {
    return request({
      url: '/api/server-performance/query/network-info',
      method: 'get'
    })
  }
}
