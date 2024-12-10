<script lang="ts" setup>
import type { UserApi } from '@/api'
import { getWechatOfficialInfo, wechatToken } from '@/api'
import { WechatTokenTypeEnum } from '@/enums'
import { $t } from '@/locales'
import { useAccessStore } from '@/stores'
import { useAuthStore } from '@/stores/auth'
import { getStaticUrl } from '@/utils/api'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { ref } from 'vue'

const accessStore = useAccessStore()

const visible = ref(false)
const authStore = useAuthStore()

// 根据权限重定向至当前用户的首页
function handleRedirect() {
  // TODO 暂时没有判断
  Taro.switchTab({
    url: '/pages/mailing/index',
  })
}

/*
   @description  有token的情况下,先获取公众号信息,进行判断
    - code存在且subscribe为1,表示已经关注公众号,直接跳转至该用户的主页
    - code存在且subscribe为0,表示是历史上关注过公众号,需要提示用户进行关注
    - code不存在且subscribe也不存在,表示没有关注公众号,需要先获取公众号的code,然后提示进行关注

    subscribe: 0 未关注 1 已关注
    这个值只有用户手动关注或者取消关注公众号的时候才会变化
    */
async function handleGetOfficialInfo(code?: string) {
  if (process.env.NODE_ENV === 'production') {
    const { subscribe, openid } = await getWechatOfficialInfo(code)

    if (subscribe) {
      // 已经关注公众号,直接跳转至该用户的主页
      handleRedirect()
    }
    else {
      // 如果openid存在,则是历史上关注过公众号
      if (openid) {
        visible.value = true
      }
      else {
        Taro.reLaunch({
          url: '/pages/we-chart/index',
        })
      }
    }
  }
  else {
    handleRedirect()
  }
}

// 跳转至公众号授权页面
function handleConfirm() {
  Taro.reLaunch({
    url: '/pages/official-authorized/index',
  })
}

useLoad(async () => {
  // 还没有token
  if (!accessStore.accessToken) {
    const { code } = await Taro.login()
    const params: UserApi.WechatTokenBO = {
      code,
      type: WechatTokenTypeEnum.MINI_PROGRAM,
    }
    try {
      // 使用code 换取 token, 成功表示已经绑定过,直接进入业务逻辑, 失败代表小程序还没有登录过,需要进行登录操作
      const { access_token, refresh_token } = await wechatToken(params)

      // 设置信息,并跳转至homePage页面进行其他判断

      accessStore.setAccessToken(access_token)

      accessStore.setRefreshToken(refresh_token)
      // TODO 需要进行业务判断
      await authStore.fetchUserInfo()

      await handleGetOfficialInfo()
    }
    catch ({ data }) {
      if (data) {
        const { code } = data
        if (code === 'NOT_EXIST') {
          Taro.redirectTo({
            url: '/pages/login/index',
          })
        }
      }
    }
  }
  else {
    /*
      如果当前页面路由参数上有code,表示是从公众号授权页面跳转回来,直接提示用户进行关注
    */
    if (!authStore.userInfo) {
      await authStore.fetchUserInfo()
    }
    const route = useRouter()
    if (route.params.code) {
      await handleGetOfficialInfo(route.params.code)
    }
    else {
      await handleGetOfficialInfo()
    }
  }
})
</script>

<template>
  <div class="h-100vh bg-cover bg-center" :style="{ backgroundImage: `url(${getStaticUrl('/loading.jpg')})` }">
    <nut-dialog
      v-model:visible="visible" :title="$t('home.tips')" :ok-text="$t('home.focus')"
      :cancel-text="$t('home.wait')" :close-on-click-overlay="false" @ok="handleConfirm"
    >
      <span>{{ $t('home.tips-content') }}</span>
    </nut-dialog>
  </div>
</template>
