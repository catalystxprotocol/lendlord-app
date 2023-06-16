import { useToConnectedProfile } from '@/composables/index';
import Web3 from 'web3';
import { AddEthereumChainParameter } from '@/types/interface/matemask.interface';
import detectEthereumProvider from '@metamask/detect-provider';
import { useGlobalStore } from '@/store/modules/global';
import { METAMASK_URL } from '@/constants';
import { MyToast } from '@/utils/toast';
import { toastStatusEnum } from '@/constants/index';
import marketAbi from '@/assets/contract/market_abi.json';
import erc4907Abi from '@/assets/contract/erc4907_abi.json';
import { hexToDecimalism } from '@/utils/decimalSystem';

export const getIsInstallMetaMask = async (
    timeout = 0,
    mustBeMetaMask = true,
    silent = false
): Promise<boolean> => {
    const provider = await detectEthereumProvider({
        mustBeMetaMask: mustBeMetaMask,
        silent: silent,
        timeout: timeout
    });
    return Boolean(provider);
};

export const getMetaMaskAccount = async (): Promise<string[]> => {
    return await window.ethereum.request({
        method: 'eth_accounts'
    });
};

export const connectMetaMaskOrGetAccount = async (): Promise<string[]> => {
    return await window.ethereum.request({
        method: 'eth_requestAccounts'
    });
};

export const getMetaMaskChainID = async (): Promise<string> => {
    return await window.ethereum.request({
        method: 'eth_chainId'
    });
};

export const switchMetaMaskChain = async (chainId: string) => {
    return await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }]
    });
};

export const addChainToMetaMask = async (chainParameter: AddEthereumChainParameter[]) => {
    // 深克隆一下，不然 metamask 会报错，Proxy object could not be cloned.
    const temp = chainParameter.map((chain) => {
        return JSON.parse(JSON.stringify(chain));
    });
    return await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: temp
    });
};

export const switchOrAddChainToMetaMask = async (
    chainId: string,
    chainParameter: AddEthereumChainParameter[]
) => {
    try {
        await switchMetaMaskChain(chainId);
    } catch (switchError: any) {
        if (switchError?.code === 4902) {
            console.log('添加链的信息', chainParameter);
            // 当前钱包不支持此网络，无法切换需要添加网络
            try {
                await addChainToMetaMask(chainParameter);
            } catch (error) {
                console.log('addChainToMetaMask', error);
                throw error;
            }
        } else {
            console.log('switchOrAddChainToMetaMask', switchError);
            throw switchError;
        }
    }
};

export const onMetaMask = () => {
    const globalStore = useGlobalStore();
    if (!globalStore.isWatchMetaMask) {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
            const account = accounts[0];
            globalStore.account = account;
            console.log('accountsChanged', account);
        });
        window.ethereum.on('chainChanged', (chainId: string) => {
            const productChainId = hexToDecimalism(chainId);
            if (globalStore.isSupportChain(productChainId)) {
                globalStore.chainId = productChainId;
            } else {
                // 弹框提示用户切换到了不支持的链
                MyToast.submitResult(
                    toastStatusEnum.warning,
                    'App network doesn’t match to network selected in wallet'
                );
            }
            console.log('chainChanged', chainId);
        });
        globalStore.isWatchMetaMask = true;
    }
};

export const connectMetaMask = async () => {
    const isInstall = await getIsInstallMetaMask();
    if (isInstall) {
        try {
            const [account] = await connectMetaMaskOrGetAccount();
            const globalStore = useGlobalStore();
            globalStore.account = account;
            onMetaMask();
        } catch (error) {
            throw error;
        }
    } else {
        window.open(METAMASK_URL);
    }
};

export const initMetaMask = async () => {
    const isInstall = await getIsInstallMetaMask();
    const globalStore = useGlobalStore();
    if (isInstall) {
        const [metamaskAccount] = await getMetaMaskAccount();
        const handleChainId = async () => {
            const metaMaskChainId = await getMetaMaskChainID();
            const productChainId = hexToDecimalism(metaMaskChainId);
            if (globalStore.isSupportChain(productChainId)) {
                globalStore.chainId = productChainId;
            } else {
                globalStore.chainId = globalStore.chains?.[0]?.chainId || '';
            }
        };
        if (metamaskAccount && globalStore.account) {
            globalStore.account = metamaskAccount;
            onMetaMask();
            await handleChainId();
        } else {
            globalStore.account = '';
            await handleChainId();
        }
    } else {
        globalStore.account = '';
        globalStore.chainId = globalStore.chains?.[0]?.chainId || '';
    }
};

