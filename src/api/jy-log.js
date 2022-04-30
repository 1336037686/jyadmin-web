import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/log/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/log/query/' + id,
      method: 'get'
    })
  },

  remove(data) {
    return request({
      url: '/api/log/remove',
      method: 'delete',
      data
    })
  }
}
