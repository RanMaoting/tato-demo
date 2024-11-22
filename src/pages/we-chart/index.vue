<template>
  <view> <web-view :src="uri"></web-view></view>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from '@tarojs/taro'
const router = useRouter()
const appid = ref(process.env.TARO_APP_ID)
const uri = `${process.env.TARO_APP_GLOB_API_URL}/#/openWeChat?state=${router.params.state}&appid=${appid.value}`
</script>
