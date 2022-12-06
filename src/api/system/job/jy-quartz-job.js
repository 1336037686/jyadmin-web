import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/quartz-job/query',
      method: 'get',
      params: query
    })
  },

  getById(id) {
    return request({
      url: '/api/quartz-job/query/' + id,
      method: 'get'
    })
  },

  add(data) {
    return request({
      url: '/api/quartz-job/create',
      method: 'post',
      data
    })
  },

  update(data) {
    return request({
      url: '/api/quartz-job/update',
      method: 'put',
      data
    })
  },

  updateJobStatus(data) {
    return request({
      url: '/api/quartz-job/update-status',
      method: 'put',
      data
    })
  },

  remove(data) {
    return request({
      url: '/api/quartz-job/remove',
      method: 'delete',
      data
    })
  }
}
