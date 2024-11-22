import type {
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type RequestResponse<T = any> = AxiosResponse<T>;

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults;

interface RequestInterceptorConfig {
  fulfilled?: (
    config: InternalAxiosRequestConfig,
  ) =>
    | InternalAxiosRequestConfig<any>
    | Promise<InternalAxiosRequestConfig<any>>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (response: AxiosResponse<T>) => AxiosResponse<T> | Promise<T> | T;
  rejected?: (error: any) => any;
}

type MakeErrorMessageFn<D> = (message: string, error: D) => void;

interface HttpResponse {
  /** The backend service response code */
  code: string;
  /** The backend service response message */
  msg: string;
}

export type {
  HttpResponse,
  MakeErrorMessageFn,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestResponse,
  ResponseInterceptorConfig,
};
