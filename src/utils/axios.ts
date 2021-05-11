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
