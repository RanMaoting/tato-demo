import type { AppConfig } from '@tarojs/taro'

export default {
  pages: [
    // 'pages/index/index',
    // 'pages/personal/index',
    'pages/login/index',
    'pages/we-chart/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  // tabBar: {
  //   custom: true,
  //   list: [{
  //     pagePath: 'pages/index/index',
  //     text: '首页',
  //   }, ],
  // },
} satisfies AppConfig
