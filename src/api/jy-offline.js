import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/offline/query',
      method: 'get',
      params: query
    })
  },
  forcedOffline(data) {
    return request({
      url: '/api/offline/forcedOffline',
      method: 'delete',
      data
    })
  }
}
