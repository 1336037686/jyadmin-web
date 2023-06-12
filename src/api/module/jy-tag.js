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

  add(data, idempotentToken) {
    return request({
      url: '/api/tag/create',
      method: 'post',
      params: { 'idempotent-token': idempotentToken },
      data
    })
  },

  update(data, idempotentToken) {
    return request({
      url: '/api/tag/update',
      method: 'put',
      params: { 'idempotent-token': idempotentToken },
      data
    })
  },

  remove(data, idempotentToken) {
    return request({
      url: '/api/tag/remove',
      method: 'delete',
      params: { 'idempotent-token': idempotentToken },
      data
    })
  }
}
