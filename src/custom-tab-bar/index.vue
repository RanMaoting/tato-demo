<script setup lang="ts">
import { useTabbarStore } from '@/stores/tabbar'
import Taro from '@tarojs/taro'

const tabBarStore = useTabbarStore()

function handleTabSwitch(_, href: string) {
  Taro.switchTab({ url: href })
}
</script>

<script lang="ts">
// 只支持 Options API 写法，不支持 <script setup>
export default {
  options: {
    addGlobalClass: true,
  },
}
</script>

<template>
  <nut-tabbar v-model="tabBarStore.selectedTab" bottom safe-area-inset-bottom placeholder @tab-switch="handleTabSwitch">
    <nut-tabbar-item v-for="item in tabBarStore.tabBars" :key="item.href" :tab-title="item.tabTitle" :name="item.href">
      <template #icon="{ active }">
        <image :src="active ? item.active : item.icon" mode="aspectFit" style="width: 30px; height: 30px;" />
      </template>
    </nut-tabbar-item>
  </nut-tabbar>
</template>
