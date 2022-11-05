import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/config-template/list',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/config-template/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/config-template/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/config-template/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/config-template/remove',
      method: 'delete',
      data
    })
  }
}
