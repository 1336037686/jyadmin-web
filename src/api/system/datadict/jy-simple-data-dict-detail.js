import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/simple-data-dict-detail/list',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/simple-data-dict-detail/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/simple-data-dict-detail/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/simple-data-dict-detail/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/simple-data-dict-detail/remove',
      method: 'delete',
      data
    })
  }
}
