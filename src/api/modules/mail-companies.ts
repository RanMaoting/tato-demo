import { getRMSApiUrl } from '@/utils/api'

import { requestClient } from '../request'

export namespace MailCompaniesApi {
  export interface AddBO extends BaseAddBO {
    apiUrl: string
    appKey: string
    appSecret: string
    type: string
    name: string
    valid: boolean
  }
  export interface ListVO extends BaseListVO, Omit<AddBO, keyof BaseAddBO> { }
  export interface ParamsBO extends BaseParamsBO {
    type?: string
    valid?: boolean
  }

  export interface DetailVO extends ListVO {
    appSecret: string
  }
}

export function getMailCompanies(params: MailCompaniesApi.ParamsBO) {
  return requestClient.get<BasePageVO<MailCompaniesApi.ListVO>>(
    getRMSApiUrl('/mailCompanies'),
    {
      params,
    },
  )
}

export function getMailCompanyDetail(id: number) {
  return requestClient.get<MailCompaniesApi.DetailVO>(
    getRMSApiUrl(`/mailCompanies/${id}`),
  )
}
