import Taro from '@tarojs/taro'

import { defineStore } from 'pinia'

type AccessToken = null | string

interface AccessState {
  /**
   * 登录 accessToken
   */
  accessToken: AccessToken
  /**
   * 登录是否过期
   */
  loginExpired: boolean
  /**
   * 登录 accessToken
   */
  refreshToken: AccessToken
  isAccessChecked: boolean
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
      if (token) {
        Taro.setStorage({ key: 'accessToken', data: token })
      }
      else {
        Taro.removeStorage({ key: 'accessToken' })
      }
    },
    setIsAccessChecked(isAccessChecked: boolean) {
      this.isAccessChecked = isAccessChecked
    },
    setLoginExpired(loginExpired: boolean) {
      this.loginExpired = loginExpired
    },
    setRefreshToken(token: AccessToken) {
      this.refreshToken = token
      if (token) {
        Taro.setStorage({ key: 'refreshToken', data: token })
      }
      else {
        Taro.removeStorage({ key: 'refreshToken' })
      }
    },
  },
  state: (): AccessState => ({
    accessToken: Taro.getStorageSync('accessToken') || null,
    loginExpired: false,
    refreshToken: Taro.getStorageSync('refreshToken') || null,
    isAccessChecked: false,
  }),
})
