import request from '@/utils/request-api'

export default {
  getConfig() {
    return request({
      url: '/api/email-config/query',
      method: 'get'
    })
  },

  getConfigDetails(code) {
    return request({
      url: '/api/email-config/query-config/' + code,
      method: 'get'
    })
  },
  update(data) {
    return request({
      url: '/api/email-config/update',
      method: 'put',
      data
    })
  }
}
