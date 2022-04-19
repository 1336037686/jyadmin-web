import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/permission/action/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/permission/action/query/' + id,
      method: 'get'
    })
  },

  getFromMenu(menuId) {
    return request({
      url: '/api/permission/action/query/menu/' + menuId,
      method: 'get'
    })
  },

  list(query) {
    return request({
      url: '/api/permission/action/list',
      method: 'get',
      params: query
    })
  },

  add(data) {
    return request({
      url: '/api/permission/action/create',
      method: 'post',
      data
    })
  },

  addFromMenu(menuId, actionIds) {
    return request({
      url: '/api/permission/action/create/menu/' + menuId,
      method: 'post',
      data: actionIds
    })
  },

  update(data) {
    return request({
      url: '/api/permission/action/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/permission/action/remove',
      method: 'delete',
      data
    })
  }
}
