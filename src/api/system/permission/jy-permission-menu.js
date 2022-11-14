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

  getFromRole(id) {
    return request({
      url: '/api/permission/menu/query/role/' + id,
      method: 'get'
    })
  },

  list(query) {
    return request({
      url: '/api/permission/menu/list',
      method: 'get',
      params: query
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

  addFromRole(roleId, menuIds) {
    return request({
      url: '/api/permission/menu/create/role/' + roleId,
      method: 'post',
      data: menuIds
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
