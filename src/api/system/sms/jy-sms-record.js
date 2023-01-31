import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/sms-record/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/sms-record/query/' + id,
      method: 'get'
    })
  },

  remove(data) {
    return request({
      url: '/api/sms-record/remove',
      method: 'delete',
      data
    })
  }

}
