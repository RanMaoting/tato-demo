import type { HttpResponse } from '@/utils/request'
import { i18n } from '@/locales'
import { useAccessStore } from '@/stores'
import { authenticateResponseInterceptor, errorMessageResponseInterceptor, RequestClient } from '@/utils/request'
import { unref } from 'vue'
import Taro from '@tarojs/taro'

export function formatToken(token: null | string) {
  return token ? `Bearer ${token}` : null
}
function createRequestClient(baseURL: string) {
  const client = new RequestClient<{ hideMessage?: boolean }>({
    baseURL,
  })

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ')
    const accessStore = useAccessStore()
    const authStore = useAuthStore()
    accessStore.setAccessToken(null)
    if (accessStore.isAccessChecked) {
      accessStore.setLoginExpired(true)
    }
    else {
      await authStore.logout()
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore()
    const resp = await refreshTokenApi()
    const newToken = resp.data
    accessStore.setAccessToken(newToken)
    return newToken
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore()

      config.headers.Authorization = formatToken(accessStore.accessToken)
      config.headers['Accept-Language'] = unref(i18n.global.locale)
      return config
    },
  })

  // response数据解构
  client.addResponseInterceptor<HttpResponse>({
    fulfilled: (response) => {
      const { data: responseData, status, config } = response

      if (status === 200) {
        return config?.responseType === 'blob' ? response : responseData
      }
      throw Object.assign({}, response, { response })
    },
  })

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: true,
      formatToken,
    }),
  )

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor<{ hideMessage?: boolean }>(
      (msg: string, error) => {
        if (!error.config.hideMessage) {
          // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
          // 当前mock接口返回的错误字段是 error 或者 message
          const responseData = error?.response?.data ?? ({} as any)
          const errorMessage = responseData?.error ?? responseData?.msg ?? ''
          // 如果没有错误信息，则会根据状态码进行提示

          Taro.showToast({ title: errorMessage || msg, icon: 'none' })
        }
      },
    ),
  )

  return client
}

// eslint-disable-next-line node/prefer-global/process
const apiURL = process.env.TARO_APP_GLOB_API_URL


console.log(apiURL);



export const requestClient = createRequestClient(apiURL)

export const baseRequestClient = new RequestClient({ baseURL: apiURL })
