import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/user/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/user/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/user/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/user/update',
      method: 'put',
      data
    })
  },

  updatePassword(data) {
    return request({
      url: '/api/user/update/password',
      method: 'put',
      data
    })
  },

  updateUserPassword(data) {
    return request({
      url: '/api/user/update/user-password',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/user/remove',
      method: 'delete',
      data
    })
  }
}
