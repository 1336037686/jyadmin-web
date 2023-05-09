import request from '@/utils/request-api'

export default {
  getList(query) {
    return request({
      url: '/api/basic-setting/list',
      method: 'get',
      params: query
    })
  },

  update(data) {
    return request({
      url: '/api/basic-setting/update',
      method: 'put',
      data
    })
  }
}
