import type { AppConfig } from '@tarojs/taro'

export default {
  pages: [
    // 此页面不能省略, 否则会出错,主要是为了进行公众号授权跳转
    'pages/homePage/index',
    'pages/login/index',
    'pages/we-chart/index',
    'pages/official-authorized/index',
    'pages/personal/index',
    'pages/index/index',
    'pages/mailing/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    custom: true,
    list: [{
      pagePath: 'pages/mailing/index',
      text: '邮寄',
    }, {
      pagePath: 'pages/personal/index',
      text: '我的',
    }],
  },
  lazyCodeLoading: 'requiredComponents',
} satisfies AppConfig
