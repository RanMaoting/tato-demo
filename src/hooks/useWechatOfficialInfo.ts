import { getWechatOfficialInfo } from "@/api/modules/public";
import Taro from "@tarojs/taro";

export function useWechatOfficialInfo() {
  // 不带公众号id调用接口是查询, 带公众号id调用接口是绑定
  function handleWechatOfficialInfo() {
    getWechatOfficialInfo().then(({ subscribe, openid }) => {
      if (Boolean(subscribe)) {
        // 已经关注公众号,直接跳转至该用户的主页
      } else {
        // 如果openid存在,则是历史上关注过公众号
        if (openid) { }
        else {
          Taro.reLaunch({
            url: '/pages/we-chart/index'
          })
        }
        console.log(123);

      }

    })
  }
  return {
    handleWechatOfficialInfo
  }
}
