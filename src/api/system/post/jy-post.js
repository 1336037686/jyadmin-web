import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/post/query',
      method: 'get',
      params: query
    })
  },

  getOptionList(query) {
    return request({
      url: '/api/post/list',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/post/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/post/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/post/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/post/remove',
      method: 'delete',
      data
    })
  }
}
