import { DEFAULT_DISPLAY_TEXT } from '@/constants';
import { useGlobalStore } from '@/store/modules/global';

export const isCursor = (text: string) => {
    return text && text !== DEFAULT_DISPLAY_TEXT;
};

export const toExplorer = (url: string) => {
    url && window.open(url);
};

export const getExplorerTxHashUrl = (chainId: string, txHash: string): string => {
    const globalStore = useGlobalStore();
    const currentChainInfo = globalStore.chainsMapGetter[chainId];
    let explorerTxHashUrl = '';
    if (currentChainInfo) {
        explorerTxHashUrl = currentChainInfo.explorerUrl + txHash;
    }
    return explorerTxHashUrl;
};
