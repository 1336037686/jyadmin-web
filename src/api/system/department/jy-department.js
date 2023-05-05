import request from '@/utils/request-api'

export default {
  layer(query){
    return request({
      url: '/api/department/layer',
      method: 'get',
      params: query
    })
  },

  getList(query) {
    return request({
      url: '/api/department/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/department/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/department/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/department/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/department/remove',
      method: 'delete',
      data
    })
  }
}
