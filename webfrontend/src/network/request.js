/*
 * @Date: 2020-02-16 13:59:52
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-15 21:21:17
 * @FilePath: \webfrontend\src\network\request.js
 */
import axios from 'axios'
import router from "../router"
import { Message } from 'element-ui'

export function request(config) {
  return new Promise((resolve,reject) => {
    const devMode = process.env.NODE_ENV == 'development'
    let BASE_URL = 'http://study.hsmxg1204.cn:8080/crm/'
    if(devMode){
      BASE_URL = 'http://127.0.0.1:8443'
    }
    const instance = axios.create({
      baseURL:BASE_URL,
      withCredentials: true,
      timeout:20000,
    })
    //axios拦截器
    instance.interceptors.request.use(config => {

      // 请求拦截的作用
      //1. config中一些信息不符合服务器的要求
      //2. 每次发送网络请求时，显示一个请求图标
      //3. 某些登录请求()，必须携带一些信息
      //请求头添加token
      if(sessionStorage.getItem('Authorization')){
        config.headers.Authorization = `${sessionStorage.getItem('Authorization')}`
      }
      config.url = config.url.slice(4)

      return config
    },error => {
      return reject(error);
    })
    // 响应拦截
    instance.interceptors.response.use(res => {

      if(res.data.code == 253){
        alert("登录过期，请重新登录")
        router.replace({path:'/login'})
        return new Promise(() => {})
      }
      switch (res && res.data.code) {
        case 1001:
          //console.log('用户名或密码错误')
          break
        case 401:
          alert('您没有权限')
          router.go(0)
          return false
        case 404:
          router.push({
            path:'/404'
          })
          break
        case 500:
          alert('Server Internal Error')
          router.go(0)
          break
        case 1003:
          alert('不能修改自己的状态');
          router.go(0)
          return false
        case 10002:
          Message.error('error')
          return false
      }
      return resolve(res.data)
    },error => {

      return reject(error)
    })

    // 发送网络请求
    return instance(config)  // 返回的是Promise

  })
}
