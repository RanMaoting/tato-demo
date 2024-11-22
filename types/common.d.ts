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
  : T;
