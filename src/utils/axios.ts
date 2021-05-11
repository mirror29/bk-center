import Cookies from "js-cookie"
import axios from "axios"
import { Toast } from "vant"
import { $BASE_URL } from "./env"
const isProd = process.env.NODE_ENV === "production"

const service = axios.create({
  // baseURL: process.env.NODE_ENV === 'production' ? `${$BASE_URL}/api` : '/bdApi',
  withCredentials: true, // 允许跨域携带cookie
  timeout: 1000 * 60,
})

// Request interceptors
service.interceptors.request.use(
  (config: any) => {
    config.baseURL = `${$BASE_URL}/api`
    config.headers["Content-Type"] = "application/json"

    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response: any) => {
    const res = response.data
    if (response.status !== 200) {
      Toast(res.message || "Error")
      if (res.code === 401 || res.code === 50012 || res.code === 50014) {
      }
      return Promise.reject(new Error(res.message || "Error"))
    } else {
      if (res.code === 401) {
      }
      return response.data
    }
  },
  (error) => {
    Toast(error.message || "Error")
    return Promise.reject(error)
  }
)

export default service

// import { $BASE_URL } from "./env"
// import axios from 'axios'

// function getCurrentDate() {
//   let date = new Date(),
//     seperator1 = "-",
//     seperator2 = ":",
//     month:any = date.getMonth() + 1,
//     strDate:any = date.getDate()
//   if (month >= 1 && month <= 9) {
//     month = "0" + month
//   }
//   if (strDate >= 0 && strDate <= 9) {
//     strDate = "0" + strDate
//   }
//   let currentdate =
//     date.getFullYear() +
//     seperator1 +
//     month +
//     seperator1 +
//     strDate +
//     " " +
//     date.getHours() +
//     seperator2 +
//     date.getMinutes() +
//     seperator2 +
//     date.getSeconds()
//   return currentdate
// }

// export default function ({ app:any, error:any, route:any }) {
//   axios.defaults.timeout = 1000 * 60 // 改为1mins
//   axios.defaults.headers.common["Content-Type"] = "application/json"
//   axios.defaults.headers.post["Content-Type"] = "application/json"
//   axios.defaults.baseURL = $BASE_URL

//   // 请求回调
//   axios.request((config:any) => {
//     if (Cookies.get("access_token")) {
//       let token = Cookies.get("access_token")
//       config.headers.common["Authorization"] = `Bearer ${token}`
//     }
//     if (config.headers.common.cookie) {
//       let arr = config.headers.common.cookie.split(";")
//       let token_arr = arr.filter((item) => {
//         return item.indexOf("access_token=") > -1
//       })
//       if (token_arr.length > 0) {
//         let token = token_arr[0].replace("access_token=", "")
//         config.headers.common["Authorization"] = `Bearer ${token}`
//       }
//     }
//     if (config.method === "post") {
//       config.data = {
//         _platform: 3,
//         ...config.data,
//       }
//     } else if (config.method === "get") {
//       config.params = {
//         _platform: 3,
//         ...config.params,
//       }
//     }
//   })
//   // 返回回调
//   axios.onResponse((res:any) => {})

//   // 错误回调
//   axios.onError((err:any) => {
//     let res = err.response
//     // 钉钉机器人报警:线上服务端接口
//     if (
//       process.server &&
//       env === "official" &&
//       (err.code === "ECONNABORTED" || (res && res.status >= 500))
//     ) {
//       let content = ``
//       if (res) {
//         content = `前端报警：
//         状态码：${res.status};
//         pageUrl: ${route.fullPath};
//         url地址：${res.config.baseURL}${res.config.url};
//         UA：${JSON.stringify(res.config.headers["user-agent"])};
//         参数：${JSON.stringify(res.config.data || res.config.params)};
//         报错信息：${JSON.stringify(res.data)};
//         报错时间：${getCurrentDate()}
//         \n`
//       } else {
//         content = `前端报警(接口超时)：
//         pageUrl: ${route.fullPath};
//         url地址：${err.config.baseURL}${err.config.url};
//         参数：${JSON.stringify(err.config.data || err.config.params)};
//         报错时间：${getCurrentDate()}
//         \n`
//       }
//       axios.post(
//         "https://oapi.dingtalk.com/robot/send?access_token=f7df5bf8ec94416a13ff56b20b382b2d5052032d1d0e5c9f8071a094d4215f92",
//         {
//           msgtype: "text",
//           text: {
//             content: content,
//           },
//           at: {
//             // atMobiles: ['13381316360', '18212621230'], // 钉钉个人手机号
//             isAtAll: true,
//           },
//         }
//       )
//     }
//     if (res) {
//       switch (res.status) {
//         case 404:
//           error({ statusCode: 404 })
//           break
//         case 500:
//           error({ statusCode: 500 })
//           break
//       }
//     }
//   })
// }
