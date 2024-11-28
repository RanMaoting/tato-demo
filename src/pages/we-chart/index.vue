<script lang="ts" setup>
import { useRouter } from '@tarojs/taro'

const router = useRouter()
const officialId = process.env.TARO_APP_OFFICIAL_ID

const uri = `${process.env.TARO_APP_GLOB_API_URL}/#/openWeChat?state=${router.params.state}&appid=${officialId}`
</script>

<template>
  <view> <web-view :src="uri" /></view>
</template>