export const lendContract = async (
    marketContractAddress: string,
    isMint: boolean,
    params: {
        erc4907NftAddress: string;
        pricePerDay: string;
        doNftAddress: string;
        maxEndTime: string;
        erc4907NftId: string;
        paymentToken: string;
        minDuration: string;
        orderType: number;
        privateOrderRenter: string;
        doNftId: string;
    },
    explorerUrl: string,
    callBack: Function
) => {
    const {
        erc4907NftAddress,
        pricePerDay,
        doNftAddress,
        maxEndTime,
        erc4907NftId,
        paymentToken,
        minDuration,
        orderType,
        privateOrderRenter,
        doNftId
    } = params;
    // 1.实例化 web3,此处注意使用metamask的provider(这样的话，才能调用metamask进行签名和广播)
    const web3 = new Web3((window as any).ethereum);

    // 2.实例化智能合约 参数：智能合约的abi、智能合约的地址
    const marketContract = new web3.eth.Contract(marketAbi as any, marketContractAddress);
    const erc4907Contract = new web3.eth.Contract(erc4907Abi as any, erc4907NftAddress);
    // 通过nftid对应后端的nft_token_id，查询该nft 的owner
    // erc4907Contract.methods.ownerOf('2').call().then(res => console.log(res))

    // 3.获取metamask地址
    const accounts = await connectMetaMaskOrGetAccount();
    const account = accounts[0];

    try {
        const isApproved = await erc4907Contract.methods
            .isApprovedForAll(account, doNftAddress)
            .call();
        console.log('isApproved', isApproved);
        if (!isApproved) {
            // 授权
            try {
                const res = await erc4907Contract.methods
                    .setApprovalForAll(doNftAddress, true)
                    .send({ from: account })
                    .on('transactionHash', (hash: string) => {
                        console.log('授权 hash:', hash);
                    });
                console.log('授权', res);
            } catch (error) {
                MyToast.submitResult(toastStatusEnum.failed, 'Access Denied');
                callBack();
                console.log(error);
                return;
            }
        }
    } catch (error) {
        MyToast.submitResult(toastStatusEnum.failed, 'Contract Address Error');
        callBack();
        console.log(error);
        return;
    }

    // 4.调用合约方法 + 签名 + 广播，一键
    let txHash;
    try {
        const methodsParams = isMint
            ? [
                  erc4907NftAddress,
                  pricePerDay,
                  doNftAddress,
                  maxEndTime,
                  erc4907NftId,
                  paymentToken,
                  minDuration,
                  orderType,
                  privateOrderRenter
              ]
            : [
                  doNftAddress,
                  maxEndTime,
                  orderType,
                  doNftId,
                  paymentToken,
                  pricePerDay,
                  privateOrderRenter,
                  minDuration
              ];
        console.log(isMint ? 'mintAndCreateLendOrder' : 'createLendOrder', methodsParams);
        console.log(...methodsParams);
        const res = await marketContract.methods[
            isMint ? 'mintAndCreateLendOrder' : 'createLendOrder'
        ](...methodsParams)
            .send({ from: account })
            .on('transactionHash', (hash: string) => {
                //5.通过监听的方式，快速获取交易hash
                //  弹窗 处理中
                MyToast.submitResult(toastStatusEnum.processing, '', `${explorerUrl}${hash}`);
                // 交易签名成功，跳转到profile
                setTimeout(() => {
                    useToConnectedProfile(true);
                }, 600);
                txHash = hash;
                callBack();
                console.log('hash:', hash);
            });
        // 6.res 此时已成功上链，res 中有交易状态
        // 弹框 成功或者失败
        if (res.status) {
            MyToast.submitResult(toastStatusEnum.success, '', `${explorerUrl}${txHash}`);
        } else {
            MyToast.submitResult(toastStatusEnum.failed, '', `${explorerUrl}${txHash}`);
        }
        console.log('res 交易信息', res);
    } catch (error: any) {
        if (txHash) {
            MyToast.submitResult(toastStatusEnum.failed, '', `${explorerUrl}${txHash}`);
        } else {
            if (error?.code === 4001) {
                // 弹窗拒绝
                MyToast.submitResult(toastStatusEnum.failed, 'Sign Denied');
            } else {
                MyToast.submitResult(toastStatusEnum.failed, 'Failed');
            }
            callBack();
        }
        throw error;
    }
    // 也可以主动通过交易hash,查询交易信息
    // const txInfo = await web3.eth.getTransactionReceipt(txHash);
    // console.log(txInfo);
};
