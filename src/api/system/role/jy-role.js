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

  getFromUser(id) {
    return request({
      url: '/api/role/query/user/' + id,
      method: 'get'
    })
  },

  list(query) {
    return request({
      url: '/api/role/list',
      method: 'get',
      params: query
    })
  },


  add(data) {
    return request({
      url: '/api/role/create',
      method: 'post',
      data
    })
  },

  addFromUser(userId, roleIds) {
    return request({
      url: '/api/role/create/user/' + userId,
      method: 'post',
      data: roleIds
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
