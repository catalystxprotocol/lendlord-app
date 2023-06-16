import type {
    IResponsePageInfo,
    IResponsePaymentTokenInfo
} from '@/types/interface/index.interface';

export interface IRequestMarketplaceList {
    chain_id: string;
    page_size: number;
    page_number: number;
}

export interface IResponseMarketplaceListItem {
    collection_id: number;
    collection_name: string;
    collection_image: string;
    floor_price: string;
    total_listed: number;
    available_for_rent: number;
    supply: number;
    payment_token_info: IResponsePaymentTokenInfo;
}

export interface IResponseMarketplace {
    list: IResponseMarketplaceListItem[];
    page_info: IResponsePageInfo;
}
