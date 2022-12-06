import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/quartz-log/query',
      method: 'get',
      params: query
    })
  }
}
