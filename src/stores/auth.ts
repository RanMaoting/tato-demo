import { getUserInfoApi, unbindWechat } from '@/api'

import { $t } from '@/locales'

import { useAccessStore } from '@/stores'
import Taro from '@tarojs/taro'

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
}

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore()

  const loginLoading = ref(false)

  const userInfo = ref<UserInfo | null>(null)

  async function logout() {
    try {
      if (userInfo.value?.userId) {
        await unbindWechat(userInfo.value.userId)
      }
    }
    catch {
      // 不做任何处理
    }

    accessStore.setLoginExpired(false)
    accessStore.setAccessToken(null)
    accessStore.setRefreshToken(null)
    userInfo.value = null
    Taro.reLaunch({
      url: '/pages/login/index',
    })
  }

  async function fetchUserInfo() {
    try {
      const data: UserInfo = await getUserInfoApi()

      userInfo.value = data
    }
    catch (e) {
      if (e.status === 403) {
        Taro.showModal({
          title: $t('common.tips.title'),
          content: $t('common.forbidden'),
          showCancel: false,
          success(result) {
            if (result.confirm) {
              logout()
            }
          },
        })
      }
      throw e
    }

    return userInfo.value
  }

  function $reset() {
    loginLoading.value = false
  }

  return {
    $reset,
    fetchUserInfo,
    loginLoading,
    logout,
    userInfo,
  }
})
