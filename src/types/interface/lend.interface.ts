export interface IPaymentTokenItem {
    icon: string;
    symbol: string;
    name: string;
    decimals: number;
    is_origin: boolean;
    payment_token_addr: string;
}

export interface IResponseLendInfo {
    collection_name: string;
    nft_token_id: string;
    nft_image: string;
    nft_owner: string;
    lender_addr: string;
    onft_id: string;
    onft_addr: string;
    chain_id: string;
    donft_id: string;
    donft_addr: string;
    service_fee: number;
    is_allow_lend: boolean;
    payment_token_list: IPaymentTokenItem[];
}

export interface TokenOptionItem extends IPaymentTokenItem {
    imgUrl: string;
    label: string;
    value: string;
}
