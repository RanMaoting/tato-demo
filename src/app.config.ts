import type { AppConfig } from '@tarojs/taro'

export default {
  pages: [
    // 此页面不能省略, 否则会出错,主要是为了进行公众号授权跳转
    'pages/index/index',
    'pages/login/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: 'pages/index/index',
        text: 'index',
      },
      {
        pagePath: 'pages/login/index',
        text: 'index',
      },

    ],
  },
  lazyCodeLoading: 'requiredComponents',
} satisfies AppConfig
