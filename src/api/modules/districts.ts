import { getRMSApiUrl } from '@/utils/api'

import { requestClient } from '../request'

export namespace DistrictApi {
  export interface ParamsBO extends BaseParamsBO {
    code?: string
    districtId?: number
    level?: number
    parentCode?: string
    parentId?: number
  }

  export interface ListVO extends BaseListVO {
    children: ListVO[]
    code: string
    codeChain: string
    districtId: number
    hasChildren: boolean
    idChain: string
    level: number
    nameChain: string
    parentCode: string
    parentId: number
    shortName: string
  }
}

export function getDistricts(params: DistrictApi.ParamsBO) {
  return requestClient.get<BasePageVO<DistrictApi.ListVO>>(
    getRMSApiUrl('/districts'),
    {
      params,
    },
  )
}
