import request from '@/utils/request-api'

export default {
  layer(query) {
    return request({
      url: '/api/data-dict/layer',
      method: 'get',
      params: query
    })
  },

  getList(query) {
    return request({
      url: '/api/data-dict/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/data-dict/query/' + id,
      method: 'get'
    })
  },

  addRoot(data) {
    return request({
      url: '/api/data-dict/create-root',
      method: 'post',
      data
    })
  },

  addNode(data) {
    return request({
      url: '/api/data-dict/create-node',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/data-dict/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/data-dict/remove',
      method: 'delete',
      data
    })
  }
}
