import { AddEthereumChainParameter } from '@/types/interface/matemask.interface';
/*************** req ***********************/
export interface IRequestPagination {
    page_number?: number;
    page_size?: number;
}

/*************** res *************************/

export interface IResError {
    code: string;
    message: string;
}

export interface IResponse<P = {}> {
    data?: P;
    error?: IResError;
}

export interface IResponsePageInfo {
    page_size: number;
    page_number: number;
    total_record_count: number;
    total_page_count: number;
}

export interface IResponsePaymentTokenInfo {
    chain_id: string;
    symbol: string;
    decimals: string;
    icon: string;
}

export interface IResponseNativeCurrency {
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
}

export interface IResponseChainItem {
    chain_id: string;
    chain_name: string;
    rpc_url: string;
    block_explorer_url: string;
    tx_hash_route: string;
    icon_url: string;
    gray_icon_url: string;
    native_currency: IResponseNativeCurrency;
    contract_address: {
        market_contract_address: string;
        donft_contract_address: string;
    };
}

export interface IResponseChain {
    list: IResponseChainItem[];
}

export interface IChainInfo {
    chainId: string;
    chainName: string;
    chainLogoUrl: string;
    grayChainLogoUrl: string;
    explorerUrl: string;
    nativeCurrency: IResponseNativeCurrency;
    contractAddress: {
        marketContractAddress: string;
        donftContractAddress: string;
    };
    addChainParameter: AddEthereumChainParameter;
}
