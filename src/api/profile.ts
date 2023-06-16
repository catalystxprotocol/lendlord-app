import request, { executeCancel, setExecuteCancel } from '@/utils/axios';
import { API_URL, urlReplacePlaceholder } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import type {
    IResponseCollectionList,
    IRequestNftList,
    IResponseNftList
} from '@/types/interface/profile.interface';

export const getUserCollectionListAPI = async (address: string) => {
    const url = API_URL.userCollectionList.replace(urlReplacePlaceholder, address);
    return request<IResponse<IResponseCollectionList>>({
        url,
        method: 'get'
    });
};

export const getNftListAPI = async (params: IRequestNftList) => {
    executeCancel('cancelNftlist');
    const url = API_URL.nftList.replace(urlReplacePlaceholder, params.address);
    const requestParams: any = { ...params };
    delete requestParams.address;
    return request<IResponse<IResponseNftList>>({
        url,
        method: 'get',
        params: requestParams,
        cancelToken: setExecuteCancel('cancelNftlist')
    });
};
