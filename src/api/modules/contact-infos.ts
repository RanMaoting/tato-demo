import type { ContactInfoSystemTypeEnum } from '@/enums'

import { getRMSApiUrl } from '@/utils/api'

import { requestClient } from '../request'

export namespace ContactInfoApi {
  export interface ParamsBO extends BaseParamsBO {
    customerId?: number
    systemType?: ContactInfoSystemTypeEnum
    userName?: string
  }

  export interface AddBO extends BaseAddBO {
    address: string
    city: string
    country: string
    county: string
    customerId?: number
    defaultContact: boolean
    phone: string
    postalCode?: string
    province: string
    systemType: ContactInfoSystemTypeEnum
    userName: string
  }

  export interface ListVO
    extends Omit<AddBO, 'customerId' | keyof BaseAddBO>,
    Omit<BaseListVO, 'name'> {
    customer: BaseVO
  }
}

export function getContactInfos(params: ContactInfoApi.ParamsBO) {
  return requestClient.get<BasePageVO<ContactInfoApi.ListVO>>(
    getRMSApiUrl('/contactInfos'),
    {
      params,
    },
  )
}

/*
详情
/contactInfos/{id}
 */
export function getContactInfoDetail(id: number) {
  return requestClient.get<ContactInfoApi.ListVO>(getRMSApiUrl(`/contactInfos/${id}`))
}

export function addContactInfo(params: DeepNullable<ContactInfoApi.AddBO>) {
  return requestClient.post<number>(getRMSApiUrl('/contactInfos'), params)
}

export function updateContactInfo(
  params: DeepNullable<ContactInfoApi.AddBO>,
  id: number,
) {
  return requestClient.put(getRMSApiUrl(`/contactInfos/${id}`), params)
}

export function deleteContactInfo(id: number) {
  return requestClient.delete(getRMSApiUrl(`/contactInfos/${id}`))
}

export function batchDeleteContactInfos(ids: number[]) {
  return requestClient.post(getRMSApiUrl('/contactInfos/batchDelete'), { ids })
}
