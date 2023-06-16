import request from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import {
    IRequestSearchCollectionList,
    IResponseSearchCollection
} from '@/types/interface/searchCollection';

export const getSearchCollectionListAPI = async (params: IRequestSearchCollectionList) => {
    const url = API_URL.searchCollection;
    return request<IResponse<IResponseSearchCollection>>({
        url,
        method: 'get',
        params: {
            ...params
        }
    });
};
