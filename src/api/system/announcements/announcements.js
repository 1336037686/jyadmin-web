import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/announcements/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/announcements/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/announcements/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/announcements/update',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/announcements/remove',
      method: 'delete',
      data
    })
  }
}
