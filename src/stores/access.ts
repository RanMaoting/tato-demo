import Taro from '@tarojs/taro'
import { defineStore } from 'pinia'

type AccessToken = null | string

interface AccessState {
  /**
   * 权限码
   */
  code: string | null
  /**
   * 登录 accessToken
   */
  accessToken: AccessToken
  /**
   * 是否已经检查过权限
   */
  isAccessChecked: boolean
  /**
   * 登录是否过期
   */
  loginExpired: boolean
  /**
   * 登录 accessToken
   */
  refreshToken: AccessToken
}

/**
 * @zh_CN 访问权限相关
 */
export const useAccessStore = defineStore('core-access', {
  actions: {
    setCode(code: string) {
      this.code = code
    },

    setAccessToken(token: AccessToken) {
      this.accessToken = token
      Taro.setStorage({ key: 'accessToken', data: token })
    },
    setIsAccessChecked(isAccessChecked: boolean) {
      this.isAccessChecked = isAccessChecked
    },
    setLoginExpired(loginExpired: boolean) {
      this.loginExpired = loginExpired
    },
    setRefreshToken(token: AccessToken) {
      this.refreshToken = token
      Taro.setStorage({ key: 'refreshToken', data: token })
    },
  },
  state: (): AccessState => ({
    code: null,
    accessToken: Taro.getStorageSync('accessToken') || null,
    isAccessChecked: false,
    loginExpired: false,
    refreshToken: Taro.getStorageSync('refreshToken') || null,
  }),
})
