import { isObject } from '@tarojs/shared'
import { ref, shallowRef, toRaw, unref } from 'vue'

type ExtractFunctionPromiseReturnType<T> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R extends any[]
    ? R
    : R extends { content: infer C }
      ? C extends any[]
        ? C
        : never
      : never
  : never

export function useList<T extends (...args: any) => Promise<Awaited<any>>>(
  api: T,
  ...args: Partial<Parameters<T>>
) {
  type ParamsType =
    Parameters<T> extends [infer P, ...any]
      ? P extends object
        ? P
        : never
      : never

  const params = ref<ParamsType>({} as ParamsType)

  if (args.length > 0) {
    params.value = args[0] as ParamsType
  }

  const list = shallowRef<ExtractFunctionPromiseReturnType<T>>([] as any)

  const loading = ref(false)

  function getList(...rest: Partial<Parameters<T>>) {
    loading.value = true
    let arr: any[] = []
    if (rest.length > 0) {
      arr = isObject(rest[0])
        ? ([Object.assign({}, unref(params) as any, rest[0]), ...rest.slice(1)] as any)
        : rest
    }
    else {
      arr = [unref(params), ...args.slice(1)] as any
    }

    return new Promise<ExtractFunctionPromiseReturnType<T>>(
      (resolve, reject) => {
        api(...arr)
          .then((res) => {
            list.value = Array.isArray(res) ? res : res?.content || []
            resolve(toRaw(list.value))
          })
          .catch(error => reject(error))
          .finally(() => {
            loading.value = false
          })
      },
    )
  }

  return {
    params,
    getList,
    list,
    loading,
  }
}
