import type {
  TabbarItemProps,
} from '@nutui/nutui-taro'
import { getStaticUrl } from '@/utils/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ListVO extends TabbarItemProps {
  active: string
}

const ALL_TAB_BARS: Array<ListVO> = [
  {
    tabTitle: '邮寄',
    icon: getStaticUrl('/send.png'),
    active: getStaticUrl('/send-active.png'),
    href: '/pages/mailing/index',
  },
  // {
  //   tabTitle: '记录',
  //   icon: getStaticUrl('/send.png'),
  //   active: getStaticUrl('/send-active.png'),
  //   href: '/pages/index/index',
  // },
  {
    tabTitle: '我的',
    icon: getStaticUrl('/user.png'),
    active: getStaticUrl('/user-active.png'),
    href: '/pages/personal/index',
  },
]

export const useTabbarStore = defineStore('tabbar', () => {
  const tabBars = ref<Array<ListVO>>(ALL_TAB_BARS)

  const selectedTab = ref('/pages/mailing/index')

  return {
    tabBars,
    selectedTab,
  }
})
