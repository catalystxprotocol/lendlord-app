import { IChainInfo } from '@/types/interface/index.interface';

export interface GlobalState {
    chainId: string;
    account: string;
    show500: boolean;
    showMyWalletDialog: boolean;
    isWatchMetaMask: boolean;
    chains: IChainInfo[];
    isLoadingChainConfig: boolean;
    isErrorChainConfig: boolean;
}
