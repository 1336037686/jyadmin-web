import request from '@/utils/request-api'

export default {
  sendVerificationCode(data) {
    return request({
      url: '/api/sms-process/send/verificationCode',
      method: 'post',
      data
    })
  }
}
