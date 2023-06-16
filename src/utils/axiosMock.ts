import { AXIOS_TIMEOUT } from '@/constants';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import jsonBig from 'json-bigint';

const serviceMock = axios.create({
    baseURL: '',
    timeout: AXIOS_TIMEOUT,
    transformResponse: (data) => {
        try {
            return jsonBig.parse(data);
        } catch {
            return data;
        }
    }
});

// Request interceptors
serviceMock.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // do something
        return config;
    },
    (error: any) => {
        Promise.reject(error);
    }
);

// Response interceptors
serviceMock.interceptors.response.use(
    async (response: AxiosResponse) => {
        // do something
        return response.data;
    },
    (error: any) => {
        // do something
        return Promise.reject(error);
    }
);

export default serviceMock;
