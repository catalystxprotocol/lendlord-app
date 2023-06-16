import request from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import type { IResponseLendInfo } from '@/types/interface/lend.interface';

export const getLendInfoAPI = async (nftId: string) => {
    const url = API_URL.nftLendInfo + nftId;
    return request<IResponse<IResponseLendInfo>>({
        url,
        method: 'get'
    });
};
