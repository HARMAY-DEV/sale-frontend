import axios from 'axios';
import { Message } from 'element-ui';

import router from '@/router';
import { StorageKey } from '@/utils/consts';
import { Storage } from '@/utils/storage';

// 补充 TS 定义
declare module 'axios' {
  interface AxiosRequestConfig {
    cache?: boolean;
  }
}
// 过期时间 10 分钟
const EXPIRE_TIME = 10 * 60 * 1000;

const HEADER_PREFIX = 'Bearer'

export enum CancelType {
  CANCEL,
  CACHE,
}

const storage = new Map<string, any>();

const instance = axios.create({
  baseURL: '//121.41.171.62:8030',
  timeout: 60 * 1000,
});

// 缓存 HTTP 请求
instance.interceptors.request.use((config) => {
  if (!config.cache) return config;

  const source = axios.CancelToken.source();
  config.cancelToken = source.token;
  const result = storage.get(config.url!);
  
  if (result && Date.now() - result.timestamp <= EXPIRE_TIME) {
    source.cancel(JSON.stringify({ type: CancelType.CACHE, data: result.data }));
  }
  
  return config;
})


// 对返回数据做解构处理，直接返回需要的数据
instance.interceptors.response.use(({ data: { data, code, statusCode, message } = {}, status, config }) => {
  if (!data || status !== 200 || code !== 0 || statusCode !== 200) {
    return Promise.reject(new Error(message ?? 'unknown error'));
  }

  if (config.cache) {
    storage.set(config.url!, { data, timestamp: Date.now() });
  }

  return data;
}, (error) => {
  if (axios.isCancel(error)) {
    const { type, data } = JSON.parse(error.message);
    
    if (type === CancelType.CACHE) {
      return Promise.resolve(data);
    }

    return Promise.reject(new Error(data));
  }

  if (axios.isAxiosError(error) && error.response) {
    const { status, data: { statusCode, message } } = error.response;

    if ((status === 401 || statusCode === 401) && router.currentRoute.path !== '/login') {
      Storage.clear();
      Message.error({
        message: '您的登录状态已失效，请重新登录',
        onClose: () => router.push({ path: '/login' }),
      });
    }

    return Promise.reject(new Error(message));
  }

  return Promise.reject(error);
});

export type HttpParams = PlainObject | URLSearchParams;

class HttpService {
  constructor() {
    const token = Storage.getItem(StorageKey.TOKEN);

    if (token) {
      this.setAuthorizationToken(token);
    }
  }

  setAuthorizationToken(token: string) {
    if (!instance.defaults.headers) {
      instance.defaults.headers = { Authorization: token };
    } else {
      Object.values(instance.defaults.headers).forEach((header) => {
        Object.assign(header, { Authorization: `${HEADER_PREFIX} ${token}` });
      });
    }

    Storage.setItem(StorageKey.TOKEN, token);
  }

  get<T = any>(url: string, params?: HttpParams, cache = true): Promise<T> {
    return instance.get<T>(url, { params, cache }) as unknown as Promise<T>;
  }

  post<T = any>(url: string, data: any, params?: HttpParams): Promise<T> {
    return instance.post<T>(url, data, { params }) as unknown as Promise<T>;
  }

  delete<T = any>(url: string, data: any, params?: HttpParams): Promise<T> {
    return instance.delete(url, { data, params }) as unknown as Promise<T>;
  }
}

export default new HttpService();