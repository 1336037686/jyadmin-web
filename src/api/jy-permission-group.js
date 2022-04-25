import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/permission/group/list',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/permission/group/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/permission/group/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/permission/group/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/permission/group/remove',
      method: 'delete',
      data
    })
  }
}
