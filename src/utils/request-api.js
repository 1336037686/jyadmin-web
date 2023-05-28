import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.JY_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
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
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 如果是文件下载
    if (response.headers.requesttype && response.headers.requesttype === 'file') {
      return response
    }
    // 请求正常 res.code == 200
    console.log(res)
    if (res.code === 200) return res
    // 请求异常 res.code != 200
    Notification({
      title: '失败',
      message: res.msg || '服务异常',
      type: 'error',
      duration: 5 * 1000
    })
    // 登陆失效
    if (res.code === 10002 || res.code === 10008 || res.code === 10009) {
      // 重新登陆
      toReLogin()
    }
    // 返回错误
    return Promise.reject(new Error(res.msg || '服务异常'))
  },
  error => {
    console.log('request api error')
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
    type: 'warning'
  }).then(() => {
    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  })
}

export default service
