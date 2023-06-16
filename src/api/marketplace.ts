import request from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import {
    IRequestMarketplaceList,
    IResponseMarketplace
} from '@/types/interface/marketplace.interface';

export const getMarketplaceListAPI = async (params: IRequestMarketplaceList) => {
    const url = API_URL.collectionList;
    return request<IResponse<IResponseMarketplace>>({
        url,
        method: 'get',
        params: {
            ...params
        }
    });
};
