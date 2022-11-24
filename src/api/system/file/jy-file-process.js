import request from '@/utils/request-api'

export default {
  upload(relevance, data) {
    return request({
      url: '/api/file-process/upload/' + relevance,
      method: 'post',
      data
    })
  },
  download(id) {
    return request({
      url: '/api/file-process/download/' + id,
      method: 'get',
      responseType: 'blob'
    })
  }
}
