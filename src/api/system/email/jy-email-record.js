import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/email-record/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/email-record/query/' + id,
      method: 'get'
    })
  },

  remove(data) {
    return request({
      url: '/api/email-record/remove',
      method: 'delete',
      data
    })
  }

}
