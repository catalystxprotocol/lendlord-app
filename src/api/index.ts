import request from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse, IResponseChain } from '@/types/interface/index.interface';

export const getChainAPI = () => {
    return request<IResponse<IResponseChain>>({
        url: API_URL.chainConfig,
        method: 'get'
    });
};
