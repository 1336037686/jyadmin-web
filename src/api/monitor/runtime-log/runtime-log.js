import request from '@/utils/request-api'

export default {
  getLogTree() {
    return request({
      url: '/api/runtimeLog/query',
      method: 'get'
    })
  },
  getLogContent(data) {
    return request({
      url: '/api/runtimeLog/query-log',
      method: 'post',
      data
    })
  }
}
