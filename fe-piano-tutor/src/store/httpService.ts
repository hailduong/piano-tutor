// fe-piano-tutor/src/services/httpService.ts
import axios, {AxiosInstance, AxiosRequestConfig, AxiosPromise} from 'axios'
import {store, RootState} from 'store'

// Create an Axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.APP_URL || 'http://localhost:3001'
})

// Add a request interceptor to include the Authorization header
httpClient.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const state: RootState = store.getState()
    const token = state.auth.token
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

const httpService = {
  get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return httpClient.get(url, config)
  },
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return httpClient.post(url, data, config)
  },
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return httpClient.put(url, data, config)
  },
  delete<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return httpClient.delete(url, config)
  }
}

export default httpService
