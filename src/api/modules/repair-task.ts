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
    id: number
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
}

export function addRepairTask(data: RepairTaskApi.RepairTaskAddBO) {
  return requestClient.post(getRMSApiUrl('/repairTask'), data)
}
