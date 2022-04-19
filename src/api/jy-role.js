import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/role/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/role/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/role/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/role/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/role/remove',
      method: 'delete',
      data
    })
  }
}
