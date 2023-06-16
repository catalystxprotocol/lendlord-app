import { hexToDecimalism, decimalismToHex } from '@/utils/decimalSystem';
import { defineStore } from 'pinia';
import type { GlobalState } from '@/types/interface/store.interface';
import type { IChainInfo } from '@/types/interface/index.interface';
import { getChainAPI } from '@/api/index';

export const useGlobalStore = defineStore({
    id: 'global',
    state: (): GlobalState => {
        return {
            chainId: '',
            account: '',
            show500: false,
            showMyWalletDialog: false,
            isWatchMetaMask: false,
            chains: [],
            isLoadingChainConfig: true,
            isErrorChainConfig: false
        };
    },
    getters: {
        isConnect(): Boolean {
            return Boolean(this.account);
        },
        chainsMapGetter(): { [key: string]: IChainInfo } {
            const chainMap: { [key: string]: IChainInfo } = {};
            this.chains.forEach((chain: IChainInfo) => {
                chainMap[chain.chainId] = chain;
            });
            return chainMap;
        },
        currentChainInfoGetter(): IChainInfo | undefined {
            return this.chainsMapGetter[this.chainId];
        }
    },
    persist: {
        key: 'global-store',
        paths: ['account']
    },
    actions: {
        async initStateAction() {
            const promiseArray = [];
            if (this.chains.length <= 0) {
                promiseArray.push(this.getChainsAction);
            }
            await Promise.all(promiseArray.map((item) => item()));
        },
        async getChainsAction(isNeedJudgeShow500 = true) {
            this.isLoadingChainConfig = true;
            this.isErrorChainConfig = false;
            try {
                const { data } = await getChainAPI();
                if (data?.list && data?.list.length > 0) {
                    this.chains = data.list.map((chainInfo) => {
                        const hexadecimal = decimalismToHex(chainInfo.chain_id);
                        return {
                            chainId: chainInfo.chain_id,
                            chainName: chainInfo.chain_name,
                            chainLogoUrl: chainInfo.icon_url,
                            grayChainLogoUrl: chainInfo.gray_icon_url,
                            explorerUrl: chainInfo.block_explorer_url + chainInfo.tx_hash_route,
                            nativeCurrency: chainInfo.native_currency,
                            contractAddress: {
                                marketContractAddress:
                                    chainInfo.contract_address.market_contract_address,
                                donftContractAddress:
                                    chainInfo.contract_address.donft_contract_address
                            },
                            addChainParameter: {
                                chainId: hexadecimal,
                                chainName: chainInfo.chain_name,
                                nativeCurrency: {
                                    name: chainInfo.native_currency.name,
                                    symbol: chainInfo.native_currency.symbol,
                                    decimals: chainInfo.native_currency.decimals
                                },
                                rpcUrls: [chainInfo.rpc_url], // 这个地址如果不对的话，metamask 会报错，并且会等待一段时间
                                blockExplorerUrls: [chainInfo.block_explorer_url],
                                iconUrls: [chainInfo.icon_url]
                            }
                        };
                    });
                    this.isErrorChainConfig = false;
                } else {
                    this.isErrorChainConfig = true;
                    this.chains = [];
                    if (isNeedJudgeShow500 === true) {
                        this.show500 = true;
                    }
                    console.log('Chain information is not configured');
                }
            } catch (error) {
                if (isNeedJudgeShow500 === true) {
                    this.show500 = true;
                }
                this.isErrorChainConfig = true;
                console.log('getChainsAction', error);
            } finally {
                this.isLoadingChainConfig = false;
            }
        },
        isSupportChain(metamaskChainId: string) {
            const decimalism = hexToDecimalism(metamaskChainId);
            // console.log(
            //     '16进制',
            //     metamaskChainId,
            //     '10进制',
            //     decimalism,
            //     Object.keys(this.chainsMapGetter)
            // );
            return Object.keys(this.chainsMapGetter).includes(decimalism);
        },
        logout() {
            this.account = '';
        }
    }
});
