import dayjs from 'dayjs';
import { decimalismToHex, hexToDecimalism } from '@/utils/decimalSystem';
import {
    getMetaMaskChainID,
    switchOrAddChainToMetaMask,
    lendContract
} from '@/helper/metaMaskHelper';
import { DEFAULT_DISPLAY_TEXT } from '@/constants';
import { getLendInfoAPI } from '@/api/lend'; // getLendInfoAPI
import type { IResponseLendInfo, TokenOptionItem } from '@/types/interface/lend.interface';
import { dayjsFormatDate, getTimestamp, formatTimestampToDay } from '@/utils/time';
import { formatBigNumber, bigNumberMultiply, moveDecimal } from '@/utils/calculate';
import { useGlobalStore } from '@/store/modules/global';
import { handle404 } from '@/composables/index';
import { handleInputValue2, handleInputValue3 } from '@/helper/inputHelper';

export const useLend = () => {
    const route = useRoute();
    const router = useRouter();
    const globalStore = useGlobalStore();

    const maxRentPeirod = 364;
    const minRentPeirod = 1;
    const lendLoading = ref(false);
    const showDateConfilctTip = ref(false);
    const showUnitPriceTip = ref(false);
    const showMinRentalPeirodTip = ref(false);
    const unitPriceInput = ref('');
    const minRentalPeirodInput = ref('');
    let showUnitPriceTipTimer: number;
    let showMinRentalPeirodTimer: number;
    const nftId = route.params.nftId as string;
    const nftInfo = reactive({
        tokenId: '',
        collectionName: '',
        nftIamge: '',
        nftOwner: '',
        onftId: '',
        onftAddr: '',
        donftId: '',
        donftAddr: '',
        chainId: '',
        marketContractAddress: '',
        explorerUrl: '',
        lenderAddr: '',
        serviceFee: 0
    });

    const currentTokenId = ref('');

    const tokenOptions = ref<TokenOptionItem[]>([]);
    const onSelectedToken = (value: string) => {
        currentTokenId.value = value;
    };

    const currrentTokenInfo = computed(() => {
        const filterData = tokenOptions.value.filter((item) => item.value == currentTokenId.value);
        return filterData[0] || {};
    });

    const currentTime = ref(dayjs());
    const rentUntilDate = ref(currentTime.value.add(180, 'day'));

    const isAuth = (nftOwner: string, lenderAddr: string, isAllowLend: boolean) => {
        return (
            (nftOwner === globalStore.account || lenderAddr === globalStore.account) && isAllowLend
        );
    };

    const getLendInfo = async (nftId: string): Promise<IResponseLendInfo | undefined> => {
        lendLoading.value = true;
        try {
            const { data } = await getLendInfoAPI(nftId);
            if (data) {
                // 登陆了但是owner 不是自己跳转到nft 详情页面
                if (isAuth(data.nft_owner, data.lender_addr, data.is_allow_lend)) {
                    lendLoading.value = false;
                } else {
                    goItemDetails(nftId);
                    return;
                }
            } else {
                globalStore.show500 = true;
            }
            return data;
        } catch (error) {
            console.log(error);
            handle404(error);
            lendLoading.value = false;
        }
    };

    const goBack = () => {
        if (history.length > 1) {
            router.back();
        } else {
            goItemDetails(nftId);
        }
        console.log('回到上一页或者跳到nft 详情页');
    };

    const handleShowUnitPriceTipTimer = () => {
        showUnitPriceTipTimer && clearTimeout(showUnitPriceTipTimer);
        showUnitPriceTip.value = true;
        showUnitPriceTipTimer = window.setTimeout(() => {
            showUnitPriceTip.value = false;
        }, 3000);
    };

    watch(
        unitPriceInput,
        (newValue, oldValue) => {
            const { handleValue, isNeedShowTip } = handleInputValue3(newValue, oldValue);
            unitPriceInput.value = handleValue;
            isNeedShowTip && handleShowUnitPriceTipTimer();
        },
        {
            flush: 'post'
        }
    );

    const handleShowMinRentalPeirodTimer = () => {
        showMinRentalPeirodTimer && clearTimeout(showMinRentalPeirodTimer);
        showMinRentalPeirodTip.value = true;
        showMinRentalPeirodTimer = window.setTimeout(() => {
            showMinRentalPeirodTip.value = false;
        }, 3000);
    };

    watch(
        minRentalPeirodInput,
        (newValue, oldValue) => {
            const { handleValue, isNeedShowTip } = handleInputValue2(
                newValue,
                oldValue,
                minRentPeirod,
                maxRentPeirod
            );
            minRentalPeirodInput.value = handleValue;
            isNeedShowTip && handleShowMinRentalPeirodTimer();
        },
        {
            flush: 'post'
        }
    );

    const displayPrice = computed(() => {
        return formatBigNumber(Number(unitPriceInput.value) || 0);
    });

    const earningsPrice = computed(() => {
        return formatBigNumber(
            bigNumberMultiply(Number(unitPriceInput.value) || 0, 1 - nftInfo.serviceFee)
        );
    });

    const disPlayRentUntilDate = computed(() => {
        return dayjsFormatDate(rentUntilDate.value);
    });

    const contractPricePerDay = computed(() => {
        return moveDecimal(unitPriceInput.value || 0, currrentTokenInfo.value.decimals);
    });
    const contractMaxEndTime = computed(() => {
        return rentUntilDate.value.unix();
    });
    const contractMinDuration = ref(24 * 60 * 60);

    const displayRentalPeirod = ref('1-180');
    const displayRentalPeirodUnit = ref('days');

    watch([minRentalPeirodInput, rentUntilDate], () => {
        const currnetMinDay = Number(minRentalPeirodInput.value) || 1;
        const intervalTime = rentUntilDate.value.unix() - getTimestamp();
        const currentRentUntilDay = intervalTime <= 0 ? 0 : formatTimestampToDay(intervalTime);
        if (currnetMinDay > currentRentUntilDay) {
            showDateConfilctTip.value = true;
            displayRentalPeirod.value = currentRentUntilDay.toString();
            displayRentalPeirodUnit.value = currentRentUntilDay > 1 ? 'days' : 'day';
            contractMinDuration.value = currentRentUntilDay * 24 * 60 * 60;
        } else if (currnetMinDay < currentRentUntilDay) {
            showDateConfilctTip.value = false;
            displayRentalPeirod.value = `${currnetMinDay}-${currentRentUntilDay}`;
            displayRentalPeirodUnit.value = currentRentUntilDay > 1 ? 'days' : 'day';
            contractMinDuration.value = currnetMinDay * 24 * 60 * 60;
        } else {
            showDateConfilctTip.value = false;
            displayRentalPeirod.value = currentRentUntilDay.toString();
            displayRentalPeirodUnit.value = currentRentUntilDay > 1 ? 'days' : 'day';
            contractMinDuration.value = currentRentUntilDay * 24 * 60 * 60;
        }
    });

    const buttonText = computed(() => {
        return !lendLoading.value ? 'Lend' : DEFAULT_DISPLAY_TEXT;
    });

    const goItemDetails = (nftId: string) => {
        router.replace(`/itemDetails/${nftId}`);
    };

    const showWalletSwitchPopover = ref(false);

    const closeWalletSwitchPopover = () => {
        showWalletSwitchPopover.value = false;
    };
    const currentChainName = ref('');

    const switchChain = async () => {
        try {
            const hexadecimal = decimalismToHex(nftInfo.chainId);
            const chainInfo = globalStore.chainsMapGetter[nftInfo.chainId];
            console.log(chainInfo.addChainParameter);
            await switchOrAddChainToMetaMask(hexadecimal, [chainInfo.addChainParameter]);
        } catch (error) {
            console.log('切换链失败', error);
        } finally {
            showWalletSwitchPopover.value = false;
        }
    };

    const showLoadingPopover = ref(false);
    const closeLoadingPopover = () => {
        showLoadingPopover.value = false;
    };

    const lendFn = async () => {
        // 1.获取下钱包china_id 是否与当前nft china_id 匹配，不匹配的话，弹框提示用户切换网络
        const metaMaskChainID = await getMetaMaskChainID();
        if (hexToDecimalism(metaMaskChainID) !== nftInfo.chainId) {
            showWalletSwitchPopover.value = true;
        } else {
            // 2.调用智能合约的方法，挂单
            showLoadingPopover.value = true;
            console.log('contractMaxEndTime', contractMaxEndTime.value.toString());
            lendContract(
                nftInfo.marketContractAddress,
                !Boolean(nftInfo.lenderAddr),
                {
                    erc4907NftAddress: nftInfo.onftAddr,
                    pricePerDay: contractPricePerDay.value,
                    doNftAddress: nftInfo.donftAddr,
                    maxEndTime: contractMaxEndTime.value.toString(),
                    erc4907NftId: nftInfo.onftId,
                    paymentToken: currrentTokenInfo.value.payment_token_addr,
                    minDuration: contractMinDuration.value.toString(),
                    orderType: 0,
                    privateOrderRenter: '0x0000000000000000000000000000000000000000',
                    doNftId: nftInfo.donftId
                },
                nftInfo.explorerUrl,
                () => {
                    showLoadingPopover.value = false;
                }
            );
        }
    };

    onMounted(async () => {
        // 没有登陆直接跳转到nft 详情页面
        if (!globalStore.isConnect) {
            goItemDetails(nftId);
            return;
        }
        const data = await getLendInfo(nftId);
        if (data) {
            tokenOptions.value = data.payment_token_list.map((item) => {
                const id = item.name + item.symbol;
                if (item.is_origin) {
                    currentTokenId.value = id;
                }
                return {
                    ...item,
                    imgUrl: item.icon,
                    label: item.symbol,
                    value: id
                };
            });
            nftInfo.tokenId = data.nft_token_id;
            nftInfo.collectionName = data.collection_name;
            nftInfo.nftIamge = data.nft_image;
            nftInfo.nftOwner = data.nft_owner;
            nftInfo.onftId = data.onft_id;
            nftInfo.onftAddr = data.onft_addr;
            nftInfo.donftId = data.donft_id;
            nftInfo.donftAddr = data.donft_addr;
            nftInfo.chainId = data.chain_id;
            nftInfo.lenderAddr = data.lender_addr;
            nftInfo.serviceFee = data.service_fee;
            const currentChainInfo = globalStore.chainsMapGetter[data.chain_id];
            if (currentChainInfo) {
                currentChainName.value = currentChainInfo.chainName;
                nftInfo.marketContractAddress =
                    currentChainInfo.contractAddress.marketContractAddress;
                nftInfo.explorerUrl = currentChainInfo.explorerUrl;
            }
        }
    });

    // 切换账户地址，owner 不等于用户当前地址，跳转至nft details
    watch(
        () => globalStore.account,
        (newValue) => {
            if (nftInfo.nftOwner !== newValue) {
                goItemDetails(nftId);
            }
        }
    );

    return {
        goBack,
        lendLoading,
        showUnitPriceTip,
        currentTokenId,
        tokenOptions,
        onSelectedToken,
        unitPriceInput,
        showMinRentalPeirodTip,
        minRentalPeirodInput,
        rentUntilDate,
        currentTime,
        showDateConfilctTip,
        displayPrice,
        currrentTokenInfo,
        maxRentPeirod,
        displayRentalPeirod,
        displayRentalPeirodUnit,
        disPlayRentUntilDate,
        earningsPrice,
        buttonText,
        nftInfo,
        lendFn,
        showWalletSwitchPopover,
        closeWalletSwitchPopover,
        currentChainName,
        switchChain,
        showLoadingPopover,
        closeLoadingPopover
    };
};
