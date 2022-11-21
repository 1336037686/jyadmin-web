import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/file-record/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/file-record/query/' + id,
      method: 'get'
    })
  },

  remove(data) {
    return request({
      url: '/api/file-record/remove',
      method: 'delete',
      data
    })
  }

}
