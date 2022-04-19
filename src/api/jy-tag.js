import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/tag/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/tag/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/tag/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/tag/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/tag/remove',
      method: 'delete',
      data
    })
  }
}
