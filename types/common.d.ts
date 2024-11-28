declare interface BaseVO<T = number> {
  id: T
  name: string
}

declare interface BasicUserInfo {
  homePath?: string
  id: number
  name: string
  roleAuthorities: string[]
  selfAuthorities: string[]
  totalAuthorities: string[]
  userId: number
  username: string
}

declare type DeepNullable<T> = T extends object
  ? {
      [P in keyof T]: DeepNullable<T[P]> | null;
    }
  : T

declare interface BaseParamsBO {
  createdBy?: number
  dataOwner?: string
  enabled?: boolean
  filialeId?: number
  freeQuery?: string
  idNI?: string
  ids?: string
  order?: string
  page?: number
  searchKey?: string
  size?: number
  sort?: string
}
declare interface BasePageVO<T = any> {
  content: T[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  pageable: {
    offset: number
    paged: boolean
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    unpaged: boolean
  }
  size: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  totalElements: number
  totalPages: number
}
declare interface BaseListVO<T = number> extends BaseVO<T> {
  createdBy: number
  createdDate: string
  dataOwner: string
  enabled: boolean
  filialeId: number
  lastModifiedBy: number
  lastModifiedDate: string
  operationTypes: string[]
}

declare interface BaseAddBO {
  dataOwner?: string
  filialeId?: number
  thirdCreated?: boolean
  thirdId?: string
}
