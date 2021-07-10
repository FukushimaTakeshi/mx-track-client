import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

axios.defaults.baseURL = 'http://localhost:3000/'

const axiosInstance = axios.create()
const axiosWithTokenInstance = axios.create()

export const apiClient = axiosInstance
export const apiClientWithAuth = axiosWithTokenInstance

const snakedRequest = (request) => {
  return {
    ...request,
    data: request.data ? snakecaseKeys(request.data, { deep: true }) : null,
  }
}

const camelizeRequest = (response) => {
  return {
    ...response,
    data: response.data ? camelcaseKeys(response.data, { deep: true }) : null,
  }
}
axiosInstance.interceptors.request.use(snakedRequest)

axiosWithTokenInstance.interceptors.request.use((request) => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new axios.Cancel('token does not exist.')
  }
  return {
    ...snakedRequest(request),
    headers: { Authorization: `Bearer ${token}` },
  }
})

axiosInstance.interceptors.response.use(camelizeRequest)
axiosWithTokenInstance.interceptors.response.use(camelizeRequest)
