import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import jwt_decode from 'jwt-decode'

// create an axios instance
const service = axios.create({
  baseURL: process.env.JY_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  async config => {
    // do something before request is sent

    // 设置token
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * 如果您想获得http信息，如标头或状态 return  response => response
   * 自定义代码确定请求状态
   */
  async response => {
    const res = response.data
    // 如果是文件下载
    if (response.headers.requesttype && response.headers.requesttype === 'file') {
      return response
    }
    // 请求正常 res.code == 200
    if (res.code === 200) return res

    // 请求异常 res.code == 2201 0014 Token过期，自动续期重新发送请求
    if (res.code === 22010014) {
      // 判断当前是否过期
      const decodedToken = jwt_decode(store.getters.token)
      const decodedRefreshToken = jwt_decode(store.getters.refreshToken)
      const currentTime = Date.now() / 1000 // 将毫秒转成秒
      // access token 过期 且 refresh token 未过期，发送续期请求，获取新 access token，并重新发起请求
      if (currentTime > decodedToken.exp && currentTime <= decodedRefreshToken.exp) {
        await store.dispatch('user/refreshToken')
        return service.request(response.config) // 重新发起请求
      }
    }

    // 登陆失效 或者 token校验异常
    if (res.code === 22010008 || res.code === 22010009 || res.code === 22010010 ||
      res.code === 22010013 || res.code === 22010014 || res.code === 22010015) {
      Notification({ title: '失败', message: '登录过期，请重新登录', type: 'error', duration: 5 * 1000 })
      // 重新登陆
      toReLogin()
      // 返回错误
      return Promise.reject(new Error('登录过期，请重新登录'))
    }

    // 请求异常 res.code != 200
    Notification({
      title: '失败',
      message: res.msg || '服务异常',
      type: 'error',
      duration: 5 * 1000
    })

    // 返回错误
    return Promise.reject(new Error(res.msg || '服务异常'))
  },
  error => {
    console.error('err' + error) // for debug
    Notification({
      title: '失败',
      message: error.msg || '服务异常',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 清除数据，提示用户，跳转登录界面
function toReLogin() {
  MessageBox.confirm('当前账号登陆失效，您可以重新登录', '退出确认', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning',
    customClass: 'jy-message-box'
  }).then(() => {
    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  })
}

export default service
