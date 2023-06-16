import type {
    IRequestPagination,
    IResponsePageInfo,
    IResponsePaymentTokenInfo
} from '@/types/interface/index.interface';

export interface IRequestNftList extends IRequestPagination {
    address: string;
    status?: string;
    collection_id?: string;
}

export interface IResponseCollectionListItem {
    id: string;
    name: string;
}

export interface IResponseCollectionList {
    list: IResponseCollectionListItem[];
    page_info: IResponsePageInfo;
}

export enum NftStatus {
    idle = 1,
    listed = 2,
    listedAndDeal = 3,
    rented = 4,
    idelOwner = 5
}

export interface IResponseNftListItem {
    nft_id: number;
    nft_token_id: string;
    nft_addr: string;
    nft_owner: string;
    chain_id: number;
    nft_status: NftStatus; // 枚举
    collection_name: string;
    end_timestamp: number;
    lender_price: string;
    lent_min_duration: number;
    lend_end_timestamp: number;
    use_link: string;
    nft_image: string;
    nft_name: string;
    onft_id: string;
    payment_token_info: IResponsePaymentTokenInfo;
}

export interface IResponseNftList {
    page_info: IResponsePageInfo;
    list: IResponseNftListItem[];
}

export interface DropdownOptionItem {
    label: string;
    value: string;
}

export interface NftCardItem {
    nftId: number;
    imageUrl: string;
    tokenId: string;
    collectionName: string;
    dateLabel: string;
    dateValue: string;
    buttonText: string;
    isGhostButton: boolean;
    disableButton: boolean;
    buttonClickFn: Function;
    isMask: boolean;
    maskFirstText: string;
    maskSecondText: string;
}
