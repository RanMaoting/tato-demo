import type { SupportedLanguagesType } from '@/locales'
import { setupI18n } from '@/locales'
import Taro from '@tarojs/taro'
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import './app.scss'
import 'uno.css'

const App = createApp({
  onShow() {
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(createPinia())
const appInfo = Taro.getAppBaseInfo()

setupI18n(App, {
  defaultLocale: appInfo.language as SupportedLanguagesType,
})

export default App
