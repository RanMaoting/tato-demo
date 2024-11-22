
import { type AuthApi, getUserInfoApi, loginApi, logoutApi } from '#/api'

import { $t } from '#/locales'
import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@/constants'
import { resetAllStores, useAccessStore, useUserStore } from '@/stores'

import { encryptString } from '@/utils'

import { defineStore } from 'pinia'
import { ref } from 'vue'


interface UserInfo extends BasicUserInfo {
  accCustomerId: number
  builtinRole: string
  cancelPinCode: boolean
  customerId: number
  filiale: BaseVO
  idNumber: string
  lastLoginTime: string
  phone: string
  roleName: string
  student: boolean
  studentId: number
  subsystems: string[]
  teacher: boolean
  teacherAdmin: boolean
  tempStudent: boolean
  homePath?: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore()
  const userStore = useUserStore()
  const router = useRouter()

  const loginLoading = ref(false)

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: AuthApi.LoginParams,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null
    try {
      loginLoading.value = true
      const { access_token: accessToken } = await loginApi({
        ...params,
        password: encryptString(params.password),
      })

      // 如果成功获取到 accessToken
      if (accessToken) {
        // 将 accessToken 存储到 accessStore 中
        accessStore.setAccessToken(accessToken)

        // 获取用户信息并存储到 accessStore 中
        userInfo = await fetchUserInfo()

        userStore.setUserInfo(userInfo)
        accessStore.setCode(userInfo.totalAuthorities)

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false)
        }
        else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(userInfo.homePath || DEFAULT_HOME_PATH)
        }

        if (userInfo?.name) {
          notification.success({
            content: $t('authentication.loginSuccess'),
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.name}`,
            duration: 3000,
          })
        }
      }
    }
    finally {
      loginLoading.value = false
    }

    return {
      userInfo,
    }
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi()
    }
    catch {
      // 不做任何处理
    }
    resetAllStores()
    accessStore.setLoginExpired(false)

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    })
  }

  async function fetchUserInfo() {
    let userInfo: null | UserInfo = null
    userInfo = await getUserInfoApi()
    if (!userInfo.subsystems.includes('RMS') || !userInfo.userId) {
      message.error('无权限')
      throw new Error('{ code: 403 }')
    }
    userStore.setUserInfo(userInfo)
    if (!userInfo.homePath) {
      userInfo.homePath = userInfo.totalAuthorities.includes('OVERVIEW')
        ? DEFAULT_HOME_PATH
        : '/repair/list/index'
    }

    return userInfo
  }

  function $reset() {
    loginLoading.value = false
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  }
})
