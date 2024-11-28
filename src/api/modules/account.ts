import { getAccountApiUrl } from '@/utils/api'
import { requestClient } from '../request'

export namespace AccountApi {
  export interface WechatOfficialInfoVO {
    errcode: number
    errmsg: string
    openid: string
    subscribe: number
    unionid: string
  }
}

/*
获取是否关注公众号
/public/wechatOfficialInfo
 */
export function getWechatOfficialInfo(officialCode?: string) {
  return requestClient.post<AccountApi.WechatOfficialInfoVO>(getAccountApiUrl('/public/wechatOfficialInfo'), {
    officialCode,
  })
}

/*
取消微信绑定
/users/unbindWechat
 */
export function unbindWechat(userId: number) {
  return requestClient.post(getAccountApiUrl('/users/unbindWechat'), undefined, {
    params: { userId },
  })
}
