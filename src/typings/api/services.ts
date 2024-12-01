import { RequestConfig } from '@typings/api';
import { AxiosResponse } from 'axios';

export type Response<T> = AxiosResponse<T>;

export interface ServiceFetchProps<P = RequestConfig['params']> {
  params?: P;
  id?: string | number;
}

export type ServiceFetchType<T, P = RequestConfig['params']> = (
  props: ServiceFetchProps<P>
) => Promise<Response<T>>;
