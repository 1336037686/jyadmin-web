import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/simple-data-dict/list',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/simple-data-dict/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/simple-data-dict/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/simple-data-dict/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/simple-data-dict/remove',
      method: 'delete',
      data
    })
  },

  getByCode(code) {
    return request({
      url: '/api/simple-data-dict-detail/queryByCode/' + code,
      method: 'get'
    })
  }
}
