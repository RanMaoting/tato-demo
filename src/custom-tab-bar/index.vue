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
        <div class="w-60 h-60" :class="[active ? 'text-primary' : 'text-gray-400', item.icon]" />
      </template>
    </nut-tabbar-item>
  </nut-tabbar>
</template>
