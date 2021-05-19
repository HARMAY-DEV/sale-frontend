import axios from 'axios';

const instance = axios.create({
  baseURL: '//127.0.0.1:7001',
  timeout: 5 * 1000,
});

instance.interceptors.response.use(({ data: { data, code, statusCode, message } = {}, status }) => {
  if (!data || status !== 200 || code !== 0 || statusCode !== 200) {
    return Promise.reject(new Error(message ?? 'unknown error'));
  }

  return data;
}, (error) => Promise.reject(error))

export type HttpParams = PlainObject | URLSearchParams;

class HttpService {
  get<T>(url: string, params?: HttpParams): Promise<T> {
    return instance.get<T>(url, { params }) as unknown as Promise<T>;
  }

  post<T>(url: string, data: any, params?: HttpParams): Promise<T> {
    return instance.post<T>(url, data, { params }) as unknown as Promise<T>;
  }

  delete<T>(url: string, data: any, params?: HttpParams): Promise<T> {
    return instance.delete(url, { data, params }) as unknown as Promise<T>;
  }
}

export default new HttpService();