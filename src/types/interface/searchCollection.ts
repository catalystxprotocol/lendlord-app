import type { IResponsePageInfo } from '@/types/interface/index.interface';
import { IResponseMarketplaceListItem } from '@/types/interface/marketplace.interface';

export interface IRequestSearchCollectionList {
    collection_name: string;
}

export interface IResponseSearchCollection {
    list: IResponseMarketplaceListItem[];
    page_info: IResponsePageInfo;
}
