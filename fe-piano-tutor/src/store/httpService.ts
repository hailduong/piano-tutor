// fe-piano-tutor/src/services/httpService.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';

const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.APP_URL || 'http://localhost:3001',
});

const httpService = {
  get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return httpClient.get(url, config);
  },
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return httpClient.post(url, data, config);
  },
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return httpClient.put(url, data, config);
  },
  delete<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return httpClient.delete(url, config);
  },
};

export default httpService;
