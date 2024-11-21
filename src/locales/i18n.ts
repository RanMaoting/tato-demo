// 引入必要的类型和函数
import type { App } from 'vue'
import type { ImportLocaleFn, LoadMessageFn, LocaleSetupOptions, SupportedLanguagesType } from './typing'
import { Locale } from '@nutui/nutui-taro'
import enUS from '@nutui/nutui-taro/dist/packages/locale/lang/en-US'

import zhCN from '@nutui/nutui-taro/dist/packages/locale/lang/zh-CN'

import { unref } from 'vue'

import { createI18n } from 'vue-i18n'

// 创建i18n实例，初始配置
const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: '',
  messages: {},
})

// 使用require.context获取langs目录下所有json文件模块（模拟类似import.meta.glob的功能）
const modules = require.context('./langs', true, /\.json$/)

// 用于存储解析后的localesMap，结构为{ locale: ImportLocaleFn }
const localesMap = loadLocalesMapFromDir(modules)

let loadMessages: LoadMessageFn

// 加载localesMap，处理模块并构建对应映射关系
function loadLocalesMap(modules: __WebpackModuleApi.RequireContext) {
  const localesMap: Record<string, ImportLocaleFn> = {}
  modules.keys().forEach((path) => {
    const key = path.match(/([\w-]*)\.(json)/)?.[1]
    if (key) {
      localesMap[key] = modules(path)
    }
  })
  return localesMap
}

// 从给定的模块对象（通过require.context获取的）中加载localesMap，同时处理目录结构相关逻辑
function loadLocalesMapFromDir(modules) {
  const localesRaw: Record<string, Record<string, string>> = {}
  const localesMap = {}

  // 遍历模块，提取语言和文件名信息
  modules.keys().forEach((path: string) => {
    const match = path.match(/([^/]+)\/([^/]+)\.json$/)
    if (match) {
      const [_, locale, fileName] = match
      if (locale && fileName) {
        if (!localesRaw[locale]) {
          localesRaw[locale] = {}
        }
        localesRaw[locale][fileName] = modules(path)
      }
    }
  })

  // 将原始的locale数据转换为异步导入函数形式
  Object.entries(localesRaw).forEach(([locale, files]) => {
    localesMap[locale] = async () => {
      const messages = {}

      Object.entries(files).forEach(([fileName, importFn]) => {
        messages[fileName] = importFn
      })
      return { default: messages }
    }
  })

  return localesMap
}

// 设置i18n的语言，更新全局语言值以及HTML标签的lang属性
function setI18nLanguage(locale: SupportedLanguagesType) {
  i18n.global.locale.value = locale
  document?.querySelector('html')?.setAttribute('lang', locale)
}

// 初始化i18n相关设置，挂载到Vue应用，加载默认语言的消息等
async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  let { defaultLocale = 'zh-CN' } = options
  defaultLocale = defaultLocale.replace(/_/, '-') as SupportedLanguagesType
  if (defaultLocale.startsWith('en')) {
    defaultLocale = 'en-US'
  }

  // 可以自行扩展第三方库和组件库的国际化
  loadMessages = options.loadMessages || (async () => ({}))

  app.use(i18n)
  await loadLocaleMessages(defaultLocale)

  // 在控制台打印警告（处理翻译键缺失情况）
  i18n.global.setMissingHandler((locale, key) => {
    if (options.missingWarn && key.includes('.')) {
      console.warn(`[intlify] Not found '${key}' key in '${locale}' locale messages.`)
    }
  })
}

// 加载指定语言的locale消息，包括设置消息、合并额外消息以及更新语言环境
async function loadLocaleMessages(lang: SupportedLanguagesType) {
  if (unref(i18n.global.locale) === lang) {
    return setI18nLanguage(lang)
  }

  const message = await localesMap[lang]?.()

  if (message?.default) {
    i18n.global.setLocaleMessage(lang, message.default)
  }

  const mergeMessage = await loadMessages(lang)
  i18n.global.mergeLocaleMessage(lang, mergeMessage)

  switch (lang) {
    case 'zh-CN':
      Locale.use('zh-CN', zhCN)
      break
    case 'en-US':
      Locale.use('en-US', enUS)
      break
    default:
      Locale.use('en-US', enUS)
      break
  }

  return setI18nLanguage(lang)
}

export {
  i18n,
  loadLocaleMessages,
  loadLocalesMap,
  loadLocalesMapFromDir,
  setupI18n,
}
