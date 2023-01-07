import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { getAuth } from 'firebase/auth'
import snakecaseKeys from 'snakecase-keys'
import { firebaseApp } from '../auth/auth'

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

axiosInstanceWithToken.interceptors.request.use(async (request) => {
  const token = localStorage.getItem('auth-token')
  if (!token) {
    throw new axios.Cancel('token does not exist.')
  }
  const tokenObject = JSON.parse(token)

  let idToken
  // TODO: トークンの再取得処理をいい感じのhookに書き換える
  if (Date.now() > tokenObject.expiry) {
    idToken = await getAuth(firebaseApp).currentUser?.getIdToken()
    const token = JSON.stringify({
      idToken,
      expiry: Date.now() + 1000 * 60 * 60,
    })
    localStorage.setItem('auth-token', token)
  } else {
    idToken = tokenObject.idToken
  }
  return {
    ...snakedRequest(request),
    headers: { Authorization: `Bearer ${idToken}` },
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
