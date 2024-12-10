import type { PayMethodEnum } from '@/enums'
import { getRMSApiUrl } from '@/utils/api'
import { requestClient } from '../request'

export namespace RepairTaskApi {
  interface ReceiverBO {
    address: string
    city: string
    country: string
    county: string
    name: string
    phone: string
    province: string
  }

  interface SenderBO {
    address: string
    city: string
    country: string
    county: string
    name: string
    phone: string
    province: string
  }
  interface InfoBO {
    insure: number
    insureType: string
    itemInfo: string
    orderNumber?: string
    payMethod: PayMethodEnum
    receiver: ReceiverBO
    remark: string
    sender: SenderBO
  }
  export interface MailBO {
    finished: boolean
    id?: number
    info: InfoBO
    mailCompany: string
    mailCompanyNumber?: string
    nextResponsibleUserIds?: number[]
    nodeRemark: string
    responsibleUserIds: number[]
    warrantyDays?: number
  }
  export interface RepairTaskAddBO {
    customerMail: MailBO
  }

  export interface mailInsureListVO {
    mailCompany: string
    name: string
    type: string
  }
}

/*
新增入库
*/
export function addRepairTask(data: RepairTaskApi.RepairTaskAddBO) {
  return requestClient.post(getRMSApiUrl('/repairTask'), data)
}

/*
保价类型
/repairTasks/mailInsures
 */
export function getRepairTaskMailInsures(type: string) {
  return requestClient.get<RepairTaskApi.mailInsureListVO[]>(getRMSApiUrl('/repairTasks/mailInsures'), {
    params: { type },
  })
}
