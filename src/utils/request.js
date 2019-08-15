import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'
import qs from 'qs'

axios.defaults.withCredentials = true
let baseURLenv
if (process.env.NODE_ENV === 'production') {
  baseURLenv = 'http://ceodemo.hotkidclub.com' + process.env.VUE_APP_BASE_API
  // baseURLenv = 'http://ceoapi.hotkidclub.com' + process.env.VUE_APP_BASE_API
} else {
  baseURLenv = 'http://10.1.0.243'
  // baseURLenv = process.env.VUE_APP_BASE_API
}
// http://ceodemo.hotkidclub.com:8290/ceo/token/refrushToken/aaa

// create an axios instance
const service = axios.create({
  baseURL: baseURLenv, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // config.headers['Content-Type'] = 'application/json'
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // config.headers['Authorization'] = 'Bearer 92lc4g3nyQwNqagufGMKXwke-Khf1XgOlv9O17UJCWk'
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // config.headers['Authorization'] = 'Bearer vxvyI2z_L2B01-5HC3jsVj2-3Wh1FwWMsD7YH9R4KhA'
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // localStorage.getItem('jiekouToken')
      // config.headers['token'] = getToken()
      console.warn('token0000', getToken())
      config.headers['Authorization'] = 'Bearer ' + getToken()
      // config.headers['Authorization'] = 'bearer TuHk6hyUTXFDHvXKIMHN4m7VEdzi6XzM_VPp-UUeFmU'
      config.headers['Content-Type'] = 'application/json'

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

// service.interceptors.response.use((res) => {
//   // console.log("请求结束 ")
//   // console.log("返回: " + JSON.stringify(res.data))
//   return res
// }, (error) => {
//   return Promise.reject(error)
// })

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
    console.warn('response.data', response.data)
    const res = response.data
    return res

      //   store.dispatch('user/resetToken', qs.stringify({
      //   grant_type: 'refresh_token',
      //   validity_period: -1,
      //   scopes: 'openid'
      // })).then(response => {
      //   this.$router.push({ path: this.redirect || '/' })
      // }).catch(err => {
      //   console.log(err)
      // })
    // if the custom code is not 20000, it is judged as an error.
    // if (res.errCode !== 0) {
    //   Message({
    //     message: res.message || 'error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(res.message || 'error')
    // } else {
    //   return res
    // }
  },
  error => {
    // 401token过期
    // console.log(error.response.status,'状态吗')
    // store.dispatch('user/resetToken', qs.stringify({
    //   grant_type: 'refresh_token',
    //   validity_period: -1,
    //   scopes: 'openid'
    // })).then(response => {
    //   // this.$router.push({ path: this.redirect || '/' })
    //   this.$router.push({ path: '/' })
    // }).catch(err => {
    //   console.log(err)
    // })
    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (error.response.status === 401) {
      setToken('')
      console.log('token过期，重新登陆')
      window.location.href = 'http://localhost:9528/ceo/map'
      
      // window.location.href = 'http://ceodemo.hotkidclub.com/ceo/map'
      // window.location.href = 'http://ceoapi.hotkidclub.com/ceo/map'
      
      // to re-login
      // store.dispatch('user/resetToken').then(() => {
      //   // location.reload()
      // })
      // store.dispatch('user/resetToken', qs.stringify({
      //   grant_type: 'refresh_token',
      //   validity_period: -1,
      //   scopes: 'openid'
      // })).then(response => {
      //   // this.$router.push({ path: this.redirect || '/' })
      //   this.$router.push({ path: '/login' })
      //   // response.object
      // }).catch(err => {
      //   console.log(err)
      // })
    }
    // console.log(error.response.status, 8989)
    // console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
