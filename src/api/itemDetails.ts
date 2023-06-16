import request from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import {
    IResItemActivityList,
    IResNftDetailInfo,
    TableParam
} from '@/types/interface/itemDetails.interface';

export const getNftDetailInfoAPI = async (nftId: string, addr: string) => {
    const url = `${API_URL.nftDetail}${nftId}?user_addr=${addr}`;
    return request<IResponse<IResNftDetailInfo>>({
        url,
        method: 'get'
    });
};

export const getItemActivityList = async (param: TableParam) => {
    const url = `${API_URL.nftActivities}`;
    return request<IResponse<IResItemActivityList>>({
        url,
        method: 'get',
        params: param
    });
};
