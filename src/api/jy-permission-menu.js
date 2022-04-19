import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/permission/menu/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/permission/menu/query/' + id,
      method: 'get'
    })
  },

  layer(query) {
    return request({
      url: '/api/permission/menu/layer',
      method: 'get',
      params: query
    })
  },

  add(data) {
    return request({
      url: '/api/permission/menu/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/permission/menu/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/permission/menu/remove',
      method: 'delete',
      data
    })
  }
}
