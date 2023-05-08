import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/log/query',
      method: 'get',
      params: query
    })
  },
  getLoginList(query) {
    return request({
      url: '/api/log/query-login',
      method: 'get',
      params: query
    })
  },
  getActiveList(query) {
    return request({
      url: '/api/log/query-active',
      method: 'get',
      params: query
    })
  },
  getUserLoginList(userId, query) {
    return request({
      url: '/api/log/query-user-login/' + userId,
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
