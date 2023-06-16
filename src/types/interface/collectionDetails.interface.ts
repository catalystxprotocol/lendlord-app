import type {
    IRequestPagination,
    IResponsePageInfo,
    IResponsePaymentTokenInfo
} from '@/types/interface/index.interface';
export interface StatusListItem {
    label: string;
    value: string | number;
}

export interface PriceTokenOptionItem {
    imgUrl: string;
    label: string;
    value: string;
}

export interface RentalDurationParams {
    min: string;
    max: string;
}
export interface PriceSupplyFnParams extends RentalDurationParams {
    tokenId: string;
    symbol: string;
    decimals: number;
}
export interface TabListItem {
    key: string;
    show: boolean;
    prefixText: string;
    text: string;
    suffixText?: string;
    tokenId?: string;
    value?: string;
    min?: string;
    max?: string;
    closeFn: Function;
}

export interface IResponseCollectionInfo {
    timestamp: number;
    service_fee: number;
    collection_name: string;
    collection_image: string;
    chain_name: string;
    official_website: string;
    discord: string;
    twitter: string;
    chain_browser: string;
    chain_browser_icon: string;
    floor_price: string;
    total_listed: string;
    available_for_rent: string;
    supply: string;
    payment_token_info: IResponsePaymentTokenInfo;
}

export interface IResponseNftId {
    nft_id: number;
}

export interface IRequestCollectionNftList extends IRequestPagination {
    collection_id: string;
    status?: number;
    token_symbol?: string;
    min_price?: string;
    max_price?: string;
    min_duration?: string;
    max_duration?: string;
}

export enum NftDisplayStatus {
    listed = 1, // 可租赁
    rented = 2, // 租赁中
    idle = 3 // 未挂单
}

export interface IResponseCollectionNftListItem {
    nft_image: string;
    nft_id: number;
    nft_token_id: string;
    lender_price: string;
    lender_min_duration: number;
    lender_start_timestamp: number;
    lender_end_timestamp: number;
    renter_end_timestamp: number;
    nft_display_status: NftDisplayStatus;
    payment_token_info: IResponsePaymentTokenInfo;
}

export interface IResponseCollectionNftList {
    list: IResponseCollectionNftListItem[];
    page_info: IResponsePageInfo;
}

export interface CollectionCardNftItem {
    nftId: string;
    imageUrl: string;
    tokenId: string;
    dateDisplay: string;
    isShowDateAndButton: boolean;
    buttonText: string;
    isHoverSwitchButton: boolean;
    isMask?: boolean;
    maskFirstText?: string;
    maskSecondText?: string;
    buttonClickFn?: Function;
}

export interface IRequestCollectionActiveList {
    collection_id: string;
    event_type?: number | undefined;
    page_size: number;
    page_number: number;
}

export interface IResponseCollectionActiveListItem {
    event: number;
    nft_id: number;
    token_id: string;
    nft_image: string;
    lender: string;
    renter: string;
    price: string;
    min_duration: number;
    start_timestamp: number;
    end_timestamp: number;
    tx_hash: string;
    chain_id: string;
    payment_token_info: IResponsePaymentTokenInfo;
}

export interface IResponseCollectionActive {
    list: IResponseCollectionActiveListItem[];
    page_info: IResponsePageInfo;
}

export enum collectionActiveQueryStatus {
    Listed = 1,
    Renting = 3
}
