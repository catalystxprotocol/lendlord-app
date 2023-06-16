import request from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import { IResCollectionsCount } from '@/types/interface/home.interface';

export const getCollectionsCountAPI = async () => {
    const url = `${API_URL.collectionSum}`;
    return request<IResponse<IResCollectionsCount>>({
        url,
        method: 'get'
    });
};
