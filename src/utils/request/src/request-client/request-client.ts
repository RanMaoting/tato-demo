import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios'

import type { RequestClientOptions } from './types'

import { bindMethods } from '@/utils/shard'
import axios from 'axios'
import { defu } from 'defu'
import { InterceptorManager } from './modules/interceptor'

class RequestClient<D extends Record<string, any> = any> {
  private readonly instance: AxiosInstance

  public addRequestInterceptor: InterceptorManager['addRequestInterceptor']
  public addResponseInterceptor: InterceptorManager['addResponseInterceptor']

  // 是否正在刷新token
  public isRefreshing = false
  // 刷新token队列
  public refreshTokenQueue: ((token: string) => void)[] = []

  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: RequestClientOptions = {}) {
    // 合并默认配置和传入的配置
    const defaultConfig: CreateAxiosDefaults = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      // 默认超时时间
      timeout: 10_000,
    }
    const { ...axiosConfig } = options
    const requestConfig = defu(axiosConfig, defaultConfig)
    this.instance = axios.create(requestConfig)

    bindMethods(this)

    // 实例化拦截器管理器
    const interceptorManager = new InterceptorManager(this.instance)
    this.addRequestInterceptor
      = interceptorManager.addRequestInterceptor.bind(interceptorManager)
    this.addResponseInterceptor
      = interceptorManager.addResponseInterceptor.bind(interceptorManager)
  }

  /**
   * DELETE请求方法
   */
  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig & D,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'DELETE',
    } as AxiosRequestConfig & D)
  }

  /**
   * GET请求方法
   */
  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig & D,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'GET',
    } as AxiosRequestConfig & D)
  }

  /**
   * POST请求方法
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & D,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      data,
      method: 'POST',
    } as AxiosRequestConfig & D)
  }

  /**
   * PUT请求方法
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & D,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      data,
      method: 'PUT',
    } as AxiosRequestConfig & D)
  }

  /**
   * 通用的请求方法
   */
  public async request<T>(
    url: string,
    config: AxiosRequestConfig & D,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance({
        url,
        ...config,
      })
      return response as T
    }
    catch (error: any) {
      throw error.response ? error.response.data : error
    }
  }
}

export { RequestClient }
