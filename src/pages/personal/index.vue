<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import Taro from '@tarojs/taro'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { statusBarHeight } = Taro.getSystemInfoSync()
const themeVars = ref({
  navbarBackground: 'transparent',
  navbarBoxShadow: 'none',
})

const { userInfo } = storeToRefs(useAuthStore())
</script>

<template>
  <div
    class="h-screen relative box-border p-4"
    style="background: linear-gradient( 180deg, #F3F7FF 30%, rgba(255,243,243,0) 60%, transparent 100%)"
    :style="{ paddingTop: `${statusBarHeight}px` }"
  >
    <div class="w-400 h-500 absolute -right-100 -top-200 rounded-full" style="background: #90B5FF; filter: blur(100rpx);" />
    <NutConfigProvider :theme-vars="themeVars">
      <nut-navbar title="我的" placeholder safe-area-inset-top />
    </NutConfigProvider>
    <div class="w-full my-10 flex items-center px-4">
      <NutAvatar size="large" bg-color="#90B5FF" color="#fff">
        <span class="text-56">
          {{ userInfo?.name[0] }}
        </span>
      </NutAvatar>
      <div class="ml-3 text-32 font-bold">
        {{ userInfo?.name }}
      </div>
    </div>
    <NutCell>
      1111
    </NutCell>
  </div>
</template>
