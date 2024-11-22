import { getAccountApiUrl } from "@/utils/api"
import { requestClient } from "../request"

export namespace PublicApi {
  export interface WechatOfficialInfoVO {
    errcode: number,
    errmsg: string,
    openid: string,
    subscribe: number,
    unionid: string
  }
}

/*
获取是否关注公众号
/public/wechatOfficialInfo
 */
export function getWechatOfficialInfo(officialCode?: string) {
  return requestClient.post<PublicApi.WechatOfficialInfoVO>(getAccountApiUrl('/public/wechatOfficialInfo'), {
    officialCode
  })
}
