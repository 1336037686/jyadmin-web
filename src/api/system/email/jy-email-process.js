import request from '@/utils/request-api'

export default {
  send(data) {
    return request({
      url: '/api/email-process/send',
      method: 'post',
      data
    })
  }
}
