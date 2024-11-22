import { getAccountApiUrl } from "@/utils/api"
import { requestClient } from "../request"
import { SmsCodeTypeEnum, WechatTokenTypeEnum } from "@/enums"

export namespace UserApi {

  export interface SmsWechatTokenBO {
    code: string,
    phone: string,
    smsCode: string,
    type: WechatTokenTypeEnum
  }

  export interface WechatTokenWithPasswordBO {
    username: string
    password: string
    code: string
    type: WechatTokenTypeEnum
  }
  export interface WechatTokenBO {
    code: string
    type: WechatTokenTypeEnum
  }

  export interface WechatTokenVO {
    access_token: string,
    changePassword: true,
    changePasswordReason: string,
    checkValidateRemark: string,
    cookie: string,
    expires_in: number,
    passwordRegex: string,
    passwordRegexRemark: string,
    refresh_expires_in: number,
    refresh_token: string,
    token_type: string
  }

  export interface SmsCodeBO {
    checkUser?: boolean,
    phone: string,
    type: SmsCodeTypeEnum
  }
}

/*
微信:通过code换取token请求, 当第一次登录时将报错, 请使用-wechatTokenWithPassword接口
/users/wechatToken
*/
export function wechatToken(params: UserApi.WechatTokenBO) {
  return requestClient.post<UserApi.WechatTokenVO>(getAccountApiUrl('/users/wechatToken'), params, {
    hideMessage: true
  })
}


/*
微信:短信验证码获取token并绑定code
/users/smsWechatToken
 */
export function smsWechatToken(params: UserApi.SmsWechatTokenBO) {
  return requestClient.post<UserApi.WechatTokenVO>(getAccountApiUrl('/users/smsWechatToken'), params, {
    hideMessage: true
  })
}

/*
微信:用户名密码获取token并绑定code
/users/smsWechatToken */
export function wechatTokenWithPassword(params: UserApi.WechatTokenWithPasswordBO) {
  return requestClient.post<UserApi.WechatTokenVO>(getAccountApiUrl('/users/wechatTokenWithPassword'), params, {
    hideMessage: true
  })
}


/*
发送短信验证码
/users/smsCode
*/
export function smsCode(params: UserApi.SmsCodeBO) {
  return requestClient.post(getAccountApiUrl('/users/smsCode'), params, {
    hideMessage: true
  })
}
