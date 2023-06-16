import { AXIOS_TIMEOUT } from '@/constants';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import jsonBig from 'json-bigint';

const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_GO_API,
    timeout: AXIOS_TIMEOUT,
    transformResponse: (data) => {
        try {
            return jsonBig.parse(data);
        } catch (error) {
            console.error('error', error);
            try {
                return JSON.parse(data);
            } catch (error) {
                console.error('error', error);
                return data;
            }
        }
    }
});

// Request interceptors
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // do something
        return config;
    },
    (error: any) => {
        Promise.reject(error);
    }
);

// Response interceptors
service.interceptors.response.use(
    async (response: AxiosResponse) => {
        // do something
        return response.data;
    },
    (error: any) => {
        // do something
        return Promise.reject(error);
    }
);

export const CancelToken = axios.CancelToken;

export const executeCancel = (id: string) => {
    (window as any)[id] && (window as any)[id]();
    (window as any)[id] = null;
};

export const setExecuteCancel = (id: string) => {
    return new CancelToken(function executor(c) {
        (window as any)[id] = c;
    });
};

export const isAxiosCancel = axios.isCancel;
export const isAxiosError = axios.isAxiosError;
export { AxiosError } from 'axios';

export default service;
