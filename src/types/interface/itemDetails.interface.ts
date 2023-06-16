import { IResponsePageInfo } from '@/types/interface/index.interface';

export interface ItemDetailInfo {
    collectionName: string;
    collectionImg: string | number;
    tokenId: string;
    owner: string;
    user: string;
    rentAfter: string | number;
    availableUntil: number | string;
    availableUntilMin: number | string;
    price: string | number;
    priceIcon: string;
    priceUnit: string;
    rentPeriod: string | number;
    rentPeriodUnit: string;
    nftStatus: number | string;
    nftId: number;
}

export interface TableItem {
    event: string | number;
    lender: string;
    renter: string;
    price: string | number;
    ratedDuration: string | number;
    date?: string | number;
    icon: string;
    lendEndTimestamp?: number | string;
    startTimestamp?: number | string;
    dateNormal?: string;
    dateUTC?: string | undefined;
    explorerTxHashUrl: string;
}

export interface TableParam {
    nft_id: number;
    page_size: number;
    page_number: number;
    event_type?: number | string;
}

export interface PaymentTokenInfo {
    chain_id?: string;
    symbol: string;
    decimals: number;
    icon: string;
}

export interface IResNftDetailInfo {
    chain_id: string;
    nft_addr: string;
    nft_id: number;
    nft_token_id: string;
    nft_owner: string;
    nft_user: string;
    onft_id: string;
    onft_addr: string;
    end_timestamp: number | string;
    price: number | string;
    lend_min_duration: number | string;
    lend_end_timestamp: number | string;
    nft_status: number | string;
    nft_image: number | string;
    nft_name: string;
    collection_name: string;
    payment_token_info: PaymentTokenInfo;
}

export interface IResItemActivityListItem {
    event: number;
    lender: string;
    renter: string;
    price: number | string;
    rent_min_duration: number | string;
    end_timestamp: number | string;
    start_timestamp: number | string;
    tx_hash: string;
    chain_id: string;
    payment_token_info: PaymentTokenInfo;
}
export interface IResItemActivityList {
    list: IResItemActivityListItem[];
    page_info: IResponsePageInfo;
}
