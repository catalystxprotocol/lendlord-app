import request, { executeCancel, setExecuteCancel } from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import type {
    IRequestCollectionNftList,
    IResponseCollectionInfo,
    IResponseNftId,
    IResponseCollectionNftList,
    IRequestCollectionActiveList,
    IResponseCollectionActive
} from '@/types/interface/collectionDetails.interface';
import { searchNftIdCancel } from '@/constants/collectionDetails';

export const getCollectionInfoAPI = (collection_id: string) => {
    return request<IResponse<IResponseCollectionInfo>>({
        url: API_URL.collectionInfo,
        method: 'get',
        params: {
            collection_id
        }
    });
};

export const getNftIdAPI = (collection_id: string, token_id: string) => {
    executeCancel(searchNftIdCancel);
    return request<IResponse<IResponseNftId>>({
        url: API_URL.searchNftId,
        method: 'get',
        params: {
            collection_id,
            token_id
        },
        cancelToken: setExecuteCancel(searchNftIdCancel)
    });
};

export const getCollectionNftListAPI = (params: IRequestCollectionNftList) => {
    executeCancel('cancelGetColNftList');
    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const item = params[key];
            if (item === undefined || item === null) {
                delete params[key];
            }
        }
    }
    return request<IResponse<IResponseCollectionNftList>>({
        url: API_URL.nftListFromCollection,
        method: 'get',
        params: {
            ...params
        },
        cancelToken: setExecuteCancel('cancelGetColNftList')
    });
};

export const getCollectionActiveList = (param: IRequestCollectionActiveList) => {
    executeCancel('cancelGetColActList');
    return request<IResponse<IResponseCollectionActive>>({
        url: API_URL.nftActivityFromCollection,
        method: 'get',
        params: param,
        cancelToken: setExecuteCancel('cancelGetColActList')
    });
};
