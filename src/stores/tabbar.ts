import type {
  TabbarItemProps,
} from '@nutui/nutui-taro'
import Taro, { pxTransform } from '@tarojs/taro'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface ListVO extends TabbarItemProps {
}

const ALL_TAB_BARS: Array<ListVO> = [
  {
    tabTitle: '首页',
    icon: 'i-assets_cl_home',
    href: '/pages/index/index',
  },

]

export const useTabbarStore = defineStore('tabbar', () => {
  const tabBars = ref<Array<ListVO>>(ALL_TAB_BARS)

  const selectedTab = ref('/pages/index/index')

  const tabbarHeight = ref<string>(pxTransform(100))

  function getTabbarHeight() {
    const { safeArea } = Taro.getSystemInfoSync() || {}

    if (safeArea) {
      const isIphoneX = safeArea.top > 40
      if (isIphoneX) {
        tabbarHeight.value = pxTransform(160)
        return
      }
    }

    tabbarHeight.value = pxTransform(100)
  }

  const pageHeight = computed(() => {
    return `calc(100vh - ${tabbarHeight.value})`
  })

  // 给tabbar赋初始值
  function handleInitTabbar(path: string) {
    selectedTab.value = path
  }

  return {
    tabBars,
    selectedTab,
    getTabbarHeight,
    tabbarHeight,
    pageHeight,
    handleInitTabbar,
  }
})
