import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/config-detail/list',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/config-detail/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/config-detail/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/config-detail/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/config-detail/remove',
      method: 'delete',
      data
    })
  }
}
