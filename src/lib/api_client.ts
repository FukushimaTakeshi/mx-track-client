import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT

const axiosInstance = axios.create()
const axiosInstanceWithToken = axios.create()

export const apiClient = axiosInstance
export const apiClientWithAuth = axiosInstanceWithToken

const snakedRequest = (request: AxiosRequestConfig) => {
  return {
    ...request,
    data: request.data ? snakecaseKeys(request.data, { deep: true }) : null,
  }
}

const camelizeRequest = (response: AxiosResponse) => {
  return {
    ...response,
    data: response.data ? camelcaseKeys(response.data, { deep: true }) : null,
  }
}
axiosInstance.interceptors.request.use(snakedRequest)

axiosInstanceWithToken.interceptors.request.use((request) => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new axios.Cancel('token does not exist.')
  }
  return {
    ...snakedRequest(request),
    headers: { Authorization: `Bearer ${token}` },
  }
})

const errorHandler = (error: AxiosError) => {
  if (error?.response?.status == 401) {
    window.location.reload()
  } else if (error?.response?.status == 404) {
    // TODO: 404ページの作成
    return Promise.reject(error)
  } else {
    return Promise.reject(error)
  }
}

axiosInstance.interceptors.response.use(camelizeRequest, errorHandler)
axiosInstanceWithToken.interceptors.response.use(camelizeRequest, errorHandler)
