<script setup lang="ts">
import { getWechatOfficialInfo } from '@/api'
import Taro from '@tarojs/taro'
import { onMounted, ref } from 'vue'

const src = ref(`${process.env.TARO_APP_GLOB_API_URL}/#/openWx?openOfficialAccount=true&redirect=${encodeURIComponent(
  process.env.TARO_APP_OFFICIAL_AUTH_URL,
)}`)

const showWebView = ref(false)

async function handleGetOfficialInfo(code?: string) {
  const { subscribe } = await getWechatOfficialInfo(code)

  if (subscribe) {
    // 已经关注公众号,直接跳转至该用户的主页
    Taro.reLaunch({
      url: '/pages/homePage/index',
    })
  }
  else {
    showWebView.value = true
  }
}
onMounted(() => {
  handleGetOfficialInfo()
})
</script>

<template>
  <view> <web-view v-if="showWebView" :src="src" /></view>
</template>

<style scoped></style>
